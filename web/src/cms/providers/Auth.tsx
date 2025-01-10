"use client";

import { User } from "@/payload-types";
import React, { createContext, useCallback, useContext, useState } from "react";
import { rest } from "./rest";

export type ResetPassword = (args: {
  password: string;
  passwordConfirm: string;
  token: string;
}) => Promise<User>;

export type ForgotPassword = (args: { email: string }) => Promise<User>;

export type Create = (args: {
  email: string;
  name: string;
  lastName: string;
  password: string;
}) => Promise<User>;

export type Login = (args: Partial<User>) => Promise<User>;

export type Logout = () => Promise<void>;

export interface AuthContext {
  create: Create;
  login: Login;
  externalLogin: Login;
  logout: Logout;
  permissions?: null | Permissions;
  setPermissions: (permissions: null | Permissions) => void;
  setUser: (user: null | User) => void;
  user?: null | User;
}

const Context = createContext({} as AuthContext);

export default function CMSAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<null | User>();
  const [permissions, setPermissions] = useState<null | Permissions>(null);

  const create = useCallback<Create>(async (args) => {
    const user = await rest(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
      args
    );
    setUser(user);
    return user as User;
  }, []);

  const login = useCallback<Login>(async (args) => {
    const user = await rest(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
      args
    );
    setUser(user);
    return user as User;
  }, []);

  const logout = useCallback<Logout>(async () => {
    await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`);
    setUser(null);
    return;
  }, []);

  const externalLogin = useCallback<Login>(async (args) => {
    const user = await rest(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/external-users/login`,
      args
    );
    setUser(user);
    return user as User;
  }, []);

  // On mount, get user and set
  /* useEffect(() => {
    const fetchMe = async () => {
      const user = await rest(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
        {},
        {
          method: "GET",
        }
      );
      setUser(user);
    };

    void fetchMe();
  }, []); */

  return (
    <Context.Provider
      value={{
        create,
        login,
        externalLogin,
        logout,
        permissions,
        setPermissions,
        setUser,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
}

type UseAuth = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
