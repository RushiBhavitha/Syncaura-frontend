import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDocuments,
  createDocument,
  deleteDocument,
} from "../features/documentThunks";

const initialState = {
  documents: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    resetDocuments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
      })

      // Delete
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
      });
  },
});

export const { resetDocuments } = documentSlice.actions;
export default documentSlice.reducer;
