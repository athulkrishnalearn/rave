"use client";

import Sidebar from "@/components/Sidebar";

interface PageShellProps {
    children: React.ReactNode;
    /** Max width of the inner content column. Default: 760px */
    maxWidth?: string;
    /** Extra className on the inner container */
    className?: string;
    /** Set true for auth pages (login/signup) — no sidebar, centered content */
    auth?: boolean;
}

/**
 * PageShell — wraps every page with:
 *  - #F7F7F8 background
 *  - Left sidebar (64px desktop, bottom dock mobile)
 *  - Consistent content padding + max-width
 *  - Mobile bottom clearance
 *
 * Usage:
 *   <PageShell>
 *     <h1>My Page</h1>
 *   </PageShell>
 *
 *   <PageShell maxWidth="540px" auth>
 *     <LoginForm />
 *   </PageShell>
 */
export default function PageShell({ children, maxWidth = "760px", className = "", auth = false }: PageShellProps) {
    if (auth) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-sans"
                style={{ backgroundColor: "#F7F7F8" }}
            >
                <div style={{ width: "100%", maxWidth: "460px" }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans" style={{ backgroundColor: "#F7F7F8" }}>
            <Sidebar />
            <div
                className={`mx-auto px-4 md:px-6 pt-8 ${className}`}
                style={{ maxWidth, paddingLeft: undefined }}
            >
                {/* Sidebar offset handled via md:ml-16 on the wrapper */}
                <div className="md:pl-16">
                    {children}
                </div>
            </div>
        </div>
    );
}
