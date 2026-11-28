import type { Solution, SolutionCreateRequest, SolutionUpdateRequest, } from '../types/solution';

export interface SolutionPage {
  content: Solution[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getSolutionPage(page: number, query: string, correct?: boolean): Promise<SolutionPage> {
  const params = new URLSearchParams({ page: String(page), size: '5', query: query.trim() });
  if (correct !== undefined) params.set('correct', String(correct));
  const response = await fetch(`/api/solutions/page?${params}`);
  if (!response.ok) throw new Error('풀이 목록을 불러오는 데 실패했습니다.');
  return response.json();
}

// 삭제 성공 응답(204)에는 본문이 없으므로 JSON을 읽지 않습니다.
export async function deleteSolution(solutionId: number): Promise<void> {
  const response = await fetch(`/api/solutions/${solutionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('삭제할 풀이를 찾을 수 없습니다.');
    }
    throw new Error('풀이 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 특정 문제에 연결된 풀이를 모두 삭제합니다.
export async function deleteSolutionsByProblemId(
  problemId: number,
): Promise<void> {
  const response = await fetch(
    `/api/solutions/problem/${problemId}`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('해당 문제를 찾을 수 없습니다.');
    }

    throw new Error(
      '전체 풀이 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
    );
  }
}

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
      throw new Error('입력값을 확인해주세요. 언어·코드·날짜는 필수입니다.');
    }
    if (response.status === 404) {
      throw new Error('수정할 풀이를 찾을 수 없습니다.');
    }
    throw new Error('풀이 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  return response.json();
}

// 정답별 풀이 조회
export async function getSolutionsByCorrect(
  correct: boolean,
): Promise<Solution[]> {
  const response = await fetch(
    `/api/solutions/correct?correct=${correct}`,
  );

  if (!response.ok) {
    throw new Error('풀이 목록을 불러오는 데 실패했습니다.');
  }

  const data: Solution[] = await response.json();

  return data;
}
export interface RecordSolutionRequest {
  problem: import('../types/problem').ProblemCreateRequest;
  solution: SolutionUpdateRequest;
  selectedProblemId: number | null;
  createNew: boolean;
}

export interface RecordSolutionResult {
  solution: Solution | null;
  reusedProblem: boolean;
  candidates: import('../types/problem').Problem[];
  canCreateNew: boolean;
}

export async function recordSolution(request: RecordSolutionRequest): Promise<RecordSolutionResult> {
  const response = await fetch('/api/solutions/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(response.status === 400
      ? '입력값과 문제 선택을 확인해주세요. 제목·언어·코드·날짜는 필수이고, URL은 http(s) 주소여야 합니다. 문제 정보는 각 255자 이내로 입력해주세요.'
      : '풀이 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
  return response.json();
}

// 같은 문제에 연결된 모든 풀이 조회
export async function getSolutionsByProblemId(
  problemId: number,
): Promise<Solution[]> {
  const response = await fetch(
    `/api/solutions/problem/${problemId}`,
  );

  if (!response.ok) {
    throw new Error('문제의 풀이 이력을 불러오는 데 실패했습니다.');
  }

  return response.json();
}
