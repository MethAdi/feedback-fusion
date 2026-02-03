import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function syncCurrentUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error("User Email not found");
    }

    // Check if user exists in our database by clerkUserId
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (dbUser) {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          image: clerkUser.imageUrl,
        },
      });
    } else {
      // Check if email already exists (edge case)
      const userByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userByEmail) {
        // Email exists but clerkUserId doesn't match, update it
        dbUser = await prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            clerkUserId: clerkUser.id,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            image: clerkUser.imageUrl,
          },
        });
      } else {
        // Check if this is the first user (should be admin)
        const userCount = await prisma.user.count();
        const isFirstUser = userCount === 0;

        // Create new user
        dbUser = await prisma.user.create({
          data: {
            clerkUserId: clerkUser.id,
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            image: clerkUser.imageUrl,
            role: isFirstUser ? "admin" : "user",
          },
        });
        console.log("Created new user:");
      }
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user from clerk", error);
    return null;
  }
}
