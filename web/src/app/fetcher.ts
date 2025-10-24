import { DocumentNode } from "graphql";
import request, { Variables } from "graphql-request";

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());

const endpoint = process.env.NEXT_PUBLIC_SERVER_URL!;

export const gFetcher = async <T>([query, variables]: [DocumentNode, Variables]) => {
  return request<T>(endpoint, query, variables);
};