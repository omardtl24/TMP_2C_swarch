import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier dominio
      },
    ],
    // O, para permitir todos los dominios (menos seguro, solo para dev):
    // domains: ["*"],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;