#!/bin/bash
realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

SCRIPT_DIR=$(realpath "$0")
BASEDIR=$(dirname "${SCRIPT_DIR}")
#cd ${BASEDIR}/../
echo "${BASEDIR}"

PROTO_DEST=./src/core/bridge/src/proto

# mkdir -p ${PROTO_DEST}

#--js_out=import_style=commonjs,binary:${PROTO_DEST} \
# JavaScript code generation
yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_opt=env=node \
    --ts_proto_opt=outputServices=grpc-js \
    --ts_proto_out=grpc_js:${PROTO_DEST} \
    --grpc_out=grpc_js:${PROTO_DEST} \
    -I "${BASEDIR}"/proto \
    "${BASEDIR}"/proto/*.proto
