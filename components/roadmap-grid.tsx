"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Clock, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { STATUS_GROUPS, STATUS_ORDER } from "@/app/data/status-data";

export default function RoadmapGrid({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const groupedPosts = {
    under_review: posts.filter((p) => p.status === "under_review"),
    planned: posts.filter((p) => p.status === "planned"),
    in_progress: posts.filter((p) => p.status === "in_progress"),
    live: posts.filter((p) => p.status === "live"),
  };

  const handleDragStart = (e: React.DragEvent, postId: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("postId", String(postId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const postId = parseInt(e.dataTransfer.getData("postId"));

    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, status: newStatus } : p,
    );
    setPosts(updatedPosts);

    const loadingToast = toast.loading("Updating status...");

    try {
      const response = await fetch(`/api/feedback/${postId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      toast.dismiss(loadingToast);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update status, Please try again");
      setPosts(initialPosts);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {STATUS_ORDER.map((status) => {
        const group = STATUS_GROUPS[status as keyof typeof STATUS_GROUPS];
        const Icon = group.icon;
        const postsInGroup = groupedPosts[status as keyof typeof groupedPosts];

        return (
          <div
            key={status}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div
              className={`rounded-lg p-4 ${group.bgColor} border ${group.colour}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 ">
                  <Icon className={`h-5 w-5 ${group.textColor}`} />
                  <h2 className={`text-lg font-semibold ${group.textColor}`}>
                    {group.title}
                  </h2>
                  <Badge className={group.countColor}>
                    {postsInGroup.length}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            </div>
            <div className="space-y-4">
              {postsInGroup.map((post) => (
                <Card
                  key={post.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, post.id)}
                  className="hover:shadow-lg transition-all duration-200 hover:translate-y-1 cursor-move"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      <span className="truncate">{post.author.name}</span> |{" "}
                      {post.votes.length} votes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge className="text-xs">{post.category}</Badge>
                      {status === "in_progress" && (
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <Clock className="h-3 w-3" />
                          Active
                        </div>
                      )}
                      {status === "live" && (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCheck className="h-3 w-3" />
                          Shipped
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {postsInGroup.length === 0 && (
                <Card className="border-dashed opacity-60">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No items in this stage
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
