#!/bin/bash

# Step 1: Get the latest migration name to be reverted
LATEST_MIGRATION=$(basename $(dirname $(ls -t prisma/migrations/*/*.sql | head -n 1)))

DOWN_MIGRATION_DIR="prisma/down/$LATEST_MIGRATION"
UP_MIGRATION_DIR="prisma/migrations/$LATEST_MIGRATION"

# Step 2: Execute the down query
npx prisma db execute --file "$DOWN_MIGRATION_DIR/migration.sql" --schema prisma/schema.prisma

# Step 3: Explicitly delete the migration from the database
ME=$(whoami)
psql -h bevor -U $ME -d "postgresql://$ME@localhost:5432/bevor" -c "DELETE FROM \"_prisma_migrations\" WHERE migration_name = '$LATEST_MIGRATION';"

# Step 4: Create the "down" migration folder if it doesn't exist
rm -rf $DOWN_MIGRATION_DIR
rm -rf $UP_MIGRATION_DIR
