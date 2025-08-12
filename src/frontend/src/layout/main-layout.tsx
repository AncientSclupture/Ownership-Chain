import React from "react";
import { NavBar } from "../components/navigation";
import { Footer } from "../components/footer";

export function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="hide-scrollbar w-full min-h-screen">
            <NavBar />
            <div className="min-h-screen">{children}</div>
            <Footer />
        </div>
    );
}
