import { useEffect, useState } from 'react';
import { getAllSolutions } from '../api/solutionAPI';
import type { Solution } from '../types/solution';

function SolutionListPage() {
  // 백엔드에서 받아온 전체 풀이 목록
  const [solutions, setSolutions] = useState<Solution[]>([]);

  // API 요청이 진행 중인지 저장
  const [loading, setLoading] = useState(true);

  // API 요청 실패 시 보여줄 오류 메시지
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSolutions() {
      try {
        // solutionAPI.ts의 전체 풀이 조회 함수 실행
        const data = await getAllSolutions();

        // 응답받은 풀이 배열을 상태에 저장
        setSolutions(data);
      } catch (error) {
        console.error('풀이 조회 오류:', error);
        setError('풀이 목록을 불러오지 못했습니다.');
      } finally {
        // 성공하거나 실패하면 로딩 종료
        setLoading(false);
      }
    }

    loadSolutions();
  }, []);

  if (loading) {
    return <p>풀이 목록을 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>코딩테스트 풀이 기록</h1>

      <p>총 {solutions.length}개의 풀이가 있습니다.</p>

      {solutions.length === 0 ? (
        <p>저장된 풀이가 없습니다.</p>
      ) : (
        <div>
          {solutions.map((solution) => (
            <article key={solution.id}>
              <h2>
                {solution.platform} {solution.problemNumber}
                {' - '}
                {solution.problemTitle}
              </h2>

              <p>사용 언어: {solution.language}</p>
              <p>풀이 날짜: {solution.solvedDate}</p>
              <p>시도 횟수: {solution.attemptCount}회</p>
              <p>결과: {solution.correct ? '정답' : '오답'}</p>

              {solution.memo && <p>메모: {solution.memo}</p>}

              <pre>
                <code>{solution.code}</code>
              </pre>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default SolutionListPage;