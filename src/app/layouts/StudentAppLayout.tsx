import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { TabBar } from '@/components/layout/TabBar';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { useAuth } from '@/app/providers/AuthProvider';
import { OfflineToast } from '@/components/ui/OfflineToast';

export const StudentAppLayout: React.FC = () => {
  const { student, isInitializing } = useAuth();

  if (!isInitializing && !student) {
    return <Navigate to="/app/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col md:flex-row antialiased">
      {/* Sidebar for Desktop */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-[70px] md:pb-0">
        
        {/* Page Content Outlet */}
        <main className="flex-1 w-full" id="student-main-content">
          <Outlet context={{ student }} />
        </main>

        <OfflineToast />

        {/* Mobile Bottom TabBar */}
        <TabBar />
      </div>
    </div>
  );
};
