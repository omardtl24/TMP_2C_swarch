import { auth } from "@/auth";
import HomePageContent from "@/components/HomePage/HomePageContent";

export default async function HomePage() {
  const session = await auth();
  return <HomePageContent session={session} />;
}
