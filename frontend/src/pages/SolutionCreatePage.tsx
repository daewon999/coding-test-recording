import { validateSolution } from '../components/solution/validateSolution';
import SolutionFields from '../components/solution/SolutionFields';
import type { SolutionUpdateRequest } from '../types/solution';
import { type FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createProblem } from '../api/problemAPI';
import { createSolution } from '../api/solutionAPI';

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 * input type="date"의 value 형식에 맞추기 위한 함수입니다.
 */
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
    language: 'Python', code: '', memo: '', attemptCount: 1,
    correct: true, solvedDate: getTodayString(),
  }));
  const submitting = useRef(false);

  function change<K extends keyof SolutionUpdateRequest>(key: K, value: SolutionUpdateRequest[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
  }

  // 저장 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * 저장 버튼을 눌렀을 때 실행되는 함수입니다.
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    // form 제출 시 브라우저가 새로고침되는 것을 막습니다.
    event.preventDefault();

    if (submitting.current) return;
    const validationError = validateSolution(form);
    if (validationError) {
      setMessage(validationError);
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setMessage('');

    try {
      /*
       * 1단계: 문제를 먼저 저장합니다.
       *
       * 백엔드가 문제를 저장하면
       * 자동 생성된 problem id가 포함된 객체를 반환
       */
      const savedProblem = await createProblem({
        platform,
        problemNumber,
        title,
        url,
        tags,
      });

      /*
       * 2단계: 앞에서 반환받은 문제 id를 사용해
       * 풀이를 저장합니다.
       */
      const savedSolution = await createSolution({
        problemId: savedProblem.id,
        ...form,
      });

      navigate(`/solutions/${savedSolution.id}`, { replace: true });
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

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <h1>문제 및 풀이 저장</h1>

      <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="space-y-5"
          style={{
            marginBottom: '24px',
            padding: '20px',
          }}
        >
          <legend>문제 정보</legend>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="platform">플랫폼</label>

            <select
              id="platform"
              value={platform}
              onChange={(event) =>
                setPlatform(event.target.value)
              }
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            >
              <option value="BOJ">백준</option>
              <option value="PROGRAMMERS">프로그래머스</option>
              <option value="LEETCODE">LeetCode</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="problemNumber">문제 번호</label>

            <input
              id="problemNumber"
              type="text"
              value={problemNumber}
              onChange={(event) =>
                setProblemNumber(event.target.value)
              }
              required
              placeholder="예: 1000"
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="title">문제 제목</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="예: A+B"
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="url">문제 URL</label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.acmicpc.net/problem/1000"
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="tags">태그</label>

            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="예: 수학, 구현"
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>
        </fieldset>

        <fieldset disabled={isSubmitting} className="space-y-5"
          style={{
            marginBottom: '24px',
            padding: '20px',
          }}
        >
          <legend>풀이 정보</legend>

          {/* 공통폼으로 입력칸 대체 */}
          <SolutionFields form={form} onChange={change} />
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '12px 24px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? '저장 중...' : '문제 및 풀이 저장'}
        </button>
      </form>

      {message && (
        <p role="alert"
          style={{
            marginTop: '20px',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </main>
  );
}