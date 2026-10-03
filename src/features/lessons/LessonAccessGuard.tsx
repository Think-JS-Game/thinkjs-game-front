import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStudentProgress } from '@/app/providers/StudentProgressProvider';
import { defaultTrailRepository } from '@/services/repositories/MockTrailRepository';

export const LessonAccessGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isHydrated, isLessonUnlocked } = useStudentProgress();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isHydrated || !lessonId) return;

    let isSubscribed = true;

    async function checkAccess() {
      const lesson = await defaultTrailRepository.getLessonById(lessonId!);
      if (!lesson) {
        if (isSubscribed) {
          setIsAllowed(false);
          navigate('/app/trail', { replace: true });
        }
        return;
      }

      const mod = await defaultTrailRepository.getModuleById(lesson.moduleId);
      const targetLevel = mod ? mod.level : 'basic';
      const modules = await defaultTrailRepository.getModulesByLevel(targetLevel);

      if (!isSubscribed) return;

      const unlocked = isLessonUnlocked(lessonId!, modules);
      if (!unlocked) {
        setIsAllowed(false);
        navigate('/app/trail', {
          replace: true,
          state: { toastMessage: 'Conclua a lição anterior para desbloquear esta.' },
        });
      } else {
        setIsAllowed(true);
      }
    }

    checkAccess();

    return () => {
      isSubscribed = false;
    };
  }, [isHydrated, lessonId, isLessonUnlocked, navigate, location.pathname]);

  if (!isHydrated || isAllowed === null) {
    return null; // Silent wait until hydration & check complete
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
};
