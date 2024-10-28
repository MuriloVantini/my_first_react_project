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
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "@/store/userContext";

const Navbar = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
            <PopoverTrigger onClick={() => setOpen(!open)}>
              <CircleUserRound />
            </PopoverTrigger>
            <PopoverContent ref={popoverRef} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-start">
                  <span className="block text-sm text-gray-900 dark:text-gray-900">
                    {user.name}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {user.email}
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
