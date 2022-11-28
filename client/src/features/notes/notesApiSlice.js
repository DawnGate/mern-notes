import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

// using entity adapter meaning using optimise management state in redux
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNote: builder.query({
      query: () => "/notes",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "List" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "List" }];
      },
    }),
    addNote: builder.mutation({
      query: (newNote) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...newNote,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "List" }],
    }),
    updateNote: builder.mutation({
      query: (updateNote) => ({
        url: "/posts",
        method: "PATCH",
        body: {
          ...updateNote,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Note", id: arg.id }];
      },
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => {
        return [
          { type: "Note", id: arg.id },
          {
            type: "Note",
            id: "LIST",
          },
        ];
      },
    }),
  }),
});

// hook auto create from slice
export const {
  useGetNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNote.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  // normalized state object with ids and entity
  (notesResult) => notesResult.data
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
