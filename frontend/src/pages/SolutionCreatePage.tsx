import { type FormEvent, useState } from 'react';

import { createProblem } from '../api/problemAPI';
import { createSolution } from '../api/solutionAPI';

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환합니다.
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
  // 문제 정보
  const [platform, setPlatform] = useState('BOJ');
  const [problemNumber, setProblemNumber] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  // 풀이 정보
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState('');
  const [memo, setMemo] = useState('');
  const [attemptCount, setAttemptCount] = useState(1);
  const [correct, setCorrect] = useState(true);
  const [solvedDate, setSolvedDate] = useState(getTodayString());

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

    setIsSubmitting(true);
    setMessage('');

    try {
      /*
       * 1단계: 문제를 먼저 저장합니다.
       *
       * 백엔드가 문제를 저장하면
       * 자동 생성된 problem id가 포함된 객체를 반환합니다.
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
        language,
        code,
        memo,
        attemptCount,
        correct,
        solvedDate,
      });

      setMessage(
        `저장에 성공했습니다. 풀이 ID: ${savedSolution.id}`,
      );

      console.log('저장된 문제:', savedProblem);
      console.log('저장된 풀이:', savedSolution);
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

      <form onSubmit={handleSubmit}>
        <fieldset
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

        <fieldset
          style={{
            marginBottom: '24px',
            padding: '20px',
          }}
        >
          <legend>풀이 정보</legend>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="language">사용 언어</label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            >
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="C++">C++</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="code">풀이 코드</label>

            <textarea
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              rows={16}
              placeholder="풀이 코드를 입력해 주세요."
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                marginTop: '6px',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="memo">풀이 메모</label>

            <textarea
              id="memo"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              rows={5}
              placeholder="어려웠던 점이나 실수한 부분을 입력해 주세요."
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="attemptCount">시도 횟수</label>

            <input
              id="attemptCount"
              type="number"
              min={1}
              value={attemptCount}
              onChange={(event) =>
                setAttemptCount(Number(event.target.value))
              }
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="correct">정답 여부</label>

            <select
              id="correct"
              value={String(correct)}
              onChange={(event) =>
                setCorrect(event.target.value === 'true')
              }
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            >
              <option value="true">정답</option>
              <option value="false">오답</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="solvedDate">풀이 날짜</label>

            <input
              id="solvedDate"
              type="date"
              value={solvedDate}
              onChange={(event) =>
                setSolvedDate(event.target.value)
              }
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '6px',
              }}
            />
          </div>
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
        <p
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