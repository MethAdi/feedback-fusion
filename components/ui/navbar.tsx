"use client";
import { MessageSquare, Shield, Sparkle, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Map } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "./button";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background w-full">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold hidden sm:block">
                Feedback Fusion
              </span>
              <span className="text-lg md:text-xl font-bold sm:hidden">FF</span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
                className="text-sm hover:text-primary transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </SignedIn>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            <Link
              href="/roadmap"
              className="flex items-center gap-2 text-sm hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Map className="h-4 w-4 text-primary" />
              Roadmap
            </Link>
            <Link
              href="/feedback"
              className="flex items-center gap-2 text-sm hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              Feedback
            </Link>
            <SignedIn>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </SignedIn>
            <div className="pt-2 border-t">
              <SignedOut>
                <Button asChild className="w-full">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
