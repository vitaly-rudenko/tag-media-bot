/* eslint-disable */
import type { Empty } from "../google/protobuf/empty";

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

export interface TagsService {
  Create(request: CreateTag): Promise<Empty>;
  Search(request: SearchTags): Promise<SearchResults>;
}
