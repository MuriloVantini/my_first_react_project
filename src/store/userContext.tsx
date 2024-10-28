import UserModel from "@/models/userModel";
import { createContext, ReactNode } from "react";

const user: UserModel = {
  id: 1,
  name: "Teste",
  email: "teste@example.com",
  comments: [],
  like_posts: [],
};

interface UserContextInterface {
  user: UserModel,
}
const userContext = createContext<UserContextInterface>({user});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  return <userContext.Provider value={{user}}>{children}</userContext.Provider>;
};

export { UserContextProvider, userContext };
