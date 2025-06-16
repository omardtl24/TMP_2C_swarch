"use client";
import Image from "next/image";
import { sizeClasses } from "./IconProps";

interface CuentasClarasIconProps {
	className?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	onClick?: () => void;
}
const CuentasClarasIcon = ({
	className,
	size = "md",
	onClick,
}: CuentasClarasIconProps) => {
	return (
		<Image
			src="/images/CuentasClaras.svg"
			alt="Logo"
			width={50}
			height={50}
			className={`${sizeClasses[size]} ${className ?? ""} ${
				onClick ? "cursor-pointer" : ""
			}`}
			onClick={onClick}
		/>
	);
};

export default CuentasClarasIcon;
