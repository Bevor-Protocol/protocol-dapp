#!/bin/bash

# Step 1: Create the migration (up migration) without applying it
npx prisma migrate dev --create-only

# Step 2: Get the latest migration name
LATEST_MIGRATION=$(basename $(dirname $(ls -t prisma/migrations/*/*.sql | head -n 1)))

# Step 3: Create the "down" migration folder if it doesn't exist
DOWN_MIGRATION_DIR="prisma/down/$LATEST_MIGRATION"
mkdir -p "$DOWN_MIGRATION_DIR"

# Step 4: Generate the diff for the down migration and save it in the down migration folder
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script > "$DOWN_MIGRATION_DIR/migration.sql"

