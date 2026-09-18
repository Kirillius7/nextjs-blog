/*
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoles, IRules } from "../../../acl/types";
import { UserRole } from "../../../constants";
import { IClientContainer } from "../di/IClientContainer";

export interface AuthIdentity {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    preferences?: Record<string, any>;
}

export interface AuthState {
    identity: AuthIdentity | null;
    roles: IRoles;
    rules: IRules;
}

const initialState: AuthState = {
    identity: null,
    roles: {},
    rules: {},
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<AuthState>) {
            console.log("SET AUTH:", action.payload);
            state.identity = action.payload.identity;
            state.roles = action.payload.roles;
            state.rules = action.payload.rules;
        },

        clearAuth(state) {
            console.log("CLEAR AUTH");
            state.identity = null;
            state.roles = {};
            state.rules = {};
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;

export const authReducerContainer = (di: IClientContainer) => {
    console.log("AUTH REDUCER CONTAINER CREATED");
    return authSlice.reducer;
};*/