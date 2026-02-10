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
import { formatDistanceToNow } from "date-fns";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { getCategoryDesign } from "@/app/data/category-data";
import { User as UserIcon, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function FeedbackList({
  initialPosts,
  userId,
}: {
  initialPosts: any[];
  userId: string | null;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleVote = async (postId: number) => {
    if (!userId) {
      toast.error("Please sign in to vote");
      return;
    }

    const loadingToast = toast.loading("Submitting vote...");

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);
      toast.success(data.voted ? "Vote added" : "Vote removed");

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                votes: data.voted
                  ? [...post.votes, { userId }]
                  : post.votes.filter((v: any) => v.userId !== userId),
              }
            : post,
        ),
      );
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Vote failed");
    }
  };

  const toggleThread = async (postId: number) => {
    if (openPostId === postId) {
      setOpenPostId(null);
      return;
    }

    setLoadingComments(true);

    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();

      setComments(Array.isArray(data) ? data : []);
      setOpenPostId(postId);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (postId: number) => {
    if (!userId) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmittingComment(true);
    const loadingToast = toast.loading("Submitting comment...");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to submit comment");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Comment submitted!");
      setCommentText("");
      setComments([...comments, data]);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error submitting comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="border">
          <CardHeader>
            <div className="flex justify-between gap-2">
              <div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <UserIcon className="h-3 w-3" />
                  {post.author.name}
                  <span>•</span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                {(() => {
                  const status =
                    STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];
                  if (!status) return null;
                  const Icon = status.icon;
                  return (
                    <Badge className={status.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {status.title}
                    </Badge>
                  );
                })()}

                {(() => {
                  const design = getCategoryDesign(post.category);
                  const Icon = design.icon;
                  return (
                    <Badge variant="outline" className={design.text}>
                      <Icon className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4">{post.description}</p>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(post.id)}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {post.votes.length}
              </Button>

              <button
                onClick={() => toggleThread(post.id)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Thread
              </button>
            </div>
          </CardContent>

          {openPostId === post.id && (
            <div className="border-t px-4 py-3 space-y-3">
              {loadingComments ? (
                <p className="text-sm text-muted-foreground">
                  Loading comments...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <p>{comment.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {comment.author.name}
                    </span>
                  </div>
                ))
              )}

              <div className="pt-3 border-t space-y-2">
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  rows={2}
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmitComment(post.id)}
                  disabled={submittingComment || !commentText.trim()}
                >
                  {submittingComment ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
