import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";

const providers: Provider[] = [Google];

export const providerMap = providers
	.map((provider) => {
		if (typeof provider === "function") {
			const providerData = provider();
			return { id: providerData.id, name: providerData.name };
		} else {
			return { id: provider.id, name: provider.name };
		}
	})
	.filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers,
	pages: {
		signIn: "/login",
		error: "/login-error",
	},
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async signIn({ user, account, profile }) {
			/*
			user: es el usuario autenticado, puede incluir información como id, name, email, image.
			account: contiene información sobre el proveedor, por ejemplo: provider, type, providerAccountId, y los tokens de acceso si están disponibles.
			profile: es el perfil OAuth retornado por Google. Incluye atributos como email, email_verified, name, given_name, family_name, picture, entre otros.
			*/

			 // Dummy: Simular consulta a la base de datos para saber si el usuario existe
			// En el futuro aquí deberías hacer un fetch a tu backend para verificar existencia
			const email = user?.email || profile?.email;
			const usuarioExiste = email && !email.endsWith("@nuevo.com");

			if (!usuarioExiste) {
				// Redirigir a /register para completar el registro y aceptar términos
				return "/register";
			}

			// Si el usuario existe, permitir el acceso
			return true;
		},
	},
});
