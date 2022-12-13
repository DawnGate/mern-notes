import { apiSlice } from "../../app/api/apiSlice";
import { getAccessToken, logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    authen: builder.mutation({
      query: (authenPayload) => ({
        url: "/auth",
        method: "POST",
        body: {
          ...authenPayload,
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (state, { dispatch, queryFulfilled }) => {
        try {
          // query have fulfilled
          await queryFulfilled;
          // clear all date in apiSlice and logout
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      onQueryStarted: async (state, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(getAccessToken({ ...data }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useRefreshMutation, useLogoutMutation, useAuthenMutation } =
  authApiSlice;
