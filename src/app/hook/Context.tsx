"use client";
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { fetchconfig } from './FetchConfig';

interface ConfigurationProps {
  App_Name: string;
  admin: {
    Username: string;
    Password: string;
  };
  UpdateUserToken: {
    hour: number;
    minute: number;
  };
  userLoggin: {
    label: string;
  };
  RegisterOptions: string[];
  RandomColor: {
    BackGround: string[];
    Text: string[];
  };
}

interface AppContextType {
  Change: number;
  setChange: (value: number | ((prev: number) => number)) => void;
  Access: boolean;
  setAccess: (value: boolean) => void;
  setShowAbsen: (value: boolean) => void;
  ShowAbsen: boolean;
  Config: ConfigurationProps | null;
  setConfig: (value: ConfigurationProps | null) => void;
  Domain: string
  setDomain: (value: string) => void;
  SavedDomain: boolean
  setSavedDomain: (value: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Change, setChange] = useState<number>(0);
  const [Access, setAccess] = useState<boolean>(true);
  const [Domain, setDomain] = useState<string>('')
  const [ShowAbsen, setShowAbsen] = useState<boolean>(false);
  const [Config, setConfig] = useState<ConfigurationProps | null>(null);
  const [SavedDomain, setSavedDomain] = useState<boolean>(false)

  useEffect(() => {
    const CheckedUsers = async () => {
      if (typeof window !== "undefined") {
        const admAc = await localStorage.getItem('adm_ac');
        const userLoggin = await localStorage.getItem('user');
        const CheckDomain = localStorage.getItem('Domain')
        if (CheckDomain) {
          setDomain(CheckDomain)
          setSavedDomain(true)
        }
        if (admAc && userLoggin) {
          setAccess(true);
        }
      }
    };
    CheckedUsers();
  }, [Access]);

  useEffect(() => {
    if (Domain) {
      const initialize = async () => {
        try {
          const data = await fetchconfig(Domain);
          setConfig(data);
        } catch (error) {
          console.error("Error fetching config:", error);
        } finally {
          setAccess(false);
        }
      };
      initialize()
    }
  }, [Domain, SavedDomain])

  return (
    <AppContext.Provider value={{ Change, setChange, Access, setAccess, ShowAbsen, setShowAbsen, Config, setConfig, setDomain, Domain, setSavedDomain, SavedDomain }}>
      {children}
    </AppContext.Provider>
  );
};
