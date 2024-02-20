# Setup

We rely on Neon's postgresql DB + Prisma ORM client.

To set this up, make sure the environment variables are set. For local testing, we can rely on a local psql connection.

Reset the DB:
`yarn run db:reset`

Migrate the DB + seed it.
`yarn run db:migrate`


If any changes are made to the schema / migrations, we can run `yarn run db:migrate` again.