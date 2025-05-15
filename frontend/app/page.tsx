import { getSession } from "@/lib/getSession";
import type { Session } from "@/lib/types";
import HomePageContent from "@/components/HomePage/HomePageContent";

export default async function HomePage() {
  const session: Session | null = await getSession();
  return <HomePageContent session={session} />;
}