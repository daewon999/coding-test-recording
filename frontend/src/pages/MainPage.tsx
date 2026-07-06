import { Code2, Plus } from 'lucide-react';

function MainPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
              <Code2 size={24} />
            </div>

            <div>
              <p className="text-sm text-zinc-400">
                Coding Test Recording
              </p>

              <h1 className="text-2xl font-bold">
                오늘의 풀이를 기록해보세요
              </h1>
            </div>
          </div>

          <button
            type="button"
            className="
              inline-flex items-center gap-2 rounded-lg
              bg-violet-600 px-4 py-2 font-medium
              transition hover:bg-violet-500
            "
          >
            <Plus size={18} />
            새 풀이 작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;