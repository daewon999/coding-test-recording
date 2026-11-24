import { validateSolution } from '../components/solution/validateSolution';
import SolutionFields from '../components/solution/SolutionFields';
import type { SolutionUpdateRequest } from '../types/solution';
import { type FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { recordSolution } from '../api/solutionAPI';
import type { Problem } from '../types/problem';

function getTodayString(): string {
  const today = new Date();

  // 현재 컴퓨터의 현지 시간을 기준으로 날짜를 만듭니다.
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60 * 1000,
  );

  return localDate.toISOString().split('T')[0];
}

export default function SolutionCreatePage() {
  const navigate = useNavigate();

  // 문제 정보
  const [platform, setPlatform] = useState('BOJ');
  const [problemNumber, setProblemNumber] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  const [form, setForm] = useState<SolutionUpdateRequest>(() => ({
    language: 'Python', code: '', memo: '',
    correct: true, solvedDate: getTodayString(),
  }));
  const submitting = useRef(false);

  function change<K extends keyof SolutionUpdateRequest>(key: K, value: SolutionUpdateRequest[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
  }

  // 저장 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [candidates, setCandidates] = useState<Problem[]>([]);
  const [choice, setChoice] = useState<string>('');
  const [canCreateNew, setCanCreateNew] = useState(false);

  /**
   * 저장 버튼을 눌렀을 때 실행되는 함수입니다.
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    // form 제출 시 브라우저가 새로고침되는 것을 막습니다.
    event.preventDefault();

    if (submitting.current) return;
    if (candidates.length > 0 && !choice) {
      setMessage('기존 문제 또는 새 문제로 저장을 선택해주세요.');
      return;
    }
    const validationError = validateSolution(form);
    if (validationError) {
      setMessage(validationError);
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await recordSolution({
        problem: { platform, problemNumber, title, url, tags },
        solution: form,
        selectedProblemId: choice && choice !== 'new' ? Number(choice) : null,
        createNew: choice === 'new',
      });
      if (!result.solution) {
        setCandidates(result.candidates);
        setCanCreateNew(result.canCreateNew);
        setChoice('');
        setMessage('같은 URL 또는 제목의 문제가 있어요. 아래에서 저장 방법을 선택해주세요.');
        return;
      }
      navigate(`/solutions/${result.solution.id}`, {
        replace: true,
        state: { savedMessage: result.reusedProblem
          ? '이전에 등록한 문제에 새 풀이를 추가했어요.'
          : '새 문제와 풀이를 저장했어요.' },
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('저장 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      /*
       * 성공하거나 실패해도 마지막에는
       * 저장 중 상태를 종료합니다.
       */
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500';

  const labelClass = 'text-sm font-medium text-zinc-700';

  const cardClass =
    'min-w-0 space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm';

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link
        to="/solutions"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        풀이 목록으로
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          새 풀이 작성
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          문제 정보와 풀이를 기록하세요.
        </p>
      </header>

      <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-6">
        <fieldset disabled={isSubmitting} className={cardClass} onChange={() => {
          setCandidates([]);
          setChoice('');
          setMessage('');
        }}>
          <legend className="sr-only">문제 정보</legend>
          <h2 className="text-base font-semibold text-zinc-900">
            문제 정보
          </h2>

          <div>
            <label htmlFor="platform" className={labelClass}>플랫폼</label>

            <select
              id="platform"
              value={platform}
              onChange={(event) =>
                setPlatform(event.target.value)
              }
              className={inputClass}
            >
              <option value="BOJ">백준</option>
              <option value="PROGRAMMERS">프로그래머스</option>
              <option value="LEETCODE">LeetCode</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          <div>
            <label htmlFor="problemNumber" className={labelClass}>문제 번호 (선택)</label>

            <input
              id="problemNumber"
              type="text"
              value={problemNumber}
              onChange={(event) =>
                setProblemNumber(event.target.value)
              }
              placeholder="번호가 있는 경우에만 입력하세요"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>문제 제목</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="예: A+B"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="url" className={labelClass}>문제 URL</label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.acmicpc.net/problem/1000"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tags" className={labelClass}>태그</label>

            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="예: 수학, 구현"
              className={inputClass}
            />
          </div>
        </fieldset>

        <fieldset disabled={isSubmitting} className={cardClass}>
          <legend className="sr-only">풀이 정보</legend>
          <h2 className="text-base font-semibold text-zinc-900">
            풀이 정보
          </h2>

          {/* 공통폼으로 입력칸 대체 */}
          <SolutionFields form={form} onChange={change} />
        </fieldset>

        {candidates.length > 0 && (
          <fieldset disabled={isSubmitting} className={cardClass}>
            <legend className="px-2 font-semibold">기존 문제 확인</legend>
            <p className="text-sm text-zinc-600">같은 문제라면 선택해주세요. 기존 코드와 메모는 보존하고 새 풀이만 추가합니다. 기타 플랫폼은 서로 다른 출처일 수 있으니 제목과 URL을 확인해주세요.</p>
            {candidates.map(candidate => (
              <label key={candidate.id} className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3">
                <input type="radio" name="problemChoice" value={candidate.id}
                  checked={choice === String(candidate.id)}
                  onChange={() => setChoice(String(candidate.id))} />
                <span className="min-w-0 break-words text-sm">
                  {candidate.title} · {candidate.platform} · 기록 #{candidate.id}
                  <span className="block text-zinc-500">{candidate.url || 'URL 없음'}</span>
                </span>
              </label>
            ))}
            {canCreateNew && <label className="flex items-center gap-3 text-sm">
              <input type="radio" name="problemChoice" value="new" checked={choice === 'new'}
                onChange={() => setChoice('new')} />
              다른 문제예요. 새 문제로 저장할게요.
            </label>}
            <p className="text-xs text-zinc-500">동일한 URL이 있는 경우에는 기존 문제에 연결됩니다.</p>
          </fieldset>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : '문제 및 풀이 저장'}
          </button>
        </div>
      </form>

      {message && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {message}
        </p>
      )}
    </main>
  );
}