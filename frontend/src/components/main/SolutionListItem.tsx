import { ArrowRight, CheckCircle2, CircleX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionListItemProps {
  id: number;
  platform: string;
  problemNumber: string;
  title: string;
  language: string;
  solvedDate: string;
  correct: boolean;
}

function SolutionListItem({
  id,
  platform,
  problemNumber,
  title,
  language,
  solvedDate,
  correct,
}: SolutionListItemProps) {
  return (
    <article className="group flex flex-col gap-5 border-b border-zinc-800 px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      {/* 문제 정보 */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
            {platform}
          </span>

          <span className="text-sm text-zinc-500">
            {problemNumber}
          </span>
        </div>

        <h3 className="mt-3 truncate text-base font-medium text-zinc-100">
          {title}
        </h3>
      </div>

      {/* 풀이 부가 정보 */}
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <span className="text-sm text-zinc-400">
          {language}
        </span>

        {correct ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 size={16} />
            정답
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-red-400">
            <CircleX size={16} />
            오답
          </span>
        )}

        <time
          dateTime={solvedDate}
          className="text-sm text-zinc-500"
        >
          {solvedDate}
        </time>

        <Link
          to={`/solutions/${id}`}
          aria-label={`${title} 풀이 상세 보기`}
          className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white sm:ml-2"
        >
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default SolutionListItem;