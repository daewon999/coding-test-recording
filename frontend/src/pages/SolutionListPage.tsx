import { useEffect, useState } from 'react';
import { getAllSolutions, getSolutionsByCorrect } from '../api/solutionAPI';
import type { Solution } from '../types/solution';
import SolutionListItem from '../components/main/SolutionListItem';
import { Link } from "react-router-dom";
import { Plus } from 'lucide-react';

function SolutionListPage() {
  // 백엔드에서 받아온 전체 풀이 목록
  const [solutions, setSolutions] = useState<Solution[]>([]);

  // API 요청이 진행 중인지 저장
  const [loading, setLoading] = useState(true);

  // API 요청 실패 시 보여줄 오류 메시지
  const [error, setError] = useState('');

  // 현재 선택한 조회 조건
  const [filter, setFilter] =
    useState<'all' | 'correct' | 'incorrect'>('all');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadSolutions() {
      setLoading(true);
      setError('');

      try {
        const data =
          filter === 'all'
            ? await getAllSolutions()
            : await getSolutionsByCorrect(filter === 'correct');

        if (!ignore) {
          setSolutions(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error('풀이 조회 오류:', error);
          setError('풀이 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSolutions();

    return () => {
      ignore = true;
    };
  }, [filter]);

  // 검색어 앞뒤 공백을 제거하고 영어를 소문자로 통일합니다.
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // 현재 정답·오답 필터로 가져온 목록에서 제목을 검색합니다.
  const visibleSolutions = solutions.filter((solution) =>
    solution.problemTitle.toLowerCase().includes(normalizedQuery),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            풀이 기록
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            저장한 풀이를 살펴보고 학습 과정을 돌아보세요.
          </p>
        </div>

        <Link
          to="/solutions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} aria-hidden="true" />
          새 풀이 작성
        </Link>
      </header>


      <div className="mt-6">
        <label
          htmlFor="title-search"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          문제 제목 검색
        </label>

        <input
          id="title-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="문제 제목을 입력하세요"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-w-md"
        />
      </div>

      <div className="mt-6 flex gap-2" aria-label="풀이 결과 필터">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => setFilter('correct')}
          aria-pressed={filter === 'correct'}
          className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
        >
          정답
        </button>
        <button
          type="button"
          onClick={() => setFilter('incorrect')}
          aria-pressed={filter === 'incorrect'}
          className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
        >
          오답
        </button>
      </div>

      {!loading && !error && (
        <p className="mt-8 mb-4 text-sm text-zinc-500">
          총{' '}
          <span className="font-semibold text-zinc-900">
            {visibleSolutions.length.toLocaleString()}
          </span>
          개의 풀이
        </p>
      )}

      <div
        className={`overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm ${loading || error ? 'mt-8' : ''
          }`}
      >
        {loading ? (
          <p role="status" className="px-6 py-12 text-center text-sm text-zinc-500">
            풀이 목록을 불러오는 중입니다...
          </p>
        ) : error ? (
          <p role="alert" className="px-6 py-12 text-center text-sm text-red-700">
            {error}
          </p>
        ) : solutions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">
              {filter === 'all'
                ? '아직 저장한 풀이가 없습니다.'
                : filter === 'correct'
                  ? '정답 풀이가 없습니다.'
                  : '오답 풀이가 없습니다.'}
            </p>

            {filter === 'all' ? (
              <Link
                to="/solutions/new"
                className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:underline"
              >
                첫 풀이 등록하기
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
              >
                전체 풀이 보기
              </button>
            )}
          </div>
        ) : visibleSolutions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">
              검색 조건에 맞는 풀이가 없습니다.
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
            >
              검색어 지우기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <caption className="sr-only">
                전체 풀이의 문제, 언어, 결과, 풀이 날짜
              </caption>

              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    문제
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
                {visibleSolutions.map((solution) => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default SolutionListPage;