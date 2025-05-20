// Centralized endpoints for all microservices
// Usa variables separadas para SSR (interno) y browser (público)
export const ENDPOINTS = {
  users: {
    ssr: process.env.NEXT_PUBLIC_USERS_MICROSERVICE_URL?.trim().replace(/\/$/, ""),
    browser: process.env.NEXT_PUBLIC_USERS_MICROSERVICE_PUBLIC_URL?.trim().replace(/\/$/, ""),
  },
  community: {
    ssr: process.env.NEXT_PUBLIC_COMMUNITY_MICROSERVICE_URL?.trim().replace(/\/$/, ""),
    browser: process.env.NEXT_PUBLIC_COMMUNITY_MICROSERVICE_PUBLIC_URL?.trim().replace(/\/$/, ""),
  },
  personal: {
    ssr: process.env.NEXT_PUBLIC_PERSONAL_MICROSERVICE_URL?.trim().replace(/\/$/, ""),
    browser: process.env.NEXT_PUBLIC_PERSONAL_MICROSERVICE_PUBLIC_URL?.trim().replace(/\/$/, ""),
  },
};
