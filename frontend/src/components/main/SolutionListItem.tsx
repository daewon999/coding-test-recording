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
    <tr className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
      <td className="px-6 py-4">
        <Link
          to={`/solutions/${id}`}
          className="font-medium text-zinc-900 hover:text-blue-600 hover:underline"
        >
          {title}
        </Link>

        <p className="mt-1 text-xs text-zinc-500">
          {platform} · {problemNumber}
        </p>
      </td>

      <td className="px-6 py-4">
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
          {language}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            correct
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {correct ? '정답' : '오답'}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-zinc-500">
        <time dateTime={solvedDate}>{solvedDate}</time>
      </td>
    </tr>
  );
}

export default SolutionListItem;