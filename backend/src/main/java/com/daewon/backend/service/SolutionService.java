package com.daewon.backend.service;

import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import com.daewon.backend.repository.ProblemRepository;
import com.daewon.backend.repository.SolutionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final ProblemRepository problemRepository;

    // 생성자 주입
    public SolutionService(SolutionRepository solutionRepository, ProblemRepository problemRepository) {
        this.solutionRepository = solutionRepository;
        this.problemRepository = problemRepository;
    }

    // 전체 풀이 조회
    public List<Solution> getAllSolutions() {
        return solutionRepository.findAll();
    }

    // 특정 문제의 풀이 목록 조회
    public List<Solution> getSolutionsByProblemId(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다."));

        return solutionRepository.findByProblem(problem);
    }

    // 특정 문제의 풀이를 최근 순으로 조회
    public List<Solution> getSolutionsByProblemIdOrderByIdDesc(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다."));

        return solutionRepository.findByProblemOrderByIdDesc(problem);
    }

    // 특정 날짜의 풀이 조회
    public List<Solution> getSolutionsBySolvedDate(LocalDate solvedDate) {
        return solutionRepository.findBySolvedDate(solvedDate);
    }

    // 특정 날짜의 풀이를 최근 순으로 조회
    public List<Solution> getSolutionsBySolvedDateOrderByIdDesc(LocalDate solvedDate) {
        return solutionRepository.findBySolvedDateOrderByIdDesc(solvedDate);
    }

    // 정답 여부로 풀이 조회
    public List<Solution> getSolutionsByCorrect(boolean correct) {
        return solutionRepository.findByCorrect(correct);
    }
}