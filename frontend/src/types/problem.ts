/**
 * 백엔드로 문제 저장을 요청할 때 보내는 데이터 구조
 *
 * Spring Boot의 ProblemCreateRequest와 같은 형태
 */
export interface ProblemCreateRequest {
  platform: string;
  problemNumber: string;
  title: string;
  url: string;
  tags: string;
}

/**
 * 백엔드에서 문제를 저장한 뒤 반환하는 데이터 구조
 *
 * 저장 후에는 DB에서 자동 생성된 id가 포함
 */
export interface Problem {
  id: number;
  platform: string;
  problemNumber: string;
  title: string;
  url: string;
  tags: string;
}