
import { UserRound } from 'lucide-react';
import MenuIcon from "./Icons/MenuIcon";
import CuentasClarasIcon from "./Icons/CuentasClarasIcon";

const Navbar = () => {
    return(

        <nav className="sticky top-0 right-0 left-0 bg-surface h-16 w-full flex flex-row items-center  justify-between px-4 rouned-b-md shadow-md shadow-primary-80/50"> 
            <MenuIcon className="fill-primary-50" size="md"/>
            <CuentasClarasIcon size="lg"/>
            <UserRound className=" md:block stroke-primary-50" size={25} />
                

        </nav>
    )
}

export default Navbar;