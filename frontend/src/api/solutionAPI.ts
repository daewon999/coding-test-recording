import type { Solution, SolutionCreateRequest, SolutionUpdateRequest, } from '../types/solution';

export async function getAllSolutions(): Promise<Solution[]> {
  const response = await fetch('/api/solutions');

  if (!response.ok) {
    throw new Error('풀이 목록을 불러오는 데 실패했습니다.');
  }

  const data: Solution[] = await response.json();

  return data;
}

// 특정 풀이 상세 조회
export async function getSolutionById(solutionId: number): Promise<Solution> {
  const response = await fetch(`/api/solutions/${solutionId}`);

  if (!response.ok) {
    throw new Error('풀이 상세 정보를 불러오는 데 실패했습니다.');
  }

  const data: Solution = await response.json();

  return data;
}

// 문제풀이 저장
export async function createSolution(
  request: SolutionCreateRequest,
): Promise<Solution> {
  const response = await fetch('/api/solutions', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('풀이 저장에 실패했습니다.');
  }

  const data: Solution = await response.json();

  return data;
}
// 기존 풀이의 내용만 수정합니다. 연결된 문제는 유지합니다.
export async function updateSolution(
  solutionId: number,
  request: SolutionUpdateRequest,
): Promise<Solution> {
  const response = await fetch(`/api/solutions/${solutionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('입력값을 확인해주세요. 언어·코드·날짜는 필수이며 시도 횟수는 1 이상이어야 합니다.');
    }
    if (response.status === 404) {
      throw new Error('수정할 풀이를 찾을 수 없습니다.');
    }
    throw new Error('풀이 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  return response.json();
}
