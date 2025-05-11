import ClientSessionProvider from "@/components/ClientSessionProvider";
import ClientSessionExample from "@/components/ClientSessionExample";

export default function Page() {
  return (
    <ClientSessionProvider>
      <ClientSessionExample />
    </ClientSessionProvider>
  );
}
