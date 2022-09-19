import React, { useContext, useEffect, useState } from 'react';
import { ApiUser } from '../../../server/src/apiTypes/user';
import { api } from '../../../server/src/apiInterface/index';

interface UserContextInterface {
  register: (username: string, password: string) => Promise<ApiUser | undefined>;
  login: (username: string, password: string) => Promise<ApiUser | undefined>;
  logout: () => void;
  getSelf: () => Promise<ApiUser | undefined>;
}

export const UserContext = React.createContext<ApiUser | null>(null);
const UserInterfaceContext = React.createContext<UserContextInterface | null>(null);

export function UserContextProvider(props: { children: any }) {
  const [user, setUser] = useState<ApiUser | null>(null);

  const register = async (username: string, password: string) => {
    try {
      const newUser = await api.auth.register({ username, password });
      setUser(newUser);
      return newUser;
    } catch (e) {
      // throw e;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const newUser = await api.auth.login({ username, password });
      setUser(newUser);
      return newUser;
    } catch (e) {
      // throw e;
    }
  };

  const logout = async () => {
    await api.auth.logout();
    await getSelf();
  };

  const getSelf = async () => {
    try {
      const newUser = await api.auth.getSelf();
      setUser(newUser);
      return newUser;
    } catch (e) {
      // throw e;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      await getSelf();
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserInterfaceContext.Provider value={{ register, login, logout, getSelf }}>
        {props.children}
      </UserInterfaceContext.Provider>
    </UserContext.Provider>
  );
}

export const useUserInterface = () => useContext(UserInterfaceContext);
export const useUserData = () => useContext(UserContext);
