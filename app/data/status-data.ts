import { CheckCircle, Clock, Eye, ListCheck } from "lucide-react";

export const STATUS_ORDER = ["under_review", "planned", "in_progress", "live"];

export const STATUS_GROUPS = {
  under_review: {
    title: "Under Review",
    description: "New suggestions being evaluated",
    color: "gray",
    icon: Eye,
    colour: "border-gray-500 dark:border-gray-400",
    bgColor:
      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
    textColor: "text-gray-700 dark:text-gray-300",
    countColor: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  },
  planned: {
    title: "Planned",
    description: "Features we're planning to work on",
    color: "blue",
    icon: ListCheck,
    colour: "border-blue-500 dark:border-blue-400",
    bgColor:
      "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    textColor: "text-blue-700 dark:text-blue-300",
    countColor: "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
  },
  in_progress: {
    title: "In Progress",
    description: "Currently being developed",
    color: "yellow",
    icon: Clock,
    colour: "border-yellow-500 dark:border-yellow-400",
    bgColor:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    textColor: "text-yellow-700 dark:text-yellow-300",
    countColor: "bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
  },
  live: {
    title: "Completed",
    description: "Recently shipped features",
    color: "green",
    icon: CheckCircle,
    colour: "border-green-500 dark:border-green-400",
    bgColor:
      "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    textColor: "text-green-700 dark:text-green-300",
    countColor: "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300",
  },
};
