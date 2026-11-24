import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { deleteSolution, getSolutionById } from '../api/solutionAPI';
import type { Solution } from '../types/solution';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

function SolutionDetailPage() {
  // URL의 :solutionId 값을 가져옵니다.
  // 예: /solutions/1 → solutionId는 "1"
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const savedMessage = (location.state as { savedMessage?: string } | null)?.savedMessage;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const deleting = useRef(false);

  // 백엔드에서 받아온 풀이 한 개를 저장합니다.
  const [solution, setSolution] = useState<Solution | null>(null);

  // API 요청이 진행 중인지 저장합니다.
  const [isLoading, setIsLoading] = useState(true);

  // 오류 메시지를 저장합니다.
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSolution() {
      // URL에 solutionId가 없다면 API를 호출할 수 없습니다.
      if (!solutionId) {
        setError('풀이 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      // useParams로 받은 값은 문자열이므로 숫자로 변환합니다.
      const parsedSolutionId = Number(solutionId);

      // /solutions/abc처럼 숫자가 아닌 주소가 들어온 경우를 처리합니다.
      if (Number.isNaN(parsedSolutionId)) {
        setError('올바르지 않은 풀이 ID입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // GET /api/solutions/{solutionId} 요청
        const data = await getSolutionById(parsedSolutionId);

        setSolution(data);
      } catch (error) {
        console.error(error);
        setError('풀이 상세 정보를 불러오지 못했습니다.');
      } finally {
        // 성공하든 실패하든 요청이 끝나면 로딩을 종료합니다.
        setIsLoading(false);
      }
    }

    fetchSolution();
  }, [solutionId]);

  async function handleDelete() {
    if (!solution || deleting.current) return;

    const confirmed = window.confirm(
      '이 풀이를 삭제하시겠습니까? 삭제한 풀이는 복구할 수 없습니다. 문제 정보는 유지됩니다.',
    );
    if (!confirmed) return;

    deleting.current = true;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteSolution(solution.id);
      navigate('/solutions', { replace: true });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '풀이 삭제 중 오류가 발생했습니다.');
    } finally {
      deleting.current = false;
      setIsDeleting(false);
    }
  }

  if (isLoading || error || !solution) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Link
          to="/solutions"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          풀이 목록으로
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          풀이 상세
        </h1>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center shadow-sm">
          {isLoading ? (
            <p role="status" className="text-sm text-zinc-500">
              풀이 정보를 불러오는 중입니다...
            </p>
          ) : (
            <p role="alert" className="text-sm text-red-700">
              {error || '풀이 정보가 없습니다.'}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {savedMessage && <p role="status" className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">{savedMessage}</p>}

      <Link
        to="/solutions"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        풀이 목록으로
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">
            {solution.platform} · {solution.problemNumber}
          </p>

          <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-zinc-900">
            {solution.problemTitle}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            작성한 풀이와 학습 메모를 확인하세요.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={`/solutions/${solution.id}/edit`}
            aria-disabled={isDeleting}
            onClick={(event) => {
              if (isDeleting) event.preventDefault();
            }}
            className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors ${isDeleting
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-blue-700'
              }`}
          >
            <Pencil size={16} aria-hidden="true" />
            수정
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} aria-hidden="true" />
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </header>

      {deleteError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {deleteError}
        </p>
      )}

<section
  aria-labelledby="solution-info-title"
  className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
>
  <h2 id="solution-info-title" className="sr-only">
    풀이 정보
  </h2>

  <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
    <div>
      <dt className="text-sm text-zinc-500">사용 언어</dt>
      <dd className="mt-2 font-semibold text-zinc-900">
        {solution.language}
      </dd>
    </div>

    <div>
      <dt className="text-sm text-zinc-500">풀이 날짜</dt>
      <dd className="mt-2 font-semibold text-zinc-900">
        <time dateTime={solution.solvedDate}>
          {solution.solvedDate}
        </time>
      </dd>
    </div>

    <div>
      <dt className="text-sm text-zinc-500">시도 횟수</dt>
      <dd className="mt-2 font-semibold text-zinc-900">
        {solution.attemptCount.toLocaleString()}회
      </dd>
    </div>

    <div>
      <dt className="text-sm text-zinc-500">결과</dt>
      <dd className="mt-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            solution.correct
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {solution.correct ? '정답' : '오답'}
        </span>
      </dd>
    </div>
  </dl>
</section>

{/* 풀이 코드 */}
<section
  aria-labelledby="solution-code-title"
  className="mt-6 min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
>
  <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-6 py-4">
    <h2
      id="solution-code-title"
      className="font-semibold text-zinc-900"
    >
      풀이 코드
    </h2>

    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
      {solution.language}
    </span>
  </div>

  <pre className="max-h-[600px] overflow-auto bg-zinc-50 p-6 text-sm leading-7 text-zinc-800">
    <code>{solution.code}</code>
  </pre>
</section>

{/* 풀이 메모 */}
<section
  aria-labelledby="solution-memo-title"
  className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
>
  <div className="border-b border-zinc-200 px-6 py-4">
    <h2
      id="solution-memo-title"
      className="font-semibold text-zinc-900"
    >
      풀이 메모
    </h2>
  </div>

  <div className="p-6">
    {solution.memo?.trim() ? (
      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700">
        {solution.memo}
      </p>
    ) : (
      <p className="text-sm text-zinc-500">
        작성된 메모가 없습니다.
      </p>
    )}
  </div>
</section>
    </main>
  );
}

export default SolutionDetailPage;
