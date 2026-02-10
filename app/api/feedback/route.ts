import { Resend } from "resend";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 },
      );
    }
    const { title, description, category } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if(!dbUser)
    {
        return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
        );
    }

    await prisma.post.create({
        data:{
            title,
            description,
            category,
            authorId: dbUser.id,
        },
    })

    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: userEmail,
      subject: "New Message from Your App",
      html: `<p>${description}</p>
      <p>${title}</p>
      <p>${category}</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
