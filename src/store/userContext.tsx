import myAxios from "@/api/axiosInstance";
import UserModel from "@/models/userModel";
import { createContext, ReactNode, useEffect, useState } from "react";

const user: UserModel = {
  id: -1,
  name: "Carregando...",
  email: "Carregando...",
  comments: [],
  like_posts: [],
};

interface UserContextInterface {
  user: UserModel;
  loading: boolean;
}
const userContext = createContext<UserContextInterface>({
  user: user,
  loading: true,
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [requestedUser, setUser] = useState<UserContextInterface>({
    user: user,
    loading: true,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await myAxios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser({ user: response.data.data[0], loading: false });
        }
      } catch (error) {
        console.error("Erro ao buscar o usuário:", error);
      } finally {
        setUser((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUser();
  }, [user]);

  return (
    <userContext.Provider value={requestedUser}>
      {children}
    </userContext.Provider>
  );
};

export { UserContextProvider, userContext };
