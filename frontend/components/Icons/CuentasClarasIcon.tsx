import Image from "next/image";
import { sizeClasses } from "./IconProps";


interface CuentasClarasIconProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';

}
const CuentasClarasIcon = ({className, size="md"}:CuentasClarasIconProps) => {
    return (
        <Image
            src="/images/CuentasClaras.png"
            alt="Logo"
            width={50}
            height={50}
            className={`${sizeClasses[size]} ${className}`}
        />
    )
}

export default CuentasClarasIcon;