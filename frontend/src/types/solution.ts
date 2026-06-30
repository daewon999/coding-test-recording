export interface SolutionCreateRequest {
  problemId: number;
  language: string;
  code: string;
  memo: string;
  attemptCount: number;
  correct: boolean;
  solvedDate: string;
}

/**
 * Spring Boot의 SolutionResponse와 같은 데이터 구조입니다.
 *
 * Java의 Long, int → TypeScript의 number
 * Java의 LocalDate, LocalDateTime → JSON에서는 string
 */
export interface Solution {
  id: number;
  problemId: number;

  platform: string;
  problemNumber: string;
  problemTitle: string;

  language: string;
  code: string;
  memo: string | null;

  attemptCount: number;
  correct: boolean;

  solvedDate: string;
  createdAt: string;
  updatedAt: string;
}