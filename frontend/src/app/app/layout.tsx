import Navbar from "@/components/navbar";
import { auth, login } from "../actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const subject = await auth();

  if (!subject) {
    login();
  }

  return (
    <>
      {subject ? <Navbar subject={subject} /> : <></>}
      {children}
    </>
  );
}
