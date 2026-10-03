import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { TabBar } from '@/components/layout/TabBar';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { Chip } from '@/components/ui/Chip';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { OfflineToast } from '@/components/ui/OfflineToast';

export const StudentAppLayout: React.FC = () => {
  const { xp, streakDays } = useStudentProgress();
  const { student, isInitializing } = useAuth();

  if (!isInitializing && !student) {
    return <Navigate to="/app/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row font-sans antialiased">
      {/* Sidebar for Desktop */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Mobile Header HUD */}
        <header className="md:hidden sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
          <Link to="/app/trail" className="font-extrabold text-xl tracking-tight">
            Think<span className="text-[var(--yellow)]">JS</span>
          </Link>

          <div className="flex items-center gap-2">
            <Chip kind="xp" value={xp} />
            <Chip kind="streak" value={streakDays} />
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto" id="student-main-content">
          <Outlet context={{ student }} />
        </main>

        <OfflineToast />

        {/* Mobile Bottom TabBar */}
        <TabBar />
      </div>
    </div>
  );
};
