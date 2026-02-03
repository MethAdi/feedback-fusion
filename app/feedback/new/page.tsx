"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import  { Card, CardContent, CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CATEGORIES_TYPES } from "@/app/data/category-data";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect} from "react";
import { useRouter } from "next/navigation";

//server action function
async function submitFeedback(prevState:{success:boolean,error:string},formData:FormData )
{
    //show loading toast
    const loadingToast = toast.loading("Submitting your feedback");
    try
     {
            const response = await  fetch("/api/feedback",{
                method:"POST",
                headers :
                {
                "Content-Type":"application/json"    
                },
                body:JSON.stringify({
                    title: formData.get("title"),
                    description : formData.get("description"),
                    category: formData.get("category"),
                })
            });
            if(!response.ok)
            {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || "Failed to create post";
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
            //Dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.success(" Your Feedback submitted successfully!");

            return{
                success:true,
                error:""
            };
    } 
    catch (error)
     {          console.error("Something went wrong",error);
             //Dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.error(" Failed to submit your Feedback!");
            return{
                success:false,
                error:"Failed to submit feedback"
            };

    }

}


export default function NewFeedbackPage() { 
    const router = useRouter();
    const [state,action,isPending] = useActionState(submitFeedback,{
        success:false,
        error:"",
    });

    //Redirect on success 
    useEffect(() =>{
        if(state.success)
        {
            const timer = setTimeout(() =>
            {
                router.push("/feedback");
                router.refresh();

            },1500)   // wait for toast to be visible
            return( ()=> clearTimeout(timer));
        }
    },
    [state.success, router]
);

    return  (
        <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
            <div className="flex items-center gap-3">
                    <Button variant = "ghost" size="icon" asChild>
                    <Link href = "/feedback">
                    <ArrowLeft className="w-4 h-4" />
                    </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">
                        Share Your Feedback
                    </h1>
            </div>
            <br />
            <Card className="p-2">
                <CardHeader className="pb-2">
                    <CardTitle>
                        New Feedback
                    </CardTitle>
                    <CardDescription>
                        Share Your idea with the community and help us improve!
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <form action={action} className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor = "title">
                                Title
                            </Label>
                            <Input id = "title" name="title" placeholder = "What would you like to see" required />
                        </div>
                        <br />
                        <div className="space-y-3">
                            <Label htmlFor = "category">
                                Category
                            </Label>
                            <select id="category" name = "category" className="w-full px-3 py-2 border rounded-md bg-background"
                            defaultValue = {CATEGORIES_TYPES[0]}
                            >
                                {CATEGORIES_TYPES.map((category) => (
                                    <option key={category} value={category}>
                                        {" "}
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div className="space-y-3">
                            <Label htmlFor = "description">
                                Description
                            </Label>
                            <Textarea id = "description" name = "description" placeholder = "Describe your idea in detail..." rows={5} required />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type = "submit" disabled = {isPending}>
                                {isPending ? "Submitting..." : "Submit Feedback" }
                            </Button>
                            <Button type = "button" variant = "outline" asChild>
                                <Link href = "/feedback">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}