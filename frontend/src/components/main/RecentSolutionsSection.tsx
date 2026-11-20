import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Solution } from '../../types/solution';
import SolutionListItem from './SolutionListItem';

interface RecentSolutionsSectionProps {
  solutions: Solution[];
  isLoading: boolean;
  error: string;
}

function RecentSolutionsSection({
  solutions,
  isLoading,
  error,
}: RecentSolutionsSectionProps) {
  const recentSolutions = [...solutions]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <section className="py-16">
      {/* 섹션 제목 영역 */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Recent Solutions
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            최근 풀이 기록
          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            최근에 저장한 코딩테스트 풀이를 확인해보세요.
          </p>
        </div>

        <Link
          to="/solutions"
          className="hidden shrink-0 items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-flex"
        >
          전체 보기
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 최근 풀이 목록 */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
        {isLoading ? (
          <p role="status" className="px-6 py-8 text-sm text-zinc-400">
            최근 풀이를 불러오는 중입니다...
          </p>
        ) : error ? (
          <p role="alert" className="px-6 py-8 text-sm text-red-400">
            {error}
          </p>
        ) : recentSolutions.length === 0 ? (
          <div className="px-6 py-8 text-sm text-zinc-400">
            <p>아직 저장한 풀이가 없습니다.</p>
            <Link
              to="/solutions/new"
              className="mt-3 inline-flex text-white hover:underline"
            >
              첫 풀이 등록하기
            </Link>
          </div>
        ) : (
          recentSolutions.map((solution) => (
            <SolutionListItem
              key={solution.id}
              id={solution.id}
              platform={solution.platform}
              problemNumber={solution.problemNumber}
              title={solution.problemTitle}
              language={solution.language}
              solvedDate={solution.solvedDate}
              correct={solution.correct}
            />
          ))
        )}
      </div>

      {/* 모바일용 전체 보기 버튼 */}
      <Link
        to="/solutions"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:hidden"
      >
        전체 풀이 보기
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default RecentSolutionsSection;