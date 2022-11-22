export PATH := "./node_modules/.bin:" + env_var('PATH')

set shell := ["zsh", "-uc"]
set dotenv-load

alias w := watch

default: watch

@transpile:
    rm -rf ./dist
    swc src -d dist > /dev/null

@fix-extension: transpile
    find dist -name '*.js' -exec sh -c 'mv "$1" "${1%.js}.mjs"' _ {} \;
    find dist -name '*.mjs' -exec sh -c 'sed -i "" "s/\.ts/\.mjs/g" "$1"' _ {} \;
    find dist -name '*.mjs' -exec sh -c 'sed -i "" "s/\.js/\.mjs/g" "$1"' _ {} \;

@dev: fix-extension
    node dist/server.mjs

@watch:
    watchexec -r -w src just dev

[no-exit-message]
@exec *args:
    {{args}}