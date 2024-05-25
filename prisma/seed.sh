#!/bin/sh

set -e

tsx prisma/seed-offchain.ts
tsx prisma/seed-onchain.ts