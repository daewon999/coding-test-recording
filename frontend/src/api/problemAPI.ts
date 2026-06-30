import type {
  Problem,
  ProblemCreateRequest,
} from '../types/problem';

/**
 * 새로운 문제를 백엔드에 저장
 *
 * 요청:
 * POST /api/problems
 *
 * 응답:
 * 저장된 Problem 객체
 */
export async function createProblem(
  request: ProblemCreateRequest,
): Promise<Problem> {
  const response = await fetch('/api/problems', {
    method: 'POST',

    // 백엔드에 JSON 데이터를 보낸다고 알려줌
    headers: {
      'Content-Type': 'application/json',
    },

    // JavaScript 객체를 JSON 문자열로 변환
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('문제 저장에 실패했습니다.');
  }

  // 백엔드에서 반환한 JSON을 Problem 타입으로 받음
  const data: Problem = await response.json();

  return data;
}