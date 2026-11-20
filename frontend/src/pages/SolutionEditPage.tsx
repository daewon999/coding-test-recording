import { validateSolution } from '../components/solution/validateSolution';
import SolutionFields from '../components/solution/SolutionFields';
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
    const validationError = validateSolution(form);
    if (validationError) {
      setSaveError(validationError);
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
          {/* 공통폼으로 입력칸 대체 */}
          <SolutionFields form={form} onChange={change} />
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
