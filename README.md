# Setup

We rely on Neon's serverless postgresql DB + Prisma ORM client. Neon separates storage + compute + supports branching. Neon has support for Prisma for direct connections and pooled connections, which requires slightly more configuration.

To set the DB up, make sure the environment variables are set. For local testing, we can rely on a local connection.

First we need to generate the prisma client (ONLY IN DEVELOPMENT):
`yarn run db:generate`

We can reset the DB, which will drop the DB/schema if possible, then create a new one while applying all migrations, and also run the seed script (ONLY IN DEVELOPMENT):
`yarn run db:reset`

Seeding occurs whenever you manually tell it to `yarn run db:seed`, or automatically when running `yarn run db:migrate` (when there are history conflicts / DB schema drift) and `yarn run db:reset`

If changes are made to the schema, we can run this to generate new migrations, apply changes to the DB and generate a new prisma client
`yarn run db:migrate`
