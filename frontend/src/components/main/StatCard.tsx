import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-zinc-600">
          {title}
        </h3>

        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
        {value.toLocaleString()}
        <span className="ml-1 text-sm font-normal text-zinc-500">
          건
        </span>
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        {description}
      </p>
    </article>
  );
}

export default StatCard;