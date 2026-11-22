import type { SolutionUpdateRequest } from '../../types/solution';

type Props = {
  form: SolutionUpdateRequest;
  onChange: <K extends keyof SolutionUpdateRequest>(key: K, value: SolutionUpdateRequest[K]) => void;
};

export default function SolutionFields({ form, onChange: change }: Props) {
  const inputClass =
  'mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500';
  const labelClass = 'text-sm font-medium text-zinc-700';

  return (
    <>
          <div>
            <label htmlFor="language" className={labelClass}>사용 언어</label>
            <input id="language" value={form.language} onChange={(e) => change('language', e.target.value)} required maxLength={255} className={inputClass} />
          </div>
          <div>
            <label htmlFor="code" className={labelClass}>풀이 코드</label>
            <textarea id="code" value={form.code} onChange={(e) => change('code', e.target.value)} required rows={16} className={inputClass + ' min-h-64 resize-y font-mono leading-6'} />
          </div>
          <div>
            <label htmlFor="memo" className={labelClass}>풀이 메모 (선택)</label>
            <textarea id="memo" value={form.memo} onChange={(e) => change('memo', e.target.value)} rows={5} className={inputClass + ' resize-y leading-6'} />
          </div>
          <div>
            <label htmlFor="attemptCount" className={labelClass}>시도 횟수</label>
            <input id="attemptCount" type="number" min={1} max={2147483647} step={1} required value={Number.isNaN(form.attemptCount) ? '' : form.attemptCount} onChange={(e) => change('attemptCount', e.target.valueAsNumber)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="correct" className={labelClass}>정답 여부</label>
            <select id="correct" value={String(form.correct)} onChange={(e) => change('correct', e.target.value === 'true')} className={inputClass}>
              <option value="true">정답</option>
              <option value="false">오답</option>
            </select>
          </div>
          <div>
            <label htmlFor="solvedDate" className={labelClass}>풀이 날짜</label>
            <input id="solvedDate" type="date" required value={form.solvedDate} onChange={(e) => change('solvedDate', e.target.value)} className={inputClass} />
          </div>
    </>
  );
}
