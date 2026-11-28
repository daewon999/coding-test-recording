import { useEffect, useState } from 'react';

import { getAllSolutions } from '../api/solutionAPI';
import type { Solution } from '../types/solution';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsSection from '../components/main/StatsSection';
import RecentSolutionsSection from '../components/main/RecentSolutionsSection';
import ActivityCalendar from '../components/main/ActivityCalendar';

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
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* 대시보드 상단 */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            대시보드
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            지금까지 쌓아온 풀이 기록을 한눈에 확인하세요.
          </p>
        </div>

        <Link
          to="/solutions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} aria-hidden="true" />
          새 풀이 작성
        </Link>
      </header>

      <StatsSection
        solutions={solutions}
        isLoading={isLoading}
        error={error}
      />

      <ActivityCalendar />

      <RecentSolutionsSection
        solutions={solutions}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
}

export default MainPage;
