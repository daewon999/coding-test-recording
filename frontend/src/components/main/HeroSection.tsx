import { ArrowRight, History, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="border-b border-zinc-800 py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* 왼쪽: 서비스 소개 */}
        <div>
          <p className="mb-4 text-sm font-medium text-zinc-400">
            Coding Test Learning Record
          </p>

          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            풀이를 기록하고
            <br />
            이전 코드와 비교하며
            <br />
            성장하세요.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
            코딩테스트 풀이 코드와 메모를 저장하고, 같은 문제를 다시
            풀었을 때 이전 풀이와 비교할 수 있습니다.
          </p>

          {/* 주요 버튼 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/solutions/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              <Plus size={18} />
              새 풀이 기록하기
            </Link>

            <Link
              to="/solutions"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              <History size={18} />
              이전 풀이 보기
            </Link>
          </div>
        </div>

        {/* 오른쪽: 서비스 요약 카드 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-sm text-zinc-500">최근 풀이</p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                백준 1260 · DFS와 BFS
              </h2>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              정답
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Python</span>
              <span className="text-xs text-zinc-600">2026.07.07</span>
            </div>

            <pre className="mt-4 overflow-hidden text-sm leading-6 text-zinc-300">
              <code>{`def dfs(graph, start):
    visited = set()
    stack = [start]

    while stack:
        node = stack.pop()`}</code>
            </pre>
          </div>

          <Link
            to="/solutions"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            풀이 기록 확인하기
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;