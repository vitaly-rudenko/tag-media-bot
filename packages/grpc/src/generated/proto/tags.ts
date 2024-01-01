/* eslint-disable */
import { ChannelCredentials, Client, makeGenericClientConstructor, Metadata } from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../google/protobuf/empty";
import Long = require("long");

export const protobufPackage = "tags";

export enum MediaType {
  AUDIO = 0,
  VIDEO = 1,
  PHOTO = 2,
  DOCUMENT = 3,
  GIF = 4,
  MPEG4_GIF = 5,
}

export interface CreateTag {
  readonly authorUserId: number;
  readonly type: MediaType;
  readonly fileUniqueId: string;
  readonly fileId: string;
  readonly fileName?: string | undefined;
  readonly values: readonly string[];
}

export interface SearchTags {
  readonly query: string;
  readonly limit: number;
  readonly authorUserId?: number | undefined;
}

export interface SearchResults {
  readonly items: readonly SearchResultItem[];
}

export interface SearchResultItem {
  readonly fileId: string;
  readonly type: MediaType;
  readonly fileName?: string | undefined;
}

function createBaseCreateTag(): CreateTag {
  return { authorUserId: 0, type: 0, fileUniqueId: "", fileId: "", fileName: undefined, values: [] };
}

export const CreateTag = {
  encode(message: CreateTag, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authorUserId !== 0) {
      writer.uint32(8).int64(message.authorUserId);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.fileUniqueId !== "") {
      writer.uint32(26).string(message.fileUniqueId);
    }
    if (message.fileId !== "") {
      writer.uint32(34).string(message.fileId);
    }
    if (message.fileName !== undefined) {
      writer.uint32(42).string(message.fileName);
    }
    for (const v of message.values) {
      writer.uint32(50).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTag {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTag() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.authorUserId = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.fileUniqueId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.fileId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.fileName = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.values.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseSearchTags(): SearchTags {
  return { query: "", limit: 0, authorUserId: undefined };
}

export const SearchTags = {
  encode(message: SearchTags, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.query !== "") {
      writer.uint32(10).string(message.query);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.authorUserId !== undefined) {
      writer.uint32(24).int64(message.authorUserId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchTags {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchTags() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.query = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.authorUserId = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseSearchResults(): SearchResults {
  return { items: [] };
}

export const SearchResults = {
  encode(message: SearchResults, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      SearchResultItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchResults {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchResults() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items.push(SearchResultItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

function createBaseSearchResultItem(): SearchResultItem {
  return { fileId: "", type: 0, fileName: undefined };
}

export const SearchResultItem = {
  encode(message: SearchResultItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fileId !== "") {
      writer.uint32(10).string(message.fileId);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.fileName !== undefined) {
      writer.uint32(26).string(message.fileName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchResultItem {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchResultItem() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fileId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.fileName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
};

export interface TagsService {
  create(request: CreateTag): Promise<Empty>;
  search(request: SearchTags): Promise<SearchResults>;
}

export const TagsServiceServiceName = "tags.TagsService";
export class TagsServiceClientImpl implements TagsService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || TagsServiceServiceName;
    this.rpc = rpc;
    this.create = this.create.bind(this);
    this.search = this.search.bind(this);
  }
  create(request: CreateTag): Promise<Empty> {
    const data = CreateTag.encode(request).finish();
    const promise = this.rpc.request(this.service, "Create", data);
    return promise.then((data) => Empty.decode(_m0.Reader.create(data)));
  }

  search(request: SearchTags): Promise<SearchResults> {
    const data = SearchTags.encode(request).finish();
    const promise = this.rpc.request(this.service, "Search", data);
    return promise.then((data) => SearchResults.decode(_m0.Reader.create(data)));
  }
}

export type TagsServiceService = typeof TagsServiceService;
export const TagsServiceService = {
  create: {
    path: "/tags.TagsService/Create",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateTag) => Buffer.from(CreateTag.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateTag.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
  search: {
    path: "/tags.TagsService/Search",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SearchTags) => Buffer.from(SearchTags.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SearchTags.decode(value),
    responseSerialize: (value: SearchResults) => Buffer.from(SearchResults.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SearchResults.decode(value),
  },
} as const;

export interface TagsServiceServer extends UntypedServiceImplementation {
  create: handleUnaryCall<CreateTag, Empty>;
  search: handleUnaryCall<SearchTags, SearchResults>;
}

export interface TagsServiceClient extends Client {
  create(request: CreateTag, callback: (error: ServiceError | null, response: Empty) => void): ClientUnaryCall;
  create(
    request: CreateTag,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  create(
    request: CreateTag,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  search(request: SearchTags, callback: (error: ServiceError | null, response: SearchResults) => void): ClientUnaryCall;
  search(
    request: SearchTags,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SearchResults) => void,
  ): ClientUnaryCall;
  search(
    request: SearchTags,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SearchResults) => void,
  ): ClientUnaryCall;
}

export const TagsServiceClient = makeGenericClientConstructor(TagsServiceService, "tags.TagsService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): TagsServiceClient;
  service: typeof TagsServiceService;
  serviceName: string;
};

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
