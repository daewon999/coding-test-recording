import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { deleteSolution, deleteSolutionsByProblemId, getSolutionById, getSolutionsByProblemId, } from '../api/solutionAPI';
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
  const selectedHistory = useRef<HTMLDetailsElement | null>(null);

  // 백엔드에서 받아온 풀이 한 개를 저장합니다.
  const [solution, setSolution] = useState<Solution | null>(null);

  // API 요청이 진행 중인지 저장합니다.
  const [isLoading, setIsLoading] = useState(true);

  // 오류 메시지를 저장합니다.
  const [error, setError] = useState<string | null>(null);

  // 같은 문제에 연결된 풀이 이력
  const [solutions, setSolutions] = useState<Solution[]>([]);

  // 풀이 날짜가 최근인 순서로 정렬합니다.
  const sortedSolutions = [...solutions].sort(
    (a, b) =>
      b.solvedDate.localeCompare(a.solvedDate) || b.id - a.id,
  );

  const latestSolvedDate = sortedSolutions[0]?.solvedDate;

  // 같은 언어는 한 번만 표시합니다.
  const usedLanguages = [
    ...new Set(solutions.map((item) => item.language)),
  ].join(' · ');


  useEffect(() => {
    let cancelled = false;
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

        const data = await getSolutionById(parsedSolutionId);
        if (cancelled) return;
        const history = await getSolutionsByProblemId(data.problemId);
        if (cancelled) return;

        setSolution(data);
        setSolutions(history);
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setError('풀이 상세 정보를 불러오지 못했습니다.');
      } finally {
        // 성공하든 실패하든 요청이 끝나면 로딩을 종료합니다.
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSolution();
    return () => { cancelled = true; };
  }, [solutionId]);

  useEffect(() => {
    if (isLoading || error || solution?.id !== Number(solutionId)) return;
    const frame = requestAnimationFrame(() => {
      const history = selectedHistory.current;
      if (!history) return;
      window.scrollTo({
        top: window.scrollY + history.getBoundingClientRect().top - 96,
        behavior: 'instant',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [isLoading, error, solution, solutionId]);

  async function handleDelete(target: Solution) {
    if (!solution || deleting.current) return;

    const confirmed = window.confirm(
      `${target.solvedDate} · ${target.language} 풀이를 삭제하시겠습니까? 삭제한 풀이는 복구할 수 없습니다.`,
    );
    if (!confirmed) return;

    deleting.current = true;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteSolution(target.id);

      const remaining = solutions.filter(
        (item) => item.id !== target.id,
      );
      setSolutions(remaining);

      if (remaining.length === 0) {
        navigate('/solutions', { replace: true });
      } else if (target.id === solution.id) {
        const latest = [...remaining].sort(
          (a, b) =>
            b.solvedDate.localeCompare(a.solvedDate) || b.id - a.id,
        )[0];

        navigate(`/solutions/${latest.id}`, { replace: true });
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : '풀이 삭제 중 오류가 발생했습니다.',
      );
    } finally {
      deleting.current = false;
      setIsDeleting(false);
    }
  }

  async function handleDeleteAll() {
    if (!solution || deleting.current) return;

    const confirmed = window.confirm(
      `"${solution.problemTitle}" 문제의 풀이 ${solutions.length}개를 모두 삭제하시겠습니까?\n\n삭제한 코드와 메모는 복구할 수 없습니다. 문제 정보는 유지됩니다.`,
    );
    if (!confirmed) return;

    deleting.current = true;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteSolutionsByProblemId(solution.problemId);
      navigate('/solutions', { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : '전체 풀이 삭제 중 오류가 발생했습니다.',
      );
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
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={isDeleting || solutions.length === 0}
          className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} aria-hidden="true" />
          전체 풀이 삭제
        </button>
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

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-zinc-500">사용 언어</dt>
            <dd className="mt-2 font-semibold text-zinc-900">
              {usedLanguages || '기록 없음'}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-zinc-500">최근 풀이 날짜</dt>
            <dd className="mt-2 font-semibold text-zinc-900">
              {latestSolvedDate ? (
                <time dateTime={latestSolvedDate}>
                  {latestSolvedDate}
                </time>
              ) : (
                '기록 없음'
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-zinc-500">누적 풀이 수</dt>
            <dd className="mt-2 font-semibold text-zinc-900">
              {solutions.length.toLocaleString()}회
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          풀이 이력 ({solutions.length}개)
        </h2>

        {sortedSolutions.map((item) => (
          <details
            key={item.id}
            ref={item.id === solution.id ? selectedHistory : undefined}
            open={item.id === solution.id}
            className="scroll-mt-24 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <summary className="cursor-pointer px-6 py-4 font-medium text-zinc-900">
              <time dateTime={item.solvedDate}>{item.solvedDate}</time>
              {' · '}
              {item.language}
              {' · '}
              <span
                className={
                  item.correct ? 'text-emerald-700' : 'text-red-700'
                }
              >
                {item.correct ? '정답' : '오답'}
              </span>
            </summary>

            <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-3">
              <Link
                to={`/solutions/${item.id}/edit`}
                aria-disabled={isDeleting}
                onClick={(event) => {
                  if (isDeleting) event.preventDefault();
                }}
                className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white ${isDeleting
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-blue-700'
                  }`}
              >
                <Pencil size={16} aria-hidden="true" />
                수정
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(item)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} aria-hidden="true" />
                삭제
              </button>
            </div>

            <div className="border-t border-zinc-200">
              <h3 className="px-6 pt-4 font-semibold">풀이 코드</h3>
              <pre className="mt-3 max-h-[600px] overflow-auto bg-zinc-50 p-6 text-sm leading-7 text-zinc-800">
                <code>{item.code}</code>
              </pre>

              <div className="p-6">
                <h3 className="mb-3 font-semibold">풀이 메모</h3>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700">
                  {item.memo?.trim() ? item.memo : '작성된 메모가 없습니다.'}
                </p>
              </div>
            </div>
          </details>
        ))}
      </section>
    </main>
  );
}

export default SolutionDetailPage;
