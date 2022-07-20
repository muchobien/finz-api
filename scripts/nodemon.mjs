#!/usr/bin/env zx
import 'zx/globals';

await $`swc src -d dist`;
await $`node --experimental-specifier-resolution=node --inspect dist/main.js`;
