// The print agent's side of its WebSocket (Release 13.1, API Specification
// 10.4), played by a spec: it pairs with the code the web console shows,
// connects through the gateway, reports a printer and answers each job.
import type { ApiClient } from '../api/client.js'
import { env } from './env.js'

type AgentMessage = {
  type: string
  agentId?: string
  job?: { id: string; printer: string; format: string; paperSize?: string; title: string; data: string }
}

export type FakeAgent = {
  /** The next job the server sends, with its bytes decoded. */
  nextJob(): Promise<{ id: string; printer: string; format: string; paperSize?: string; title: string; data: Buffer }>
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
  if (!paired.agentKey) throw new Error('the pairing answered no agentKey')
  return paired.agentKey
}

/** Connects as the agent with its key and reports one printer, XP-80C. */
export async function connectAgent(key: string): Promise<FakeAgent> {
  const url = `${env.apiBaseUrl.replace(/^http/, 'ws')}v1/print-agents/connect`
  const socket = new WebSocket(url, { headers: { Authorization: `Bearer ${key}` } })
  const queue: AgentMessage[] = []
  const waiting: { resolve: (message: AgentMessage) => void; reject: (error: Error) => void }[] = []
  let closed: Error | undefined
  socket.addEventListener('message', (event) => {
    let message: AgentMessage
    try {
      message = JSON.parse(String(event.data)) as AgentMessage
    } catch {
      return // not a message of the protocol
    }
    const next = waiting.shift()
    if (next) next.resolve(message)
    else queue.push(message)
  })
  // A closed socket fails every read at once, with its code, instead of a test timeout.
  socket.addEventListener('close', (event) => {
    closed = new Error(`the agent's socket closed: ${event.code} ${event.reason}`)
    for (const next of waiting.splice(0)) next.reject(closed)
  })
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener('open', () => resolve(), { once: true })
    socket.addEventListener('error', () => reject(new Error('the agent could not connect')), { once: true })
  })

  const read = () =>
    new Promise<AgentMessage>((resolve, reject) => {
      if (queue.length > 0) resolve(queue.shift()!)
      else if (closed) reject(closed)
      else waiting.push({ resolve, reject })
    })
  const send = (message: object) => socket.send(JSON.stringify(message))

  // A read that waits at most 20 seconds, with a message that says what was missing.
  const within = <T>(promise: Promise<T>, what: string): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`no ${what} reached the agent`)), 20_000)
    })
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
  }

  try {
    const hello = await within(read(), 'hello')
    if (hello.type !== 'hello') throw new Error(`expected hello, got ${hello.type}`)
  } catch (error) {
    socket.close()
    throw error
  }
  send({ type: 'printers', hostname: 'QUAY-PC', os: 'windows/amd64', version: 'e2e', printers: [{ name: 'XP-80C', default: true }] })

  return {
    nextJob: () =>
      within(
        (async () => {
          for (;;) {
            const message = await read()
            if (message.type === 'job' && message.job) return { ...message.job, data: Buffer.from(message.job.data, 'base64') }
          }
        })(),
        'job',
      ),
    printed: (jobId) => send({ type: 'result', jobId, status: 'printed' }),
    close: () => socket.close(),
  }
}
