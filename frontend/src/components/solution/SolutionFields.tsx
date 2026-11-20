import type { SolutionUpdateRequest } from '../../types/solution';

type Props = {
  form: SolutionUpdateRequest;
  onChange: <K extends keyof SolutionUpdateRequest>(key: K, value: SolutionUpdateRequest[K]) => void;
};

export default function SolutionFields({ form, onChange: change }: Props) {
  const inputClass = 'mt-2 block w-full rounded-lg border border-gray-400 bg-transparent p-3';
  return (
    <>
          <div>
            <label htmlFor="language">사용 언어</label>
            <input id="language" value={form.language} onChange={(e) => change('language', e.target.value)} required maxLength={255} className={inputClass} />
          </div>
          <div>
            <label htmlFor="code">풀이 코드</label>
            <textarea id="code" value={form.code} onChange={(e) => change('code', e.target.value)} required rows={16} className={inputClass + ' font-mono'} />
          </div>
          <div>
            <label htmlFor="memo">풀이 메모 (선택)</label>
            <textarea id="memo" value={form.memo} onChange={(e) => change('memo', e.target.value)} rows={5} className={inputClass} />
          </div>
          <div>
            <label htmlFor="attemptCount">시도 횟수</label>
            <input id="attemptCount" type="number" min={1} max={2147483647} step={1} required value={Number.isNaN(form.attemptCount) ? '' : form.attemptCount} onChange={(e) => change('attemptCount', e.target.valueAsNumber)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="correct">정답 여부</label>
            <select id="correct" value={String(form.correct)} onChange={(e) => change('correct', e.target.value === 'true')} className={inputClass}>
              <option value="true">정답</option>
              <option value="false">오답</option>
            </select>
          </div>
          <div>
            <label htmlFor="solvedDate">풀이 날짜</label>
            <input id="solvedDate" type="date" required value={form.solvedDate} onChange={(e) => change('solvedDate', e.target.value)} className={inputClass} />
          </div>
    </>
  );
}
