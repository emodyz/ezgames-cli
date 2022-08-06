// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var bridge_pb = require('./bridge_pb.js');

function serialize_bridge_CheckForCpUpdateReply(arg) {
  if (!(arg instanceof bridge_pb.CheckForCpUpdateReply)) {
    throw new Error('Expected argument of type bridge.CheckForCpUpdateReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_CheckForCpUpdateReply(buffer_arg) {
  return bridge_pb.CheckForCpUpdateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bridge_CheckForCpUpdateRequest(arg) {
  if (!(arg instanceof bridge_pb.CheckForCpUpdateRequest)) {
    throw new Error('Expected argument of type bridge.CheckForCpUpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_CheckForCpUpdateRequest(buffer_arg) {
  return bridge_pb.CheckForCpUpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bridge_GetCpVersionReply(arg) {
  if (!(arg instanceof bridge_pb.GetCpVersionReply)) {
    throw new Error('Expected argument of type bridge.GetCpVersionReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_GetCpVersionReply(buffer_arg) {
  return bridge_pb.GetCpVersionReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bridge_GetCpVersionRequest(arg) {
  if (!(arg instanceof bridge_pb.GetCpVersionRequest)) {
    throw new Error('Expected argument of type bridge.GetCpVersionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_GetCpVersionRequest(buffer_arg) {
  return bridge_pb.GetCpVersionRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
getCpVersion: {
    path: '/bridge.Bridge/GetCpVersion',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.GetCpVersionRequest,
    responseType: bridge_pb.GetCpVersionReply,
    requestSerialize: serialize_bridge_GetCpVersionRequest,
    requestDeserialize: deserialize_bridge_GetCpVersionRequest,
    responseSerialize: serialize_bridge_GetCpVersionReply,
    responseDeserialize: deserialize_bridge_GetCpVersionReply,
  },
  checkForCpUpdate: {
    path: '/bridge.Bridge/CheckForCpUpdate',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.CheckForCpUpdateRequest,
    responseType: bridge_pb.CheckForCpUpdateReply,
    requestSerialize: serialize_bridge_CheckForCpUpdateRequest,
    requestDeserialize: deserialize_bridge_CheckForCpUpdateRequest,
    responseSerialize: serialize_bridge_CheckForCpUpdateReply,
    responseDeserialize: deserialize_bridge_CheckForCpUpdateReply,
  },
};

exports.BridgeClient = grpc.makeGenericClientConstructor(BridgeService);
