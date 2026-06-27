package com.daewon.backend.service;

import com.daewon.backend.dto.SolutionCreateRequest;
import com.daewon.backend.dto.SolutionResponse;
import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import com.daewon.backend.repository.ProblemRepository;
import com.daewon.backend.repository.SolutionRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final ProblemRepository problemRepository;

    public SolutionService(SolutionRepository solutionRepository, ProblemRepository problemRepository) {
        this.solutionRepository = solutionRepository;
        this.problemRepository = problemRepository;
    }

    public SolutionResponse createSolution(SolutionCreateRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다."));

        Solution solution = new Solution(
                problem,
                request.getLanguage(),
                request.getCode(),
                request.getMemo(),
                request.getAttemptCount(),
                request.isCorrect(),
                request.getSolvedDate()
        );

        Solution savedSolution = solutionRepository.save(solution);

        return new SolutionResponse(savedSolution);
    }

    // 전체 풀이 조회
    public List<SolutionResponse> getAllSolutions() {
        return solutionRepository.findAll()
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 문제의 풀이 목록 조회
    public List<SolutionResponse> getSolutionsByProblemId(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다."));

        return solutionRepository.findByProblem(problem)
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 문제의 풀이를 최근 순으로 조회
    public List<SolutionResponse> getSolutionsByProblemIdOrderByIdDesc(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다."));

        return solutionRepository.findByProblemOrderByIdDesc(problem)
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 날짜의 풀이 조회
    public List<SolutionResponse> getSolutionsBySolvedDate(LocalDate solvedDate) {
        return solutionRepository.findBySolvedDate(solvedDate)
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }

    // 특정 날짜의 풀이를 최근 순으로 조회
    public List<SolutionResponse> getSolutionsBySolvedDateOrderByIdDesc(LocalDate solvedDate) {
        return solutionRepository.findBySolvedDateOrderByIdDesc(solvedDate)
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }

    // 정답 여부로 풀이 조회
    public List<SolutionResponse> getSolutionsByCorrect(boolean correct) {
        return solutionRepository.findByCorrect(correct)
                .stream()
                .map(SolutionResponse::new)
                .collect(Collectors.toList());
    }
    // 특정 풀이 상세 조회
    public SolutionResponse getSolutionById(Long solutionId) {
        Solution solution = solutionRepository.findById(solutionId)
            .orElseThrow(() -> new IllegalArgumentException("해당 풀이를 찾을 수 없습니다."));
        return new SolutionResponse(solution);
    }
}