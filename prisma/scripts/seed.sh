#!/bin/sh

set -e

tsx prisma/scripts/seed-offchain.ts
tsx prisma/scripts/seed-onchain.ts