// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var helloWorld_pb = require('./helloWorld_pb.js');

function serialize_helloWorld_HelloReply(arg) {
  if (!(arg instanceof helloWorld_pb.HelloReply)) {
    throw new Error('Expected argument of type helloWorld.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_helloWorld_HelloReply(buffer_arg) {
  return helloWorld_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_helloWorld_HelloRequest(arg) {
  if (!(arg instanceof helloWorld_pb.HelloRequest)) {
    throw new Error('Expected argument of type helloWorld.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_helloWorld_HelloRequest(buffer_arg) {
  return helloWorld_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The greeting service definition.
var GreeterService = exports.GreeterService = {
  // Sends a greeting
sayHello: {
    path: '/helloWorld.Greeter/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: helloWorld_pb.HelloRequest,
    responseType: helloWorld_pb.HelloReply,
    requestSerialize: serialize_helloWorld_HelloRequest,
    requestDeserialize: deserialize_helloWorld_HelloRequest,
    responseSerialize: serialize_helloWorld_HelloReply,
    responseDeserialize: deserialize_helloWorld_HelloReply,
  },
};

exports.GreeterClient = grpc.makeGenericClientConstructor(GreeterService);
