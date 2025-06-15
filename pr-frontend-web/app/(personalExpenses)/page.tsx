import { ModalProvider } from "@/components/ModalFormBase";
import Navbar from "@/components/Navbar";
export default function personalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ModalProvider>
        <Navbar />
        <main className="main-container overflow-auto p-0 ">
          {children}
        </main>
      </ModalProvider>


    </>

  );
}
