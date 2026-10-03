import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import { WelcomePage } from '@/features/auth/WelcomePage';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage';
import { ParentalConsentPage } from '@/features/auth/ParentalConsentPage';
import { AccountPendingPage } from '@/features/auth/AccountPendingPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { LevelChoicePage } from '@/features/levels/LevelChoicePage';
import { LevelSelectionPage } from '@/features/levels/LevelSelectionPage';
import { PlacementTestPage } from '@/features/levels/PlacementTestPage';
import { PlacementResultPage } from '@/features/levels/PlacementResultPage';
import { TrailPage } from '@/features/trail/TrailPage';
import { LessonIntroPage } from '@/features/lessons/LessonIntroPage';
import { LessonQuestionPage } from '@/features/lessons/LessonQuestionPage';
import { LessonSummaryPage } from '@/features/lessons/LessonSummaryPage';
import { LessonResourcesPage } from '@/features/lessons/LessonResourcesPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { AchievementsPage } from '@/features/profile/AchievementsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { EditProfilePage } from '@/features/settings/EditProfilePage';
import { NotificationSettingsPage } from '@/features/settings/NotificationSettingsPage';
import { ChangePasswordPage } from '@/features/settings/ChangePasswordPage';
import { DeleteAccountPage } from '@/features/settings/DeleteAccountPage';
import { LessonAccessGuard } from '@/features/lessons/LessonAccessGuard';
import { LessonSessionProvider } from '@/features/lessons/LessonSessionContext';
import { StudentAppLayout } from '@/app/layouts/StudentAppLayout';
import { Outlet } from 'react-router-dom';

const LessonRouteLayout: React.FC = () => (
  <LessonAccessGuard>
    <LessonSessionProvider>
      <Outlet />
    </LessonSessionProvider>
  </LessonAccessGuard>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Student App Standalone Auth, Onboarding & Nivelamento Routes */}
      <Route path="/app" element={<WelcomePage />} />
      <Route path="/app/login" element={<LoginPage />} />
      <Route path="/app/signup" element={<SignupPage />} />
      <Route path="/app/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/app/reset-password" element={<ResetPasswordPage />} />
      <Route path="/app/parental-consent" element={<ParentalConsentPage />} />
      <Route path="/app/parental-consent/pending" element={<AccountPendingPage />} />

      <Route path="/app/onboarding" element={<OnboardingPage />} />
      <Route path="/app/level-choice" element={<LevelChoicePage />} />
      <Route path="/app/level" element={<LevelSelectionPage />} />
      <Route path="/app/placement-test" element={<PlacementTestPage />} />
      <Route path="/app/placement-test/result" element={<PlacementResultPage />} />

      {/* Standalone Lesson Execution Routes */}
      <Route path="/app/lesson/:lessonId" element={<LessonRouteLayout />}>
        <Route path="intro" element={<LessonIntroPage />} />
        <Route path="question/:questionId" element={<LessonQuestionPage />} />
        <Route path="summary" element={<LessonSummaryPage />} />
        <Route path="resources" element={<LessonResourcesPage />} />
      </Route>

      {/* Student App Shell Routes (with TabBar / DesktopSidebar) */}
      <Route path="/app/main" element={<StudentAppLayout />}>
        <Route index element={<Navigate to="/app/trail" replace />} />
      </Route>

      <Route path="/app" element={<StudentAppLayout />}>
        <Route path="trail" element={<TrailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/achievements" element={<AchievementsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/profile" element={<EditProfilePage />} />
        <Route path="settings/notifications" element={<NotificationSettingsPage />} />
        <Route path="settings/password" element={<ChangePasswordPage />} />
        <Route path="settings/delete-account" element={<DeleteAccountPage />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
