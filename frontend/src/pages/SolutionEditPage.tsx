import { validateSolution } from '../components/solution/validateSolution';
import SolutionFields from '../components/solution/SolutionFields';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSolutionById, updateSolution } from '../api/solutionAPI';
import type { Solution, SolutionUpdateRequest } from '../types/solution';
import { ArrowLeft } from 'lucide-react';

export default function SolutionEditPage() {
  const { solutionId } = useParams<{ solutionId: string }>();
  const id = Number(solutionId);

  if (!Number.isSafeInteger(id) || id < 1) {
    return <EditPageStatus message="올바르지 않은 풀이 ID입니다." isError />;
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
    return <EditPageStatus message={loadError} isError />;
  }
  if (!form || !solution) {
    return <EditPageStatus message="풀이를 불러오는 중입니다..." />;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link
        to={detailUrl}
        aria-disabled={isSubmitting}
        onClick={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
        className={`mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 ${isSubmitting
            ? 'cursor-not-allowed opacity-50'
            : 'hover:text-zinc-900'
          }`}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        풀이 상세로
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          풀이 수정
        </h1>
        <p className="mt-2 break-words text-sm text-zinc-500">
          {solution.platform} · {solution.problemNumber} — {solution.problemTitle}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="space-y-6"
      >
        <fieldset
          disabled={isSubmitting}
          className="min-w-0 space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <legend className="sr-only">풀이 정보</legend>
          <h2 className="text-base font-semibold text-zinc-900">
            풀이 정보
          </h2>

          <SolutionFields form={form} onChange={change} />
        </fieldset>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(detailUrl)}
            disabled={isSubmitting}
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : '수정 저장'}
          </button>
        </div>

        {saveError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {saveError}
          </p>
        )}
      </form>
    </main>
  );
}

function EditPageStatus({
  message,
  isError = false,
}: {
  message: string;
  isError?: boolean;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link
        to="/solutions"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        풀이 목록으로
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        풀이 수정
      </h1>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center shadow-sm">
        <p
          role={isError ? 'alert' : 'status'}
          className={`text-sm ${isError ? 'text-red-700' : 'text-zinc-500'}`}
        >
          {message}
        </p>
      </div>
    </main>
  );
}
