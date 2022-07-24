#!/usr/bin/env zx
import 'zx/globals';

const [src, dist] = ['src', 'dist'];

await $`rm -rf ${dist}`;
await $`prisma generate`;
await $`swc ${src} -d ${dist} -C minify`;

const files = await glob(`${src}/graphql/**/*.gql`);
await Promise.all(files.map(file => $`cp ${file} ${file.replace(src, dist)}`));
