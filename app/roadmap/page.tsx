import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradientHeader } from "@/components/ui/gradient-header";
import { Progress } from "@/components/ui/progress";
import prisma from "@/lib/prisma";
import { get } from "http";
import {
  Badge,
  BarChart3,
  CheckCheck,
  CheckCircle,
  Clock,
  Target,
  Users,
} from "lucide-react";
import React from "react";
import { STATUS_GROUPS, STATUS_ORDER } from "../data/status-data";
import RoadmapGrid from "@/components/roadmap-grid";
function getStatusPercentage(posts: any, status: string) {
  const total = posts.length;
  const count = posts.filter(
    (p: { status: string }) => p.status === status,
  ).length;
  console.log(
    `Status: ${status}, Count: ${count.length}, Total: ${total}  per: ${total > 0 ? Math.round((count / total) * 100) : 0}`,
  );
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

export default async function RoadmapPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
  });

  const groupedPosts = {
    under_review: posts.filter((p) => p.status === "under_review"),
    planned: posts.filter((p) => p.status === "planned"),
    in_progress: posts.filter((p) => p.status === "in_progress"),
    live: posts.filter((p) => p.status === "live"),
  };

  const totalVotes = posts.reduce((acc, post) => acc + post.votes.length, 0);
  const averageVotes =
    posts.length > 0 ? Math.round(totalVotes / posts.length) : 0;

  //calculate progress for the overall roadmap
  const completedPercentage = getStatusPercentage(posts, "live");
  const inProgressPercentage = getStatusPercentage(posts, "in_progress");
  const plannedPercentage = getStatusPercentage(posts, "planned");
  //const underReviewPercentage = getStatusPercentage(posts,"under_review");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
      <GradientHeader
        title="Product Roadmap"
        subtitle="See what were working on,  whats next and track our progress"
      />
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-2xl md:text-3xl font-bold">{posts.length}</p>
              </div>
              <Target className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
            </div>
            <br />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-2xl md:text-3xl font-bold">{totalVotes}</p>
              </div>
              <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {groupedPosts.live.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Votes</p>
                <p className="text-2xl md:text-3xl font-bold">{averageVotes}</p>
              </div>
              <Users className="h-8 w-8 md:h-10 md:w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Roadmap Progress</CardTitle>
          <CardDescription>
            Track the journey from idea to completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-medium"> {completedPercentage}% </span>
            </div>
            <Progress value={completedPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {inProgressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>

            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {plannedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>

            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {completedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Roadmap Columns */}
      <RoadmapGrid initialPosts={posts} />
    </div>
  );
}
