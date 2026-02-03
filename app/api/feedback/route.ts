import  { NextRequest } from "next/server";
import { syncCurrentUser } from "@/lib/sync-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const dbUser = await syncCurrentUser(); 
        if(!dbUser){
                return NextResponse.json({error:"Unauthorised"},{status:401});
        }
            const body= await request.json();
            const {title,description,category}= body;

            if (!title || !description || !category) {
                return NextResponse.json({error:"All fields are required"},{status:400});
            }

            const post = await prisma.post.create({
                data:
                {   
                        title,
                        description,
                        category,
                         author: { connect: { id: dbUser.id } },
                }
            });
            return NextResponse.json(post);

    } catch (error) {
        console.error("Error in feedback POST route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(){
    try {
        const posts = await prisma.post.findMany({
            include :{
                author: true,
                votes: true,
            },
            orderBy:{
                    createdAt:'desc'
            },
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Errors in fetching posts:",error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}