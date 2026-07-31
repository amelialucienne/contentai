import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  userEmail,
  userName,
  isAdmin,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={userEmail} userName={userName} isAdmin={isAdmin} />
      <main className="lg:pl-64">
        <div className="container mx-auto p-6 lg:p-8 pt-16 lg:pt-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
