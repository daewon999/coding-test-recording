import { BookOpen, CircleCheck, CalendarDays } from 'lucide-react';
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
      icon: BookOpen,
    },
    {
      title: '정답 풀이',
      value: solutions.filter((solution) => solution.correct).length,
      description: '정답으로 기록한 풀이',
      icon: CircleCheck,
    },
    {
      title: '이번 달 풀이',
      value: solutions.filter((solution) =>
        solution.solvedDate.startsWith(currentMonth),
      ).length,
      description: '이번 달에 푼 풀이 기록',
      icon: CalendarDays,
    },
  ];

  return (
    <section aria-labelledby="stats-title" className="mt-8">
      <h2 id="stats-title" className="sr-only">
        나의 풀이 현황
      </h2>

      {isLoading ? (
        <p role="status" className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
          풀이 통계를 불러오는 중입니다...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default StatsSection;