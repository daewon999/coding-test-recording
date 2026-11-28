package com.daewon.backend.repository;

import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SolutionRepository extends JpaRepository<Solution, Long> {
    @EntityGraph(attributePaths = "problem")
    Page<Solution> findByProblem_TitleContainingIgnoreCase(String title, Pageable pageable);

    @EntityGraph(attributePaths = "problem")
    Page<Solution> findByProblem_TitleContainingIgnoreCaseAndCorrect(String title, boolean correct, Pageable pageable);

    // 특정 문제의 풀이 목록 조회
    List<Solution> findByProblem(Problem problem);
    
    // 특정 문제의 풀이를 최근 순으로 조회
    List<Solution> findByProblemOrderByIdDesc(Problem problem);

    // 특정 날짜의 풀이 조회
    List<Solution> findBySolvedDate(LocalDate solvedDate);

    // 특정 날짜의 풀이를 최근 순으로 조회
    List<Solution> findBySolvedDateOrderByIdDesc(LocalDate solvedDate);

    // 정답 여부로 조회
    List<Solution> findByCorrect(boolean correct);

    // 특정 문제에 연결된 풀이를 모두 삭제합니다.
    void deleteByProblem(Problem problem);
}
