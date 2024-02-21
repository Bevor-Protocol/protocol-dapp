# Setup

`yarn install`

The project is configured to use Husky + lint-staging for pre-commit hooks, which rely on prettier, eslint, and prisma for formatting the schema file. We use a postgres DB.

`cp .env.example .env.local`

In `DATABASE_URL` you'll likely need to update `<username>` to be your device's username, run `whoami` to grab this. The `<db_name>` can be whatever you'd like as we'll only be running this locally, I used `bevor`. We'll by default run it on localhost port 5432.

When running `prisma` cli scripts, we'll specify the `.env.local` file through the `dotenv-cli` tool to tell prisma where to look for the environment variables, this is all handled in the package.json file.

# DB Setup

We rely on Neon's serverless postgresql DB + Prisma ORM client. Neon separates storage + compute, and supports branching. Neon has support for Prisma for direct connections and pooled connections, which requires slightly more configuration.

To set the DB up, make sure the environment variables are set. For local testing, we can rely on a local connection.

Run `yarn run db:migrate`, which will re-run the existing migration history and generate the prisma client. **This will only be run in development**. It will essentially run `yarn run db:generate` under the hood. On first pass, there will be no new migrations to generate (assuming you hadn't touched the schema.prisma file), so it'll just apply existing migrations to your local DB. Also, it'll seed the DB under the hood.

Seeding occurs whenever you manually tell it to `yarn run db:seed`, or automatically when running `yarn run db:migrate` (when there are history conflicts / DB schema drift) and `yarn run db:reset`

If you are simply prototyping, you can use the following, which won't apply migrations to the DB. Use this until the schema + DB are in a state that you're comfortable with adding to the migration history.
`yarn run db:push`

If changes are made to the schema, we can run this to generate new migrations, apply changes to the DB and generate a new prisma client. Can run this once it's in a stable state (after `db:push` to test changes).
`yarn run db:migrate`

Again, whenever you update the Prisma schema, you'll need to run `yarn run db:push` or `yarn run db:migrate` to updated the DB. It keeps the DB schema in sync with the Prisma schema, and both will generate the Prisma Client.

# Connecting to the Local DB

You can use `psql` to observe the DB locally. Running `psql -l` will show your databases.

There are 2 ways to connect to the DB instance:

`psql -U <username> -d <dbname>`

`psql "postgresql://<username>@localhost:5432/<dbname>"`

You can also use the prisma studio `yarn db:studio` to connect to a GUI on localhost:5555 to interact with the data.

NEON will generate a new DB branch for each Vercel branch. Vercel's env config will update to reflect the new connection string for each DB branch.

# Notes

When deploying Prisma to Vercel, Vercel automatically caches dependencies on deployment. This might result in an outdated version of the Prisma Client when the Prisma schema updates. To be safe, we add a `beforebuild` script to the package.json file to explicitly call `prisma generate` before the `next build` occurs. The build is followed by a `predeploy` script, which runs `prisma migrate deploy`.
