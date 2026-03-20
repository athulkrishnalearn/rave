export default function FeedLayout({ children }: { children: React.ReactNode }) {
    // The feed page itself manages its own 3-column layout (left sidebar, center, right).
    // The Sidebar component is rendered inside the page, so we keep this layout minimal.
    return <>{children}</>;
}
