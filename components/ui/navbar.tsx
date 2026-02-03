"use client";
import { MessageSquare, Shield, Sparkle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Map } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "./button";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Feedback Fusion</span>
            </div>
          </Link>
          <Link
            href="/roadmap"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <Map className="h-4 w-4 text-primary" />
            Roadmap
          </Link>
          <Link
            href="/feedback"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            Feedback
          </Link>
          {/* Admin Link */}
          <SignedIn>
            <Link
              href="/admin"
              className="text-sm hover:text-primary transition-colors flex items-center"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </SignedIn>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
