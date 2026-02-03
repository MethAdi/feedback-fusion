import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";


export default function ThemeToggle(){
    const{ theme,setTheme} = useTheme();

    useEffect(() => {
        if (typeof document !== "undefined" && theme) {
            // Persist theme in a cookie for server rendering to read
            document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
        }
    }, [theme]);

    return(
        <Button variant="ghost" size="icon" onClick={()=> setTheme(theme === "light" ? "dark": "light")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-180 dark:scale-100"/>
            <Moon className="h-5 w-5 rotate-180 scale-100 transition-all dark:rotate-180 dark:scale-100"/>
            <span className = "sr-only">
                Toggle theme
            </span>
        </Button>
    )
}