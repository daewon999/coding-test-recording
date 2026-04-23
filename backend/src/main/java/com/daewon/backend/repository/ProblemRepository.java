package com.daewon.backend.repository;

import com.daewon.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/*
 * ProblemRepository
 * - Problem 엔티티를 DB와 연결해주는 인터페이스
 * - JpaRepository를 상속하면 기본적인 CRUD 기능을 자동으로 사용 가능
 *
 * CRUD란?
 * - Create : 저장
 * - Read   : 조회
 * - Update : 수정
 * - Delete : 삭제
 */
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    /*
     * problemNumber로 문제 1개를 찾습니다.
     * 예: 백준 2295 같은 문제 번호로 조회
     *
     * Optional<Problem>:
     * - 값이 있을 수도 있고 없을 수도 있다는 뜻입니다.
     * - Python으로 치면 "결과가 None일 수도 있음"을 좀 더 안전하게 표현한 느낌입니다.
     */
    Optional<Problem> findByProblemNumber(String problemNumber);

    /*
     * platform과 problemNumber를 함께 사용해서 문제를 찾습니다.
     * 예: BOJ + 2295
     *
     * 같은 번호라도 플랫폼이 다르면 다른 문제일 수 있어서
     * 나중에 이 방식이 더 안전할 수 있습니다.
     */
    Optional<Problem> findByPlatformAndProblemNumber(String platform, String problemNumber);

    /*
     * 제목에 특정 문자열이 포함된 문제들을 찾습니다.
     * 예: "세 수의 합" 이 포함된 문제 검색
     *
     * Containing = SQL의 LIKE %keyword% 느낌이라고 생각하시면 됩니다.
     */
    List<Problem> findByTitleContaining(String keyword);

    /*
     * 특정 플랫폼의 문제들만 조회합니다.
     * 예: BOJ, Programmers
     */
    List<Problem> findByPlatform(String platform);
}