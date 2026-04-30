package com.daewon.backend.repository;

import com.daewon.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ProblemRepository extends JpaRepository<Problem, Long> {

    /*
     * problemNumber로 문제 1개 찾음
     * Optional<Problem>:
     * - 값이 있을 수도 있고 없을 수도 있다는 뜻
     */
    Optional<Problem> findByProblemNumber(String problemNumber);

    /*
     * platform과 problemNumber를 함께 사용해서 문제를 찾습니다.
     * 같은 번호라도 플랫폼이 다르면 다른 문제일 수 있어서
     */
    Optional<Problem> findByPlatformAndProblemNumber(String platform, String problemNumber);

    /*
     * 제목에 특정 문자열이 포함된 문제들을 찾습니다.
     * 예: "세 수의 합" 이 포함된 문제 검색
     */
    List<Problem> findByTitleContaining(String keyword);

    /*
     * 특정 플랫폼의 문제들만 조회합니다.
     * 예: BOJ, Programmers
     */
    List<Problem> findByPlatform(String platform);
}