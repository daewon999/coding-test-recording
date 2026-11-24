import type { SolutionUpdateRequest } from '../../types/solution';

export function validateSolution(form: SolutionUpdateRequest): string {
  if (
    !form.language.trim()
    || form.language.length > 255
    || !form.code.trim()
    || !form.solvedDate
  ) {
    return '언어·코드·날짜를 확인해주세요.';
  }

  return '';
}
