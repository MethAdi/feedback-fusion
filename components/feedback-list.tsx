"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDistanceToNow as formatDistanceNow } from "date-fns";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { getCategoryDesign } from "@/app/data/category-data";
import {
  User as UserIcon,
  MoreHorizontal,
  ArrowUp,
  ThumbsUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackList({
  initialPosts,
  userId,
}: {
  initialPosts: any[];
  userId: string | null;
}) {
  const [posts, setPosts] = useState(initialPosts);

  const handleVote = async (postId: number) => {
    if (!userId) {
      toast.error("please sign in to vote on feedback");
      return;
    }
    //show loading toast
    const loadingToast = toast.loading("Submitting your vote....");

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Vote Failed");
      }
      const data = await response.json();

      toast.dismiss(loadingToast);
      toast.success(data.voted ? "Vote added" : "Vote removed");

      //update local state
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const voteCount = post.votes.length;
            return {
              ...post,
              votes: data.voted
                ? [...post.votes, { userId }]
                : post.votes.filter((v: any) => v.userId !== userId),
              _count: {
                votes: data.voted ? voteCount + 1 : voteCount - 1,
              },
            };
          }
          return post;
        }),
      );
    } catch (error) {
      console.error("Error voting on post:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to submit your vote. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="hover:shadow-md transition-shadow border"
        >
          <CardHeader>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <UserIcon className="h-3 w-3" />
                  {post.author.name}
                  <span>|</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* STATUS BADGE */}
                {(() => {
                  const statusGroup =
                    STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];
                  if (!statusGroup) return null;
                  const StatusIcon = statusGroup.icon;

                  return (
                    <Badge
                      className={`px-2 py-1 rounded-md text-sm font-medium ${statusGroup.countColor} ${statusGroup.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusGroup.title}
                    </Badge>
                  );
                })()}
                {/* Category  Badge */}
                {(() => {
                  const design = getCategoryDesign(post.category);
                  const Icon = design.icon;

                  return (
                    <Badge
                      className={`px-2 py-1 rounded-md text-sm font-medium ${design.border} ${design.text} flex items-center gap-1`}
                      variant="outline"
                    >
                      <Icon className="w-3 h-3" />
                      {post.category}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{post.description}</p>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(post.id)}
                className="gap-2"
              >
                <ThumbsUp
                  className={`h-4 w-4 ${
                    post.votes.some((v: any) => v.userId === userId)
                      ? "fill-current"
                      : ""
                  }`}
                />
                {post.votes.length} Votes
              </Button>
              <div className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <MessageSquare className="h-4 w-4" />
                Comment
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
