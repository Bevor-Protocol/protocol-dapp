#!/bin/sh

set -e

tsx db/scripts/seed-offchain.ts
tsx db/scripts/seed-onchain.ts