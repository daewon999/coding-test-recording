package com.daewon.backend.repository;

import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SolutionRepository extends JpaRepository<Solution, Long> {

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
}