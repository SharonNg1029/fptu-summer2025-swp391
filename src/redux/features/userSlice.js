import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // Lưu thông tin đăng nhập của user vào state
      return action.payload;
    },
    logout: () => {
      // Xoá thông tin đăng nhập của user khỏi state
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
