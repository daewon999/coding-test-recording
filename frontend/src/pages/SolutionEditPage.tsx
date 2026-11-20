import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSolutionById, updateSolution } from '../api/solutionAPI';
import type { Solution, SolutionUpdateRequest } from '../types/solution';

export default function SolutionEditPage() {
  const { solutionId } = useParams<{ solutionId: string }>();
  const id = Number(solutionId);

  if (!Number.isSafeInteger(id) || id < 1) {
    return <main className="mx-auto max-w-3xl p-6"><p role="alert">올바르지 않은 풀이 ID입니다.</p><Link to="/solutions">목록으로</Link></main>;
  }

  // 주소가 바뀌면 이전 풀이의 입력값과 요청 상태를 초기화합니다.
  return <SolutionEditForm key={id} solutionId={id} />;
}

function SolutionEditForm({ solutionId }: { solutionId: number }) {
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [form, setForm] = useState<SolutionUpdateRequest | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const active = useRef(false);

  useEffect(() => {
    let ignore = false;
    active.current = true;

    async function loadSolution() {
      try {
        const data = await getSolutionById(solutionId);
        if (ignore) return;
        setSolution(data);
        setForm({
          language: data.language,
          code: data.code,
          memo: data.memo ?? '',
          attemptCount: data.attemptCount,
          correct: data.correct,
          solvedDate: data.solvedDate,
        });
      } catch {
        if (!ignore) setLoadError('풀이를 불러오지 못했습니다. 풀이가 존재하는지와 서버 연결을 확인해주세요.');
      }
    }

    void loadSolution();
    return () => {
      ignore = true;
      active.current = false;
    };
  }, [solutionId]);

  function change<K extends keyof SolutionUpdateRequest>(key: K, value: SolutionUpdateRequest[K]) {
    setForm((previous) => previous ? { ...previous, [key]: value } : previous);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || submitting.current) return;
    if (!form.language.trim() || !form.code.trim() || !form.solvedDate
      || !Number.isInteger(form.attemptCount) || form.attemptCount < 1
      || form.attemptCount > 2147483647) {
      setSaveError('언어·코드·날짜와 시도 횟수(1 이상의 정수)를 확인해주세요.');
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);
    setSaveError('');
    try {
      const saved = await updateSolution(solutionId, form);
      if (active.current) navigate(`/solutions/${saved.id}`, { replace: true });
    } catch (error) {
      if (active.current) setSaveError(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.');
    } finally {
      submitting.current = false;
      if (active.current) setIsSubmitting(false);
    }
  }

  const detailUrl = `/solutions/${solutionId}`;
  const inputClass = 'mt-2 block w-full rounded-lg border border-gray-400 bg-transparent p-3';

  if (loadError) {
    return <main className="mx-auto max-w-3xl p-6"><p role="alert">{loadError}</p><Link to="/solutions">목록으로</Link></main>;
  }
  if (!form || !solution) {
    return <main className="mx-auto max-w-3xl p-6"><p role="status">풀이를 불러오는 중입니다...</p></main>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-3 text-2xl font-bold">풀이 수정</h1>
      <p className="mb-6">{solution.platform} {solution.problemNumber} — {solution.problemTitle}</p>
      <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="space-y-5">
          <legend className="sr-only">풀이 정보</legend>
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
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{isSubmitting ? '저장 중...' : '수정 저장'}</button>
            <button type="button" onClick={() => navigate(detailUrl)} className="rounded-lg border px-4 py-2">취소</button>
          </div>
        </fieldset>
        {saveError && <p role="alert" className="mt-4 text-red-600">{saveError}</p>}
      </form>
    </main>
  );
}
