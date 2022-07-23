#!/bin/bash
realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

SCRIPT_DIR=$(realpath "$0")
BASE_DIR=$(dirname "${SCRIPT_DIR}")
PHP_DIR="${BASE_DIR}"/../../MultigamingPanel/bridge
PROTO_DEST=./src/core/bridge/proto

# JavaScript code generation
yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_opt=env=node \
    --ts_proto_opt=outputServices=grpc-js \
    --ts_proto_out=grpc_js:${PROTO_DEST} \
    --ts_proto_opt=esModuleInterop=true \
    --grpc_out=grpc_js:${PROTO_DEST} \
    -I "${BASE_DIR}"/proto \
    "${BASE_DIR}"/proto/*.proto

# PHP code generation
protoc --plugin=protoc-gen-grpc="${BASE_DIR}"/grpc_php_plugin_new\
       --php_out="${PHP_DIR}" \
       --grpc_out=generate_server:"${PHP_DIR}" \
       -I "${BASE_DIR}"/proto \
       "${BASE_DIR}"/proto/*.proto
