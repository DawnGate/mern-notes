import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

// using entity adapter meaning using optimise management state in redux
const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "List" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "List" }];
      },
    }),
    // use builder mutation
    addNewUser: builder.mutation({
      // with mutation query will return object {url, method, body}
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (updateUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...updateUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "User", id: arg.id }];
      },
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [
          { type: "User", id: "LIST" },
          { type: "User", id: arg.id },
        ];
      },
    }),
  }),
});

// hook auto create from slice
export const {
  useGetUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// return the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUser.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  // normalized state object with ids and entity
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
