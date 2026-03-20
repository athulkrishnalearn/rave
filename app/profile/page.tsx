import { redirect } from 'next/navigation';

export default function MyProfileRedirect() {
    // In a real app, verify session -> redirect to /profile/[session.username]
    redirect('/profile/cybergoth99');
}
