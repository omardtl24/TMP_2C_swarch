import Navbar from "@/components/Navbar";
export default function loginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    
    <Navbar/>
    <main className="main-container p-0">
        {children}
    </main>
    
    </>
    
  );
}
