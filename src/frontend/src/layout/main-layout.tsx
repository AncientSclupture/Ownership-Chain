import React from "react";
import { NavBar } from "../components/navigation";
import { Footer } from "../components/footer";
import { useAuth } from "../context/AuthContext";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return (
        <div className={`hide-scrollbar w-full min-h-screen background-dark`}>
            <NavBar isLoggedIn={isAuthenticated} />
            <div className="pt-22 min-h-screen">
                {children}
            </div>
            <Footer />
        </div>
    );
}