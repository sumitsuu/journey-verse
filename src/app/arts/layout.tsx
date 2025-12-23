import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/sign-in");
  }

  return <>{children}</>;
};
export default Layout;
