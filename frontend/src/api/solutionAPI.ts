import type { Solution } from '../types/solution';

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