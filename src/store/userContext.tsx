import myAxios from "@/api/axiosInstance";
import UserModel from "@/models/userModel";
import { createContext, ReactNode, useEffect, useState } from "react";

const user: UserModel = {
  id: 1,
  name: "Carregando...",
  email: "Carregando...",
  comments: [],
  like_posts: [],
};

interface UserContextInterface {
  user: UserModel,
}
const userContext = createContext<UserContextInterface>({user});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [requestedUser, setUser] = useState<UserContextInterface>({user});
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await myAxios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser({user: response.data.data[0]});
          console.log(response.data.data[0]);
        }
        if (response.status !== 200) {
          throw new Error("Erro ao buscar usuário");
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    fetchUser();
  }, [user]);
  
  return <userContext.Provider value={requestedUser}>{children}</userContext.Provider>;
};

export { UserContextProvider, userContext };
