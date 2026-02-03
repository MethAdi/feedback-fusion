export default function Footer(){
    const currentYear = new Date().getFullYear();
    return(
        <footer className="border-t bg-background mt-auto ">
             <div className="container mx-auto px-4 py-5">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                <span>Made with ❤️ by Aditya</span>
                 </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                    <span>
                        {currentYear}© Feedback Fusion. All rights reserved.
                    </span>
                 </div>
                </div>
            </footer>
    )
}