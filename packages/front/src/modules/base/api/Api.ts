import type { paths } from "common/build-api-schema";
import createClient, {
  createFinalURL,
  createQuerySerializer,
} from "openapi-fetch";

export const Api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

export function generateRequestGetPath<
  TPath extends {
    [K in keyof paths]: paths[K] extends { get: object } ? K : never;
  }[keyof paths],
>(path: TPath, params: paths[TPath]["get"]["parameters"]) {
  return createFinalURL(path, {
    baseUrl: import.meta.env.VITE_API_URL,
    params,
    querySerializer: createQuerySerializer(),
  });
}

export function generateRequestPostPath<
  TPath extends {
    [K in keyof paths]: paths[K] extends { post: object } ? K : never;
  }[keyof paths],
>(path: TPath, params: paths[TPath]["post"]["parameters"]) {
  return createFinalURL(path, {
    baseUrl: import.meta.env.VITE_API_URL,
    params,
    querySerializer: createQuerySerializer(),
  });
}

// // eslint-disable-next-line react-hooks/rules-of-hooks
// Api.use({
//   onRequest: async ({ request }) => {
//     return new Request(request, { signal: AbortSignal.timeout(10000) });
//   },
//   onError: async ({ error }) => {
//     if (error instanceof Error) {
//       if (error.name === "TimeoutError") {
//         return new Response(EApiFailCode.TIMEOUT, { status: 408 });
//       }
//       return error;
//     }
//   },
// });

export type InferApiResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath] extends {
  [K in TMethod]: {
    responses: { "200": { content: { "application/json": unknown } } };
  };
}
  ? paths[TPath][TMethod]["responses"]["200"]["content"]["application/json"]
  : never;

export type InferApiGetResponse<TPath extends keyof paths> = InferApiResponse<
  TPath,
  "get"
>;
export type InferApiPostResponse<TPath extends keyof paths> = InferApiResponse<
  TPath,
  "post"
>;
export type InferApiPutResponse<TPath extends keyof paths> = InferApiResponse<
  TPath,
  "put"
>;
export type InferApiDeleteResponse<TPath extends keyof paths> =
  InferApiResponse<TPath, "delete">;

export type InferApiRequest<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath] extends {
  [K in TMethod]: {
    requestBody?: { content: { "application/json": unknown } };
  };
}
  ? NonNullable<
      paths[TPath][TMethod]["requestBody"]
    >["content"]["application/json"]
  : never;

export type InferApiGetRequest<TPath extends keyof paths> = InferApiRequest<
  TPath,
  "get"
>;
export type InferApiPostRequest<TPath extends keyof paths> = InferApiRequest<
  TPath,
  "post"
>;
export type InferApiPutRequest<TPath extends keyof paths> = InferApiRequest<
  TPath,
  "put"
>;
export type InferApiDeleteRequest<TPath extends keyof paths> = InferApiRequest<
  TPath,
  "delete"
>;

export type InferApiQuery<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath] extends {
  [K in TMethod]: {
    parameters: { query?: unknown };
  };
}
  ? NonNullable<paths[TPath][TMethod]["parameters"]["query"]>
  : never;

export type InferApiGetQuery<TPath extends keyof paths> = InferApiQuery<
  TPath,
  "get"
>;
export type InferApiPostQuery<TPath extends keyof paths> = InferApiQuery<
  TPath,
  "post"
>;
export type InferApiPutQuery<TPath extends keyof paths> = InferApiQuery<
  TPath,
  "put"
>;
export type InferApiDeleteQuery<TPath extends keyof paths> = InferApiQuery<
  TPath,
  "delete"
>;
