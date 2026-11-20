import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { deleteSolution, getSolutionById } from '../api/solutionAPI';
import type { Solution } from '../types/solution';

function SolutionDetailPage() {
  // URL의 :solutionId 값을 가져옵니다.
  // 예: /solutions/1 → solutionId는 "1"
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();
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

  if (isLoading) {
    return <p>풀이 정보를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!solution) {
    return <p>풀이 정보가 없습니다.</p>;
  }

  return (
    <main>
      <h1>풀이 상세</h1>

      <Link
        to={`/solutions/${solution.id}/edit`}
        aria-disabled={isDeleting}
        onClick={(event) => { if (isDeleting) event.preventDefault(); }}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="ml-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? '삭제 중...' : '삭제'}
      </button>
      {deleteError && <p role="alert" className="mt-3 text-red-600">{deleteError}</p>}

      <section>
        <p>
          <strong>풀이 ID:</strong> {solution.id}
        </p>

        <p>
          <strong>언어:</strong> {solution.language}
        </p>

        <p>
          <strong>풀이 날짜:</strong> {solution.solvedDate}
        </p>

        <p>
          <strong>시도 횟수:</strong> {solution.attemptCount}
        </p>

        <p>
          <strong>정답 여부:</strong>{' '}
          {solution.correct ? '정답' : '오답'}
        </p>
      </section>

      <section>
        <h2>풀이 코드</h2>

        <pre>
          <code>{solution.code}</code>
        </pre>
      </section>

      <section>
        <h2>메모</h2>

        <p>{solution.memo || '작성된 메모가 없습니다.'}</p>
      </section>
    </main>
  );
}

export default SolutionDetailPage;
