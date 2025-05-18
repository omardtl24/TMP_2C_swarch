import { ModalProvider } from "@/components/ModalFormBase";
import Navbar from "@/components/Navbar";
export default function eventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ModalProvider>
        <Navbar />
        <main className="main-container p-4 md:px-12 md:py-6 ">
          {children}
        </main>
        {/*TODO: Add a footer*/}
      </ModalProvider>


    </>

  );
}
