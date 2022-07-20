#!/usr/bin/env zx
import 'zx/globals';

await $`rm -rf dist`;
await $`prisma generate`;
await $`swc src -d dist -C minify`;
