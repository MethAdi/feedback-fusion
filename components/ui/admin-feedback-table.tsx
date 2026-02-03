"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { getCategoryDesign } from "@/app/data/category-data";
import { Badge } from "./badge";
import { Edit, Save, ThumbsUp, User, X } from "lucide-react";
import { STATUS_GROUPS, STATUS_ORDER } from "@/app/data/status-data";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { toast } from "sonner";

export default function AdminFeedbackTable({ posts }: { posts: any[] }) {
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postStatus, setPostStatus] = useState<Record<number, string>>(
    Object.fromEntries(posts.map((post) => [post.id, post.status])),
  );

  const [originalStatus, setOriginalStatus] = useState<Record<number, string>>(
    {},
  );

  const startEditing = (postId: number) => {
    setEditingPostId(postId);
    setOriginalStatus((prev) => ({
      ...prev,
      [postId]: postStatus[postId],
    }));
  };

  const cancelEditing = (postId: number) => {
    if (originalStatus[postId]) {
      setPostStatus((prev) => ({
        ...prev,
        [postId]: originalStatus[postId],
      }));
    }
    setEditingPostId(null);
    setOriginalStatus((prev) => {
      const updated = { ...prev };
      delete updated[postId];
      return updated;
    });
  };

  const handleStatusChange = (postId: number, newStatus: string) => {
    setPostStatus((prev) => ({
      ...prev,
      [postId]: newStatus,
    }));
  };

  const saveStatus = async (postId: number) => {
    setEditingPostId(null);
    const loadingToast = toast.loading("Saving status...");
    try {
      const response = await fetch(`/api/feedback/${postId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: postStatus[postId] }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      //Dismiss the loading toast
      toast.dismiss(loadingToast);
      toast.success("Status updated successfully");
      setEditingPostId(null);
    } catch (error) {
      console.error("Failed to Update the status:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    const StatusGroup = STATUS_GROUPS[status as keyof typeof STATUS_GROUPS];
    if (!StatusGroup) return null;
    const Icon = StatusGroup.icon;
    return <Icon className="w-3 h-3 mr-1" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>

              <TableHead>Category</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const isEditing = editingPostId === post.id;
              const currentStatus = postStatus[post.id];

              const categoryDesign = getCategoryDesign(post.category);
              const CategoryIcon = categoryDesign.icon;
              return (
                <TableRow key={post.id} className="h-[70px]">
                  <TableCell className="font-medium max-w-xs truncate align-middle">
                    {post.title}
                  </TableCell>
                  <TableCell className="align-middle">
                    <Badge
                      className={`${categoryDesign.border} ${categoryDesign.bg} ${categoryDesign.text} px-2 py-1 rounded-md inline-flex items-center gap-1 text-sm `}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className=" align-middle">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-3 w-3" />
                      {post.votes.length}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    {isEditing ? (
                      <Select
                        value={currentStatus}
                        onValueChange={(value) =>
                          handleStatusChange(post.id, value)
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue>
                            <div className="flex items-center">
                              {getStatusIcon(currentStatus)}
                              {
                                STATUS_GROUPS[
                                  currentStatus as keyof typeof STATUS_GROUPS
                                ]?.title
                              }
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_ORDER.map((status) => {
                            const statusGroup =
                              STATUS_GROUPS[
                                status as keyof typeof STATUS_GROUPS
                              ];
                            const Icon = statusGroup.icon;
                            return (
                              <SelectItem value={status} key={status}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {statusGroup.title}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={`inline-flex items-center gap-1 ${STATUS_GROUPS[currentStatus as keyof typeof STATUS_GROUPS]?.countColor}`}
                      >
                        {getStatusIcon(currentStatus)}
                        {
                          STATUS_GROUPS[
                            currentStatus as keyof typeof STATUS_GROUPS
                          ]?.title
                        }
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="align-middle">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          onClick={() => saveStatus(post.id)}
                          className="gap-1 h-8"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEditing(post.id)}
                          className="gap-1 h-8"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(post.id)}
                        className="gap-1 h-8"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
