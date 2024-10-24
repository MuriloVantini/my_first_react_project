import ActionButton from "./action";
import { CircleUserRound } from "lucide-react";
import { LogOut } from "lucide-react";
import { User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "@/components/ui/button";
import myAxios from "@/api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const handleLogout = async () => {
    setLoading(true);
    try {
      await myAxios.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gray-100 h-16 fixed top-0 w-full items">
      <div className="flex justify-between p-4">
        <div className="text-gray-900 flex items-center">MyLogo.png</div>
        <div className="text-gray-500 flex flex-row gap-2 justify-evenly">
          <ActionButton params={{ name: "Posts", linkto: "/" }} />
          <ActionButton
            params={{ name: "Minhas Curtidas", linkto: "/profile" }}
          />
          <Popover open={open}>
            <PopoverTrigger onClick={()=>setOpen(true)}>
              <CircleUserRound />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-start">
                  <span className="block text-sm text-gray-900 dark:text-gray-900">
                    Murilo Vantini
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    email@gmail.com
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User />
                  Ver perfil
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? "" : <LogOut />}
                  {loading ? "Saindo..." : "Logout"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
