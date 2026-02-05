import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { use } from "react";
import { GradientHeader } from "@/components/ui/gradient-header";
import AdminFeedbackTable from "@/components/ui/admin-feedback-table";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto">
      <GradientHeader
        title="Admin Dashboard"
        subtitle="Manage feedback and update their status"
      />
      <AdminFeedbackTable posts={posts} />
    </div>
  );
}
