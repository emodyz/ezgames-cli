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

function serialize_bridge_EmptyMessage(arg) {
  if (!(arg instanceof bridge_pb.EmptyMessage)) {
    throw new Error('Expected argument of type bridge.EmptyMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_EmptyMessage(buffer_arg) {
  return bridge_pb.EmptyMessage.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_bridge_UpgradeCpRequest(arg) {
  if (!(arg instanceof bridge_pb.UpgradeCpRequest)) {
    throw new Error('Expected argument of type bridge.UpgradeCpRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bridge_UpgradeCpRequest(buffer_arg) {
  return bridge_pb.UpgradeCpRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
    requestType: bridge_pb.EmptyMessage,
    responseType: bridge_pb.GetCpVersionReply,
    requestSerialize: serialize_bridge_EmptyMessage,
    requestDeserialize: deserialize_bridge_EmptyMessage,
    responseSerialize: serialize_bridge_GetCpVersionReply,
    responseDeserialize: deserialize_bridge_GetCpVersionReply,
  },
  checkForCpUpdate: {
    path: '/bridge.Bridge/CheckForCpUpdate',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.EmptyMessage,
    responseType: bridge_pb.CheckForCpUpdateReply,
    requestSerialize: serialize_bridge_EmptyMessage,
    requestDeserialize: deserialize_bridge_EmptyMessage,
    responseSerialize: serialize_bridge_CheckForCpUpdateReply,
    responseDeserialize: deserialize_bridge_CheckForCpUpdateReply,
  },
  upgradeCp: {
    path: '/bridge.Bridge/UpgradeCp',
    requestStream: false,
    responseStream: false,
    requestType: bridge_pb.UpgradeCpRequest,
    responseType: bridge_pb.EmptyMessage,
    requestSerialize: serialize_bridge_UpgradeCpRequest,
    requestDeserialize: deserialize_bridge_UpgradeCpRequest,
    responseSerialize: serialize_bridge_EmptyMessage,
    responseDeserialize: deserialize_bridge_EmptyMessage,
  },
};

exports.BridgeClient = grpc.makeGenericClientConstructor(BridgeService);
