/* eslint-disable */
import Long from "long";
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ServiceError,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "bridge";

/** The request message containing the user's name. */
export interface HelloRequest {
  name: string;
}

/** The response message containing the greetings */
export interface HelloReply {
  message: string;
}

export interface GetVersionRequest {}

export interface GetVersionReply {
  version: string;
}

function createBaseHelloRequest(): HelloRequest {
  return { name: "" };
}

export const HelloRequest = {
  encode(
    message: HelloRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HelloRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
    };
  },

  toJSON(message: HelloRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<HelloRequest>, I>>(
    object: I
  ): HelloRequest {
    const message = createBaseHelloRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseHelloReply(): HelloReply {
  return { message: "" };
}

export const HelloReply = {
  encode(
    message: HelloReply,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HelloReply {
    return {
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: HelloReply): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<HelloReply>, I>>(
    object: I
  ): HelloReply {
    const message = createBaseHelloReply();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseGetVersionRequest(): GetVersionRequest {
  return {};
}

export const GetVersionRequest = {
  encode(
    _: GetVersionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVersionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVersionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetVersionRequest {
    return {};
  },

  toJSON(_: GetVersionRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVersionRequest>, I>>(
    _: I
  ): GetVersionRequest {
    const message = createBaseGetVersionRequest();
    return message;
  },
};

function createBaseGetVersionReply(): GetVersionReply {
  return { version: "" };
}

export const GetVersionReply = {
  encode(
    message: GetVersionReply,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVersionReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVersionReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVersionReply {
    return {
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: GetVersionReply): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVersionReply>, I>>(
    object: I
  ): GetVersionReply {
    const message = createBaseGetVersionReply();
    message.version = object.version ?? "";
    return message;
  },
};

/** The greeting service definition. */
export const BridgeService = {
  /** Sends a greeting */
  sayHello: {
    path: "/bridge.Bridge/SayHello",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: HelloRequest) =>
      Buffer.from(HelloRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => HelloRequest.decode(value),
    responseSerialize: (value: HelloReply) =>
      Buffer.from(HelloReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => HelloReply.decode(value),
  },
  /** Get the current version of the control panel */
  getVersion: {
    path: "/bridge.Bridge/GetVersion",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetVersionRequest) =>
      Buffer.from(GetVersionRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetVersionRequest.decode(value),
    responseSerialize: (value: GetVersionReply) =>
      Buffer.from(GetVersionReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetVersionReply.decode(value),
  },
} as const;

export interface BridgeServer extends UntypedServiceImplementation {
  /** Sends a greeting */
  sayHello: handleUnaryCall<HelloRequest, HelloReply>;
  /** Get the current version of the control panel */
  getVersion: handleUnaryCall<GetVersionRequest, GetVersionReply>;
}

export interface BridgeClient extends Client {
  /** Sends a greeting */
  sayHello(
    request: HelloRequest,
    callback: (error: ServiceError | null, response: HelloReply) => void
  ): ClientUnaryCall;
  sayHello(
    request: HelloRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: HelloReply) => void
  ): ClientUnaryCall;
  sayHello(
    request: HelloRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: HelloReply) => void
  ): ClientUnaryCall;
  /** Get the current version of the control panel */
  getVersion(
    request: GetVersionRequest,
    callback: (error: ServiceError | null, response: GetVersionReply) => void
  ): ClientUnaryCall;
  getVersion(
    request: GetVersionRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetVersionReply) => void
  ): ClientUnaryCall;
  getVersion(
    request: GetVersionRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetVersionReply) => void
  ): ClientUnaryCall;
}

export const BridgeClient = makeGenericClientConstructor(
  BridgeService,
  "bridge.Bridge"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): BridgeClient;
  service: typeof BridgeService;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
