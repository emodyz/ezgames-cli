// package: helloWorld
// file: helloWorld.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as helloWorld_pb from "./helloWorld_pb";

interface IGreeterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sayHello: IGreeterService_ISayHello;
}

interface IGreeterService_ISayHello extends grpc.MethodDefinition<helloWorld_pb.HelloRequest, helloWorld_pb.HelloReply> {
    path: "/helloWorld.Greeter/SayHello";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<helloWorld_pb.HelloRequest>;
    requestDeserialize: grpc.deserialize<helloWorld_pb.HelloRequest>;
    responseSerialize: grpc.serialize<helloWorld_pb.HelloReply>;
    responseDeserialize: grpc.deserialize<helloWorld_pb.HelloReply>;
}

export const GreeterService: IGreeterService;

export interface IGreeterServer extends grpc.UntypedServiceImplementation {
    sayHello: grpc.handleUnaryCall<helloWorld_pb.HelloRequest, helloWorld_pb.HelloReply>;
}

export interface IGreeterClient {
    sayHello(request: helloWorld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: helloWorld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: helloWorld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
}

export class GreeterClient extends grpc.Client implements IGreeterClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sayHello(request: helloWorld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: helloWorld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: helloWorld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: helloWorld_pb.HelloReply) => void): grpc.ClientUnaryCall;
}
