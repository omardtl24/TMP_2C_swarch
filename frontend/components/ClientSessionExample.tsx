"use client";

import { SessionProvider, useSession } from "next-auth/react";

const ClientSessionExample = () => {
	const { data: session } = useSession();
	return (
		<SessionProvider>
			<p>{session ? `Welcome ${session.user?.name}` : "Not signed in"}</p>
		</SessionProvider>
	);
};

export default ClientSessionExample;
