import { createSlice } from "@reduxjs/toolkit";
import {
  authSignUp,
  authSignIn,
  authSignOut,
  authStateChangedUser,
} from "./authOperations";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    email: null,
    name: null,
    photo: null,
    isAuth: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    updateAvatar(state, { payload }) {
      state.photo = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authSignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authSignUp.fulfilled, (state, { payload }) => {
        const { email, uid, displayName, photo } = payload;
        state.id = uid;
        state.email = email;
        state.photo = photo;
        state.name = displayName;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(authSignUp.rejected, (state, { payload }) => {
        state.id = null;
        state.email = null;
        state.name = null;
        state.photo = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(authSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authSignIn.fulfilled, (state, { payload }) => {
        const { email, uid, displayName, photo } = payload;
        state.id = uid;
        state.email = email;
        state.photo = photo;
        state.name = displayName;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(authSignIn.rejected, (state, { payload }) => {
        state.id = null;
        state.email = null;
        state.name = null;
        state.photo = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(authSignOut.fulfilled, (state) => {
        state.isAuth = false;
        state.id = null;
        state.email = null;
        state.name = null;
        state.photo = null;
        state.isLoading = false;
      })
      .addCase(authStateChangedUser.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authStateChangedUser.fulfilled, (state, { payload }) => {
        const { email, userId, name, photo, isAuth } = payload;
        state.id = userId;
        state.email = email;
        state.photo = photo;
        state.name = name;
        state.isAuth = isAuth;
        state.isLoading = false;
      })
      .addCase(authStateChangedUser.rejected, (state, { payload }) => {
        state.id = null;
        state.email = null;
        state.name = null;
        state.photo = null;
        state.isAuth = false;
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { updateAvatar } = authSlice.actions;
export default authSlice.reducer;
