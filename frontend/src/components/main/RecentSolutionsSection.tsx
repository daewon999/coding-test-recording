import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import SolutionListItem from './SolutionListItem';

/*
 * 최근 풀이 목록에서 사용할 임시 데이터입니다.
 *
 * 나중에는 이 배열을 직접 작성하지 않고,
 * 백엔드 API에서 받아온 데이터로 교체할 예정입니다.
 */
const recentSolutions = [
  {
    id: 1,
    platform: '백준',
    problemNumber: '1260',
    title: 'DFS와 BFS',
    language: 'Python',
    solvedDate: '2026-07-07',
    correct: true,
  },
  {
    id: 2,
    platform: '프로그래머스',
    problemNumber: '42576',
    title: '완주하지 못한 선수',
    language: 'Java',
    solvedDate: '2026-07-05',
    correct: true,
  },
  {
    id: 3,
    platform: '백준',
    problemNumber: '14501',
    title: '퇴사',
    language: 'Python',
    solvedDate: '2026-07-02',
    correct: false,
  },
];

function RecentSolutionsSection() {
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
        {recentSolutions.map((solution) => (
          <SolutionListItem
            key={solution.id}
            id={solution.id}
            platform={solution.platform}
            problemNumber={solution.problemNumber}
            title={solution.title}
            language={solution.language}
            solvedDate={solution.solvedDate}
            correct={solution.correct}
          />
        ))}
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