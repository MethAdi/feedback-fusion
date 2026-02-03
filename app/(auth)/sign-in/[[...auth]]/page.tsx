"use client";
import {SignIn} from "@clerk/nextjs"
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page(){
    const {theme} = useTheme();
    return( 
        <div className="flex min-h-screen items-center justify-center px-4">
 <SignIn appearance = {{
        baseTheme: theme === "light" ? dark:undefined,
    }}
/>
        </div>
   
    );
}