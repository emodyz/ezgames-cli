// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var bridge_pb = require('./bridge_pb.js');

function serialize_bridge_HelloReply(arg) {
  if (!(arg instanceof bridge_pb.HelloReply)) {
    throw new Error('Expected argument of type bridge.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_HelloReply(buffer_arg) {
  return bridge_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bridge_HelloRequest(arg) {
  if (!(arg instanceof bridge_pb.HelloRequest)) {
    throw new Error('Expected argument of type bridge.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_HelloRequest(buffer_arg) {
  return bridge_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The greeting service definition.
var BridgeService = exports.BridgeService = {
  // Sends a greeting
sayHello: {
    path: '/bridge.Bridge/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.HelloRequest,
    responseType: bridge_pb.HelloReply,
    requestSerialize: serialize_bridge_HelloRequest,
    requestDeserialize: deserialize_bridge_HelloRequest,
    responseSerialize: serialize_bridge_HelloReply,
    responseDeserialize: deserialize_bridge_HelloReply,
  },
};

exports.BridgeClient = grpc.makeGenericClientConstructor(BridgeService);
