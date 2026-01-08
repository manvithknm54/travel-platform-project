import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../services/apiClient";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("globetrooter_token");
    if (!token) return;

    apiClient.get("/users/me").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
