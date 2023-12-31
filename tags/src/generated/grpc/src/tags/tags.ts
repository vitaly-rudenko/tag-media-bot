/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "../../google/protobuf/empty";

export const protobufPackage = "tags";

export enum MediaType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  PHOTO = "PHOTO",
  DOCUMENT = "DOCUMENT",
  GIF = "GIF",
  MPEG4_GIF = "MPEG4_GIF",
}

export interface CreateTag {
  authorUserId: number;
  type: MediaType;
  fileUniqueId: string;
  fileId: string;
  fileName?: string | undefined;
  values: string[];
}

export interface SearchTags {
  query: string;
  limit: number;
  authorUserId?: number | undefined;
}

export interface SearchResults {
  items: SearchResultItem[];
}

export interface SearchResultItem {
  fileId: string;
  type: MediaType;
  fileName?: string | undefined;
}

export const TAGS_PACKAGE_NAME = "tags";

export interface TagsServiceClient {
  create(request: CreateTag): Observable<Empty>;

  search(request: SearchTags): Observable<SearchResults>;
}

export interface TagsServiceController {
  create(request: CreateTag): void;

  search(request: SearchTags): Promise<SearchResults> | Observable<SearchResults> | SearchResults;
}

export function TagsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "search"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TagsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TagsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TAGS_SERVICE_NAME = "TagsService";
