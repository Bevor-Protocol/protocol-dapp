# Overview

**Bevor** relies on several different components:

1. NextJS application
2. PostgreSQL + Prisma Client
3. Vercel Blob Storage
4. Smart Contracts + Blockchain Data

1-3 are managed through this repository. 4 is managed through the `bevor-v1` repository.

# Package + Env setup

1. Install packages
   `yarn install`

2. Copy the example env variables to a local env
   `cp .env.example .env.local`

3. Configure the local env file
   In `DATABASE_URL` you'll likely need to update `<username>` to be your device's username, run `whoami` to grab this. The `<db_name>` can be whatever you'd like for local development, I used `bevor`. We'll by default run it on localhost:5432.

# DB setup

1. Make sure `psql` is installed:
   Run `psql --version`. If it is installed, skip to (3)

2. Install postgresql
   Run `brew install postgresql@15`. The install will show you some instructions for adding psql to PATH. Make sure to follow that.

3. Make sure postgresql is running locally
   Run `brew services info --all`. If you see that `postgresql` is running and loaded, you can skip all remaining steps. Also, running `brew services list` will show which services homebrew manages and their corresponding statuses.

4. Start the postgres server
   Run `brew services start postgresql`. It will default run on localhost:5432. You can stop the service by running `brew services stop postgresql`

_(Feel free to ignore this portion)_
Once the postgres service is running, you can use `psql` to observe the DB locally. Running `psql -l` will show your databases.

There are 2 ways to connect to the DB instance, if needed. `<username>` and `<dbname>` correspond to the values set in your .env.local file. If you had never started the server (and never created the DB instance for this project), these likely will not work:

`psql -U <username> -d <dbname>`

`psql "postgresql://<username>@localhost:5432/<dbname>"`

You can also use the prisma studio `yarn db:studio` to connect to a GUI on localhost:5555 to interact with the data.

In practice, we use Neon to manage our postgres database, but locally, we'll rely on the homebrew postgres instance.

# Prisma Client setup

To set up the prisma client, make sure the environment variables are set. For local testing, we can rely on a local connection that was setup above.

**Generate the Prisma Client**
Run `yarn run db:generate`, which will re-run the existing migration history and generate the prisma client. If it is your first pass at setting up the repository, you'll need to run this.

By default, the Prisma Client is generated into `./node_modules/.prisma/client`

**Seeding the DB**
As we're integrating both off-chain (postgres) and on-chain (blockchain) data, seeding is a bit more confusing than normal. **Should only be used in local development**.

#### Steps:

1. Open the `bevor-v1` repository in the terminal
2. Start the local blockchain via hardhat
3. Open a new terminal, deploy the smart contracts in `bevor-v1` to the local blockchain via hardhat
4. Navigate back to this repository.

**If it is your first time interacting with the repository, simply run `yarn db:seed`. Otherwise, follow below.**

There are a few options that can be taken after this. Seeding is partitioned into 2 scripts: `prisma/seed-onchain.ts` and `prisma/seed-offchain.ts`. This is useful for preventing having to regenerate off-chain (postgres) data every time the local blockchain is reset.

Running `prisma/seed-onchain.ts` when the local blockchain is not empty will result in failure.
Running `prisma/seed-offchain.ts` when the local postgres instance is not empty will result in failure.

**Option 1**:
Run `yarn db:reset`. This will clear all existing data in the local postgres DB, then run the `prisma/seed.sh` script. This will seed off-chain data, then on-chain, sequentially.

**Option 2**:
Run `yarn db:seed`. This will do the same as above, without clearing initial data. This will fail if the data already exists, as we have unique constraints on certain fields. You can run `yarn db:clear` to wipe the DB, then `yarn db:seed`. Running these 2 has the same effect as Option 1. This option is only useful if the DB is initially empty.

**Option 3**:
If your off-chain data is already seeded, but the local blockchain had been reset, you can standalone run the on-chain seeding using `yarn db:seed:onchain`. This will execute on-chain transactions and populate the postgres instance with appropriate on-chain references.

**Option 4**:
Manually seed both off-chain and on-chain data, sequentially. Run `yarn db:seed:offchain` (this will fail if the postgres DB is already populated). Then run `yarn db:seed:onchain` (this will fail if the local blockchain had already run this seeding script's onchain txns). Running in the wrong order can lead to failures, as the postgres observations won't exist yet for the on-chain data to populate.

_Note: whenever changes are made to the prisma schema, you need to run `yarn run db:generate` to update the Prisma Client._

**Managing Changes**
If changes are made to the Prisma schema during local development, you can run `yarn run db:push` to quickly iterate on syncing the prisma schema with the DB schema, without creating migrations.

Once a desired "end state" is reached in development, you can actually create the necessary migrations by running `yarn run db:migrate`

If you want to undo `yarn run db:push` experiments, you can run `yarn run db:reset`, which will also run the seed script. `yarn run db:clear` does the same, without seeding.

# Notes

When deploying Prisma to Vercel, Vercel automatically caches dependencies on deployment. This might result in an outdated version of the Prisma Client when the Prisma schema updates. To be safe, we use the `vercel-build` script to the `package.json` file, where we generate the prisma client, deploy our migrations (if any new ones exist), THEN build the nextJS app.
