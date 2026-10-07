import { useEffect, useState } from 'react';

import { getAllSolutions } from '../api/solutionAPI';
import type { Solution } from '../types/solution';

import MainHeader from '../components/main/MainHeader';
import HeroSection from '../components/main/HeroSection';
import StatsSection from '../components/main/StatsSection';
import RecentSolutionsSection from '../components/main/RecentSolutionsSection';

function MainPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadSolutions() {
      try {
        const data = await getAllSolutions();

        if (!ignore) {
          setSolutions(data);
        }
      } catch {
        if (!ignore) {
          setError('풀이 기록을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSolutions();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainHeader />
      <main className="mx-auto max-w-7xl px-6">
        <HeroSection />
        <StatsSection
          solutions={solutions}
          isLoading={isLoading}
          error={error}
        />
        <RecentSolutionsSection
          solutions={solutions}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}

export default MainPage;
