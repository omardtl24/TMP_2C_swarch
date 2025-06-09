import { Button } from "../ui/button";
import { GoogleIcon } from "../Icons/GoogleIcon";

export default function RegisterLoginButton({ title }: { title: string }) {
	const redirectUrl = "/api/auth/google-redirect";

	return (
		<Button
			className="w-full max-w-xs h-14 text-md bg-white text-gray-700 rounded-full py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6"
			type="button"
			onClick={() => {
				window.location.href = redirectUrl;
			}}
		>
			<GoogleIcon className="md" />
			{title}
		</Button>
	);
}
