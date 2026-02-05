import { Button } from "@/components/ui/button";
import { GradientHeader } from "@/components/ui/gradient-header";
import {
  ArrowRight,
  BarChart,
  MessageSquare,
  UsersIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <GradientHeader
        title="Shape the future of our product"
        subtitle="Feedback Fusion is where you shape yo future xyz "
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
          >
            <Link href="/feedback/new">
              Submit Feedback
              <ArrowRight className="ml-2 w-4 h-4" />
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
      {/* Feature section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          How it Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 mb-2 text-primary" />
              <CardTitle className="text-lg font-semibold mb-1">
                Submit Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your innovative ideas and suggestions to help us improve
                our product and services.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart className="w-8 h-8 mb-2 text-primary" />
              <CardTitle className="text-lg font-semibold mb-1">
                Vote and Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upvote ideas yo love to help us understand the most.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <UsersIcon className="w-8 h-8 mb-2 text-primary" />
              <CardTitle className="text-lg font-semibold mb-1">
                Track Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Follow our roadmap and xyz
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 mb-2 text-primary" />
              <CardTitle className="text-lg font-semibold mb-1">
                See Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Watch as we transform your feedback into real improvements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Stats Section */}
      <section className="text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-2xl md:text-3xl font-bold">1234</div>
            <div className="text-muted-foreground text-sm md:text-base">
              Suggestions
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold">8901+</div>
            <div className="text-muted-foreground text-sm md:text-base">
              Votes Cast
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold">254+</div>
            <div className="text-muted-foreground text-sm md:text-base">
              Features shipped
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
