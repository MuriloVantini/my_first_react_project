import "./index.css";
import Navbar from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import UserModel from "./models/userModel";
import { useEffect, useState } from "react";
import myAxios from "./api/axiosInstance";
import CircularLoading from "./components/loading/circularLoading";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserModel | null>(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await myAxios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser(response.data.data[0]);
          console.log(response.data.data[0]);
        }
        if (response.status !== 200) {
          throw new Error("Erro ao buscar usuário");
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <CircularLoading url={myAxios.defaults.baseURL + "/profile"} />;
  if (error) return <div>Erro: {error}</div>;
  return (
    <>
      <Navbar {...user!} />
      <Outlet />
      <Toaster
        richColors
        duration={3500}
        theme="light"
        position="top-right"
        visibleToasts={5}
      />
    </>
  );
}

export default App;
