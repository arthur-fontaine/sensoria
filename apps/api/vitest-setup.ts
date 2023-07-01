// run "pnpm start-database" with exec

import { execSync } from 'node:child_process'

const vitestSetup = async () => {
  console.log('Creating test database...')
  execSync('pnpm start-database')
  console.log('Test database created')

  console.log('Running migrations and seeds...')
  execSync('NODE_ENV=test pnpm seed:run -- --reset')
  console.log('Migrations and seeds complete')

  console.log('Starting database...')
  execSync('pnpm start-database')
  console.log('Database started')
}

export {
  vitestSetup as setup,
}
