import { useEffect, useState } from 'react';
import { getSolutionPage } from '../api/solutionAPI';
import type { Solution } from '../types/solution';
import SolutionListItem from '../components/main/SolutionListItem';
import { Link } from "react-router-dom";
import { Plus } from 'lucide-react';

type SolutionFilter = 'all' | 'correct' | 'incorrect';
const SEARCH_STORAGE_KEY = 'solution-list-search';

function readSearchConditions(): { filter: SolutionFilter; searchQuery: string; page: number } {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? 'null');
    return {
      filter: saved?.filter === 'correct' || saved?.filter === 'incorrect'
        ? saved.filter
        : 'all',
      searchQuery: typeof saved?.searchQuery === 'string' ? saved.searchQuery : '',
      page: Number.isInteger(saved?.page) && saved.page >= 0 && saved.page <= 2147483647 ? saved.page : 0,
    };
  } catch {
    return { filter: 'all', searchQuery: '', page: 0 };
  }
}

function SolutionListPage() {
  // 백엔드에서 받아온 현재 페이지의 풀이 목록
  const [solutions, setSolutions] = useState<Solution[]>([]);

  // API 요청이 진행 중인지 저장
  const [loading, setLoading] = useState(true);

  // API 요청 실패 시 보여줄 오류 메시지
  const [error, setError] = useState('');

  // 현재 선택한 조회 조건
  const [initialConditions] = useState(readSearchConditions);
  const [filter, setFilter] = useState<SolutionFilter>(initialConditions.filter);

  const [searchQuery, setSearchQuery] = useState(initialConditions.searchQuery);
  const [page, setPage] = useState(initialConditions.page);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  function changeFilter(value: SolutionFilter) {
    setFilter(value);
    setPage(0);
  }

  function changeSearch(value: string) {
    setSearchQuery(value);
    setPage(0);
  }

  // 같은 탭에서 목록으로 돌아오거나 새로고침해도 검색 조건을 유지합니다.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SEARCH_STORAGE_KEY,
        JSON.stringify({ filter, searchQuery, page }),
      );
    } catch {
      // 브라우저가 저장소 사용을 제한해도 검색 기능은 계속 사용할 수 있습니다.
    }
  }, [filter, searchQuery, page]);

  useEffect(() => {
    let ignore = false;

    async function loadSolutions() {
      setLoading(true);
      setError('');

      try {
        const data = await getSolutionPage(page, searchQuery,
          filter === 'all' ? undefined : filter === 'correct');

        if (!ignore) {
          // 삭제 등으로 마지막 페이지가 없어졌다면 남아 있는 마지막 페이지로 이동합니다.
          const lastPage = Math.max(0, data.totalPages - 1);
          if (page > lastPage) {
            setPage(lastPage);
            return;
          }
          setSolutions(data.content);
          setTotalElements(data.totalElements);
          setTotalPages(data.totalPages);
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
  }, [filter, searchQuery, page]);

  const firstPage = Math.max(0, Math.min(page - 2, totalPages - 5));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => firstPage + i);

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
          onChange={(event) => changeSearch(event.target.value)}
          placeholder="문제 제목을 입력하세요"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-w-md"
        />
      </div>

      <div className="mt-6 flex gap-2" aria-label="풀이 결과 필터">
        <button
          type="button"
          onClick={() => changeFilter('all')}
          aria-pressed={filter === 'all'}
          className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => changeFilter('correct')}
          aria-pressed={filter === 'correct'}
          className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
        >
          정답
        </button>
        <button
          type="button"
          onClick={() => changeFilter('incorrect')}
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
            {totalElements.toLocaleString()}
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
        ) : solutions.length === 0 && !searchQuery.trim() ? (
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
                onClick={() => changeFilter('all')}
                className="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
              >
                전체 풀이 보기
              </button>
            )}
          </div>
        ) : solutions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">
              검색 조건에 맞는 풀이가 없습니다.
            </p>

            <button
              type="button"
              onClick={() => changeSearch('')}
              className="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:underline"
            >
              검색어 지우기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">
                전체 풀이의 문제, 문제 유형, 언어, 결과, 풀이 날짜
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
                {solutions.map((solution) => (
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
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && !error && totalPages > 0 && (
        <nav aria-label="풀이 목록 페이지" className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40">이전</button>
          {pageNumbers.map((number) => (
            <button key={number} type="button" onClick={() => setPage(number)}
              aria-label={`${number + 1}페이지`} aria-current={number === page ? 'page' : undefined}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm aria-[current=page]:border-blue-600 aria-[current=page]:bg-blue-600 aria-[current=page]:text-white">
              {number + 1}
            </button>
          ))}
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40">다음</button>
          <span className="w-full text-center text-xs text-zinc-500" role="status">{page + 1} / {totalPages} 페이지</span>
        </nav>
      )}
    </main>
  );
}

export default SolutionListPage;
