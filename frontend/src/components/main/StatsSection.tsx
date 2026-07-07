import StatCard from './StatCard';

const stats = [
  {
    title: '전체 풀이',
    value: 24,
    description: '지금까지 저장한 풀이 기록',
  },
  {
    title: '정답 풀이',
    value: 19,
    description: '정답으로 기록한 풀이',
  },
  {
    title: '이번 달 풀이',
    value: 8,
    description: '이번 달에 추가한 풀이',
  },
];

function StatsSection() {
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
    </section>
  );
}

export default StatsSection;