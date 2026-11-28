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
    <section
      aria-labelledby="recent-solutions-title"
      className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-6 py-5">
        <div>
          <h2
            id="recent-solutions-title"
            className="text-base font-semibold text-zinc-900"
          >
            최근 풀이 기록
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            최근에 저장한 풀이 5개를 확인하세요.
          </p>
        </div>

        <Link
          to="/solutions"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-blue-600"
        >
          전체 보기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <p role="status" className="px-6 py-10 text-sm text-zinc-500">
          최근 풀이를 불러오는 중입니다...
        </p>
      ) : error ? (
        <p role="alert" className="px-6 py-10 text-sm text-red-700">
          {error}
        </p>
      ) : recentSolutions.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">
            아직 저장한 풀이가 없습니다.
          </p>
          <Link
            to="/solutions/new"
            className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:underline"
          >
            첫 풀이 등록하기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">
              최근에 저장한 풀이의 문제, 문제 유형, 언어, 결과, 풀이 날짜
            </caption>

            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  문제
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  문제 유형
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  언어
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  결과
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  풀이 날짜
                </th>
              </tr>
            </thead>

            <tbody>
              {recentSolutions.map((solution) => (
                <SolutionListItem
                  key={solution.id}
                  id={solution.id}
                  platform={solution.platform}
                  problemNumber={solution.problemNumber}
                  title={solution.problemTitle}
                  problemTags={solution.problemTags}
                  language={solution.language}
                  solvedDate={solution.solvedDate}
                  correct={solution.correct}
                  highlightResult
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentSolutionsSection;
