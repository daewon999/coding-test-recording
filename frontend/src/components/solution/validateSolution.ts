import type { SolutionUpdateRequest } from '../../types/solution';

export function validateSolution(form: SolutionUpdateRequest): string {
  if (!form.language.trim() || form.language.length > 255 || !form.code.trim() || !form.solvedDate
    || !Number.isInteger(form.attemptCount) || form.attemptCount < 1
    || form.attemptCount > 2147483647) {
    return '언어·코드·날짜와 시도 횟수(1 이상의 정수)를 확인해주세요.';
  }
  return '';
}
