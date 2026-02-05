import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { GradientHeader } from "@/components/ui/gradient-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Map } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryDesign } from "@/app/data/category-data";
import { CategoryType } from "@/app/data/category-data";
import FeedbackList from "@/components/feedback-list";

export default async function FeedbackPage() {
  //get user ID from clerk authentication
  const { userId } = await auth();

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
      //comments:true
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const categories = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <GradientHeader
          title="Community Feedback"
          subtitle="See what the community is saying and share your thoughts. Your feedback helps us improve!"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              <Link href="/feedback/new">
                <PlusIcon className="mr-2 w-4 h-4" />
                New Feedback
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto"
            >
              <Link href="/roadmap">
                View Roadmap
                <Map className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </GradientHeader>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse Feedback by Category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const design = getCategoryDesign(cat.category);
                    const Icon = design.icon;

                    return (
                      <div
                        key={cat.category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-md ${design.light} ${design.border}`}
                          >
                            <Icon className={`w-4 h-4 ${design.text}`} />
                          </div>
                          <span className="font-medium text-sm">
                            {cat.category}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${design.light} ${design.text}`}
                        >
                          {cat._count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <FeedbackList initialPosts={posts} userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
}
