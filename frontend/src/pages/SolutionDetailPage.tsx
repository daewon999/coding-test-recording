import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getSolutionById } from '../api/solutionAPI';
import type { Solution } from '../types/solution';

function SolutionDetailPage() {
  // URL의 :solutionId 값을 가져옵니다.
  // 예: /solutions/1 → solutionId는 "1"
  const { solutionId } = useParams<{ solutionId: string }>();

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