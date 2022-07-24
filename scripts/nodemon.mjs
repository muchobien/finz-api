#!/usr/bin/env zx
import 'zx/globals';

const [src, dist] = ['src', 'dist'];

await $`rm -rf ${dist}`;
await $`swc ${src} -d ${dist}`;

const files = await glob(`${src}/graphql/**/*.gql`);
await Promise.all(files.map(file => $`cp ${file} ${file.replace(src, dist)}`));

await $`node --experimental-specifier-resolution=node --inspect ${dist}/main.js`;
