import { Menu } from "lucide-react";
import Image from "next/image";
import { UserRound } from 'lucide-react';

const Navbar = () => {
    return(

        <nav className="sticky top-0 right-0 left-0 bg-surface h-16 w-full flex flex-row items-center  justify-between px-4 rouned-b-md">
            <Menu className="md:hidden" />
            <Image
                src="/images/Cuentas_claras_icono.png"
                alt="Logo"
                width={50}
                height={50}
                className="md:block"
            />
            <UserRound className=" md:block" />
                

        </nav>
    )
}

export default Navbar;