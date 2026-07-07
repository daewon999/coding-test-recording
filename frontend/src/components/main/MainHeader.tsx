import { Code2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

function MainHeader() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* 왼쪽 로고 영역 */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white"
        >
          <Code2 size={24} />

          <span className="text-lg font-semibold">
            Coding Test Recording
          </span>
        </Link>

        {/* 가운데 메뉴 영역 */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/solutions"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            풀이 기록
          </Link>

          <button
            type="button"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            문제 검색
          </button>

          <button
            type="button"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            풀이 비교
          </button>
        </nav>

        {/* 오른쪽 주요 버튼 */}
        <Link
          to="/solutions/new"
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">새 풀이 작성</span>
        </Link>
      </div>
    </header>
  );
}

export default MainHeader;