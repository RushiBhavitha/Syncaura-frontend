import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  font: "Arial",
  fontSize: "medium",
  zoom: 100,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFont: (state, action) => {
      state.font = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
  },
});

export const { setTheme, setFont, setFontSize, setZoom } = uiSlice.actions;
export default uiSlice.reducer;