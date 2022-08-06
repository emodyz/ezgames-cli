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

export interface CheckForCpUpdateRequest {}

export interface CheckForCpUpdateReply {
  target: string;
}

export interface GetCpVersionRequest {}

export interface GetCpVersionReply {
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

function createBaseCheckForCpUpdateRequest(): CheckForCpUpdateRequest {
  return {};
}

export const CheckForCpUpdateRequest = {
  encode(
    _: CheckForCpUpdateRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CheckForCpUpdateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckForCpUpdateRequest();
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

  fromJSON(_: any): CheckForCpUpdateRequest {
    return {};
  },

  toJSON(_: CheckForCpUpdateRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckForCpUpdateRequest>, I>>(
    _: I
  ): CheckForCpUpdateRequest {
    const message = createBaseCheckForCpUpdateRequest();
    return message;
  },
};

function createBaseCheckForCpUpdateReply(): CheckForCpUpdateReply {
  return { target: "" };
}

export const CheckForCpUpdateReply = {
  encode(
    message: CheckForCpUpdateReply,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CheckForCpUpdateReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckForCpUpdateReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.target = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckForCpUpdateReply {
    return {
      target: isSet(object.target) ? String(object.target) : "",
    };
  },

  toJSON(message: CheckForCpUpdateReply): unknown {
    const obj: any = {};
    message.target !== undefined && (obj.target = message.target);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckForCpUpdateReply>, I>>(
    object: I
  ): CheckForCpUpdateReply {
    const message = createBaseCheckForCpUpdateReply();
    message.target = object.target ?? "";
    return message;
  },
};

function createBaseGetCpVersionRequest(): GetCpVersionRequest {
  return {};
}

export const GetCpVersionRequest = {
  encode(
    _: GetCpVersionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCpVersionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCpVersionRequest();
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

  fromJSON(_: any): GetCpVersionRequest {
    return {};
  },

  toJSON(_: GetCpVersionRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCpVersionRequest>, I>>(
    _: I
  ): GetCpVersionRequest {
    const message = createBaseGetCpVersionRequest();
    return message;
  },
};

function createBaseGetCpVersionReply(): GetCpVersionReply {
  return { version: "" };
}

export const GetCpVersionReply = {
  encode(
    message: GetCpVersionReply,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== "") {
      writer.uint32(10).string(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCpVersionReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCpVersionReply();
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

  fromJSON(object: any): GetCpVersionReply {
    return {
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: GetCpVersionReply): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCpVersionReply>, I>>(
    object: I
  ): GetCpVersionReply {
    const message = createBaseGetCpVersionReply();
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
  getCpVersion: {
    path: "/bridge.Bridge/GetCpVersion",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetCpVersionRequest) =>
      Buffer.from(GetCpVersionRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetCpVersionRequest.decode(value),
    responseSerialize: (value: GetCpVersionReply) =>
      Buffer.from(GetCpVersionReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetCpVersionReply.decode(value),
  },
  checkForCpUpdate: {
    path: "/bridge.Bridge/CheckForCpUpdate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckForCpUpdateRequest) =>
      Buffer.from(CheckForCpUpdateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CheckForCpUpdateRequest.decode(value),
    responseSerialize: (value: CheckForCpUpdateReply) =>
      Buffer.from(CheckForCpUpdateReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckForCpUpdateReply.decode(value),
  },
} as const;

export interface BridgeServer extends UntypedServiceImplementation {
  /** Sends a greeting */
  sayHello: handleUnaryCall<HelloRequest, HelloReply>;
  /** Get the current version of the control panel */
  getCpVersion: handleUnaryCall<GetCpVersionRequest, GetCpVersionReply>;
  checkForCpUpdate: handleUnaryCall<
    CheckForCpUpdateRequest,
    CheckForCpUpdateReply
  >;
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
  getCpVersion(
    request: GetCpVersionRequest,
    callback: (error: ServiceError | null, response: GetCpVersionReply) => void
  ): ClientUnaryCall;
  getCpVersion(
    request: GetCpVersionRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetCpVersionReply) => void
  ): ClientUnaryCall;
  getCpVersion(
    request: GetCpVersionRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetCpVersionReply) => void
  ): ClientUnaryCall;
  checkForCpUpdate(
    request: CheckForCpUpdateRequest,
    callback: (
      error: ServiceError | null,
      response: CheckForCpUpdateReply
    ) => void
  ): ClientUnaryCall;
  checkForCpUpdate(
    request: CheckForCpUpdateRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CheckForCpUpdateReply
    ) => void
  ): ClientUnaryCall;
  checkForCpUpdate(
    request: CheckForCpUpdateRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CheckForCpUpdateReply
    ) => void
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
