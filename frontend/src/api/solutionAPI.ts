import type { Solution } from '../types/solution';

export async function getAllSolutions(): Promise<Solution[]> {
  const response = await fetch('/api/solutions');

  if (!response.ok) {
    throw new Error('풀이 목록을 불러오는 데 실패했습니다.');
  }

  const data: Solution[] = await response.json();

  return data;
}