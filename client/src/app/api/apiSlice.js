import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, storeReducer) => {
    const accessToken = storeReducer.getState().auth.token;
    if (accessToken) {
      headers.set("authorization", "Bearer " + accessToken);
    }
    return headers;
  },
});

const baseQueryReAuth = async (args, api, extraOptions) => {
  console.log(args, api, extraOptions);
  let result = await baseQuery(args, api, extraOptions);

  // call api first time

  if (result?.error?.status === 403) {
    // the first api call fail because the access token has expired

    // call api to get new token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult.data) {
      // if has data, mean the refresh token still not expire so can call again the api
      api.dispatch(getAccessToken({ ...refreshResult.data }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "You login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryReAuth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
