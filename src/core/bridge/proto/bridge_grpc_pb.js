// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var bridge_pb = require('./bridge_pb.js');

function serialize_bridge_GetVersionReply(arg) {
  if (!(arg instanceof bridge_pb.GetVersionReply)) {
    throw new Error('Expected argument of type bridge.GetVersionReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_GetVersionReply(buffer_arg) {
  return bridge_pb.GetVersionReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bridge_GetVersionRequest(arg) {
  if (!(arg instanceof bridge_pb.GetVersionRequest)) {
    throw new Error('Expected argument of type bridge.GetVersionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_GetVersionRequest(buffer_arg) {
  return bridge_pb.GetVersionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

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
  // Get the current version of the control panel
getVersion: {
    path: '/bridge.Bridge/GetVersion',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.GetVersionRequest,
    responseType: bridge_pb.GetVersionReply,
    requestSerialize: serialize_bridge_GetVersionRequest,
    requestDeserialize: deserialize_bridge_GetVersionRequest,
    responseSerialize: serialize_bridge_GetVersionReply,
    responseDeserialize: deserialize_bridge_GetVersionReply,
  },
};

exports.BridgeClient = grpc.makeGenericClientConstructor(BridgeService);
