import ActionButton from "./action"
import { CircleUserRound } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { User } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import { Button } from "@/components/ui/button"


const Navbar = () => {
    return (
        <nav className='bg-gray-900 h-16 fixed top-0 w-full items'>
            <div className="flex justify-between p-4">
                <div className="text-white flex items-center">
                    MyLogo.png
                </div>
                <div className="text-gray-50 flex flex-row gap-2 justify-evenly">
                    <ActionButton name="Post" />
                    <ActionButton name="Login" />
                    <Popover>
                        <PopoverTrigger>
                            <CircleUserRound />
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col items-start">
                                    <span className="block text-sm text-gray-900 dark:text-white">Murilo Vantini</span>
                                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">email@gmail.com</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="w-full">
                                    <User />
                                    Ver perfil
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <LogOut />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
