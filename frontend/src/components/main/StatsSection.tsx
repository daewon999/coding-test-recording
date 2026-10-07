import type { Solution } from '../../types/solution';
import StatCard from './StatCard';

interface StatsSectionProps {
  solutions: Solution[];
  isLoading: boolean;
  error: string;
}

function StatsSection({
  solutions,
  isLoading,
  error,
}: StatsSectionProps) {
  const today = new Date();
  const currentMonth =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const stats = [
    {
      title: '전체 풀이',
      value: solutions.length,
      description: '지금까지 저장한 풀이 기록',
    },
    {
      title: '정답 풀이',
      value: solutions.filter((solution) => solution.correct).length,
      description: '정답으로 기록한 풀이',
    },
    {
      title: '이번 달 풀이',
      value: solutions.filter((solution) =>
        solution.solvedDate.startsWith(currentMonth),
      ).length,
      description: '이번 달에 푼 풀이 기록',
    },
  ];

  return (
    <section className="border-b border-zinc-800 py-16">
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-500">
          Learning Statistics
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          나의 풀이 현황
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          저장한 풀이 기록을 기준으로 학습 현황을 확인할 수 있습니다.
        </p>
      </div>

      {isLoading ? (
        <p role="status" className="text-sm text-zinc-400">
          풀이 통계를 불러오는 중입니다...
        </p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default StatsSection;
