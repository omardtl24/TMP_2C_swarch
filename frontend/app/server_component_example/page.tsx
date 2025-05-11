import { auth } from "@/auth";

export default async function Page() {
	const session = await auth(); // Get the session from the auth function, server-side
	return <p>Welcome {session?.user?.name ?? "Not logged in"}!</p>;
}
