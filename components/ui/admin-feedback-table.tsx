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
        <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Title
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Category
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Votes
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Author
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Status
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-xs sm:text-sm">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => {
                  const isEditing = editingPostId === post.id;
                  const currentStatus = postStatus[post.id];

                  const categoryDesign = getCategoryDesign(post.category);
                  const CategoryIcon = categoryDesign.icon;
                  return (
                    <TableRow key={post.id} className="h-auto sm:h-[70px]">
                      <TableCell className="font-medium max-w-[200px] sm:max-w-xs truncate align-middle p-2 sm:p-4">
                        <div className="break-words">{post.title}</div>
                      </TableCell>
                      <TableCell className="align-middle p-2 sm:p-4">
                        <Badge
                          className={`${categoryDesign.border} ${categoryDesign.bg} ${categoryDesign.text} px-1 sm:px-2 py-1 rounded-md inline-flex items-center gap-1 text-xs sm:text-sm `}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {post.category}
                          </span>
                          <span className="sm:hidden">
                            {post.category.substring(0, 3)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs sm:text-sm">
                            {post.votes.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle p-2 sm:p-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[80px] sm:max-w-[120px] text-xs sm:text-sm">
                            {post.author.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle p-2 sm:p-4">
                        {isEditing ? (
                          <Select
                            value={currentStatus}
                            onValueChange={(value) =>
                              handleStatusChange(post.id, value)
                            }
                          >
                            <SelectTrigger className="w-[120px] sm:w-[160px] text-xs sm:text-sm">
                              <SelectValue>
                                <div className="flex items-center">
                                  {getStatusIcon(currentStatus)}
                                  <span className="hidden sm:inline">
                                    {
                                      STATUS_GROUPS[
                                        currentStatus as keyof typeof STATUS_GROUPS
                                      ]?.title
                                    }
                                  </span>
                                  <span className="sm:hidden">
                                    {STATUS_GROUPS[
                                      currentStatus as keyof typeof STATUS_GROUPS
                                    ]?.title.substring(0, 6)}
                                  </span>
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
                            className={`inline-flex items-center gap-1 text-xs sm:text-sm ${STATUS_GROUPS[currentStatus as keyof typeof STATUS_GROUPS]?.countColor}`}
                          >
                            {getStatusIcon(currentStatus)}
                            <span className="hidden sm:inline">
                              {
                                STATUS_GROUPS[
                                  currentStatus as keyof typeof STATUS_GROUPS
                                ]?.title
                              }
                            </span>
                            <span className="sm:hidden">
                              {STATUS_GROUPS[
                                currentStatus as keyof typeof STATUS_GROUPS
                              ]?.title.substring(0, 4)}
                            </span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="align-middle p-2 sm:p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              onClick={() => saveStatus(post.id)}
                              className="gap-1 h-6 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Save className="w-3 h-3" />
                              <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelEditing(post.id)}
                              className="gap-1 h-6 sm:h-8 text-xs sm:text-sm px-1 sm:px-2"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(post.id)}
                            className="gap-1 h-6 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                          >
                            <Edit className="w-3 h-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
