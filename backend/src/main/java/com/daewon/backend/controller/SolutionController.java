package com.daewon.backend.controller;

import com.daewon.backend.entity.Solution;
import com.daewon.backend.service.SolutionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solutions")
public class SolutionController {

    private final SolutionService solutionService;

    public SolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    // 전체 풀이 조회
    // GET /api/solutions
    @GetMapping
    public List<Solution> getAllSolutions() {
        return solutionService.getAllSolutions();
    }

    // 특정 문제의 풀이 목록 조회
    // GET /api/solutions/problem/1
    @GetMapping("/problem/{problemId}")
    public List<Solution> getSolutionsByProblemId(@PathVariable Long problemId) {
        return solutionService.getSolutionsByProblemId(problemId);
    }

    // 특정 문제의 풀이 목록 최신순 조회
    // GET /api/solutions/problem/1/recent
    @GetMapping("/problem/{problemId}/recent")
    public List<Solution> getSolutionsByProblemIdOrderByIdDesc(@PathVariable Long problemId) {
        return solutionService.getSolutionsByProblemIdOrderByIdDesc(problemId);
    }

    // 특정 날짜의 풀이 조회
    // GET /api/solutions/date?solvedDate=2026-04-28
    @GetMapping("/date")
    public List<Solution> getSolutionsBySolvedDate(@RequestParam LocalDate solvedDate) {
        return solutionService.getSolutionsBySolvedDate(solvedDate);
    }

    // 특정 날짜의 풀이 최신순 조회
    // GET /api/solutions/date/recent?solvedDate=2026-04-28
    @GetMapping("/date/recent")
    public List<Solution> getSolutionsBySolvedDateOrderByIdDesc(@RequestParam LocalDate solvedDate) {
        return solutionService.getSolutionsBySolvedDateOrderByIdDesc(solvedDate);
    }

    // 정답 여부로 풀이 조회
    // GET /api/solutions/correct?correct=true
    @GetMapping("/correct")
    public List<Solution> getSolutionsByCorrect(@RequestParam boolean correct) {
        return solutionService.getSolutionsByCorrect(correct);
    }
}