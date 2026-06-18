import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const character = await prisma.character.findUnique({
    where: { id: 1 },
    select: { unallocatedPoints: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar unallocatedPoints={character?.unallocatedPoints ?? 0} />
      <main className="flex-1 ml-64 p-6 min-h-screen">{children}</main>
    </div>
  );
}
