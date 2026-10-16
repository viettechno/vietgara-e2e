// A TOTP authenticator app (RFC 6238: HMAC-SHA1, 6 digits, 30 seconds) for
// the MFA scenarios. The backend accepts a step once and only within one
// step of its clock, so `code()` hands out the next step that is still
// usable: the current one first, the following one right after, and then
// it waits for the clock to catch up (that wait can take up to 30 s, so
// specs that need a third code raise their timeout).
import { createHmac } from 'node:crypto'

const PERIOD_SECONDS = 30
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function decodeBase32(secret: string): Buffer {
  let bits = ''
  for (const char of secret.replace(/=+$/, '').toUpperCase()) {
    const value = BASE32.indexOf(char)
    if (value < 0) throw new Error(`not a base32 secret: ${secret}`)
    bits += value.toString(2).padStart(5, '0')
  }
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2))
  return Buffer.from(bytes)
}

export function totpAt(secret: string, step: number): string {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const hash = createHmac('sha1', decodeBase32(secret)).update(counter).digest()
  const offset = (hash[hash.length - 1] ?? 0) & 0x0f
  const value = hash.readUInt32BE(offset) & 0x7fffffff
  return String(value % 1_000_000).padStart(6, '0')
}

export class Authenticator {
  private lastStep = 0

  constructor(private readonly secret: string) {}

  /** A code the backend has not seen from this authenticator. */
  async code(): Promise<string> {
    const step = Math.max(this.lastStep + 1, Math.floor(Date.now() / 1000 / PERIOD_SECONDS))
    // The backend accepts a step one ahead of its clock, not two.
    const wait = (step - 1) * PERIOD_SECONDS * 1000 - Date.now()
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
    this.lastStep = step
    return totpAt(this.secret, step)
  }

  /** The code `code()` returned last: the backend must refuse it as already used. */
  stale(): string {
    return totpAt(this.secret, this.lastStep)
  }
}
