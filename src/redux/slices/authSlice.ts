"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface userProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  companyAddress: string;
  companyName: string;
  industry: string;
  picture: string;
}

export interface AuthState {
  token: string | any;
  user: userProps | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: "",
  user: {
    id: "",
    name: "",
    picture: "",
    email: "",
    phone: "",
    companyAddress: "",
    companyName: "",
    industry: "",
    position: "",
  },
  isAuthenticated: false,
};

export const AuthSlice = createSlice({
  name: "media_flow",
  initialState,
  reducers: {
    login: (state: AuthState, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state: AuthState) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state: AuthState, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, updateUser, logout } = AuthSlice.actions;
export default AuthSlice;
