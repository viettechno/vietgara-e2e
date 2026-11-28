// The print agent's side of its WebSocket (Release 13.1, API Specification
// 10.4), played by a spec: it pairs with the code the web console shows,
// connects through the gateway, reports a printer and answers each job.
import type { ApiClient } from '../api/client.js'
import { env } from './env.js'

type AgentMessage = {
  type: string
  agentId?: string
  job?: { id: string; printer: string; format: string; paperSize?: string; data: string }
}

export type FakeAgent = {
  /** The next job the server sends, with its bytes decoded. */
  nextJob(): Promise<{ id: string; printer: string; format: string; paperSize?: string; data: Buffer }>
  /** Reports a job printed. */
  printed(jobId: string): void
  close(): void
}

/** Exchanges a pairing code for the agent's key (the public call of the agent's setup). */
export async function pairAgent(api: ApiClient, code: string): Promise<string> {
  const paired = await api.withToken(undefined).post<{ agentKey?: string }>('/v1/public/print-agents:pair', {
    pairingCode: code,
    hostname: 'QUAY-PC',
    os: 'windows/amd64',
    version: 'e2e',
  })
  return paired.agentKey ?? ''
}

/** Connects as the agent with its key and reports one printer, XP-80C. */
export async function connectAgent(key: string): Promise<FakeAgent> {
  const url = `${env.apiBaseUrl.replace(/^http/, 'ws')}v1/print-agents/connect`
  const socket = new WebSocket(url, { headers: { Authorization: `Bearer ${key}` } })
  const queue: AgentMessage[] = []
  const waiting: ((message: AgentMessage) => void)[] = []
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data)) as AgentMessage
    const next = waiting.shift()
    if (next) next(message)
    else queue.push(message)
  })
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener('open', () => resolve(), { once: true })
    socket.addEventListener('error', () => reject(new Error('the agent could not connect')), { once: true })
  })

  const read = () => new Promise<AgentMessage>((resolve) => (queue.length > 0 ? resolve(queue.shift()!) : waiting.push(resolve)))
  const send = (message: object) => socket.send(JSON.stringify(message))

  const hello = await read()
  if (hello.type !== 'hello') throw new Error(`expected hello, got ${hello.type}`)
  send({ type: 'printers', hostname: 'QUAY-PC', os: 'windows/amd64', version: 'e2e', printers: [{ name: 'XP-80C', default: true }] })

  return {
    async nextJob() {
      for (;;) {
        const message = await read()
        if (message.type === 'job' && message.job) return { ...message.job, data: Buffer.from(message.job.data, 'base64') }
      }
    },
    printed: (jobId) => send({ type: 'result', jobId, status: 'printed' }),
    close: () => socket.close(),
  }
}
