// Moves stored dates so that time-dependent rules can be checked without
// waiting days: the SQL helpers H1 to H4 of the scenarios' README (section
// 3.4). They are setup only; every expected result is still read in the
// browser or in Mailpit. They need direct database access, which only the
// stack from ci/compose.yml publishes (DATABASE_URL), so a spec that uses
// them skips elsewhere.
import pg from 'pg'
import { env } from './env.js'

export function timeshiftAvailable(): boolean {
  return env.databaseUrl !== ''
}

async function run(sql: string, email: string): Promise<void> {
  const client = new pg.Client({ connectionString: env.databaseUrl })
  await client.connect()
  try {
    const result = await client.query(sql, [email])
    if (result.rowCount === 0) throw new Error(`time shift for ${email} matched no row`)
  } finally {
    await client.end()
  }
}

/** H1: the current period (trial or paid) ended one minute ago; the expiry job then makes the subscription past due. */
export function endPeriod(ownerEmail: string): Promise<void> {
  return run(
    `UPDATE subscriptions SET current_period_end = now() - interval '1 minute'
     WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
    ownerEmail,
  )
}

/** H2: the grace period ended one minute ago; the expiry job then suspends the subscription. */
export function endGrace(ownerEmail: string): Promise<void> {
  return run(
    `UPDATE subscriptions SET grace_period_end = now() - interval '1 minute'
     WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
    ownerEmail,
  )
}
