import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="p-4">loading...</div>;
  if (!session) {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4 font-bold">fantastic ai admin</nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
