package com.daewon.backend.controller;

import com.daewon.backend.dto.SolutionCreateRequest;
import com.daewon.backend.dto.SolutionResponse;
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

    @GetMapping
    public List<SolutionResponse> getAllSolutions() {
        return solutionService.getAllSolutions();
    }

    @GetMapping("/problem/{problemId}")
    public List<SolutionResponse> getSolutionsByProblemId(@PathVariable Long problemId) {
        return solutionService.getSolutionsByProblemId(problemId);
    }

    @GetMapping("/problem/{problemId}/recent")
    public List<SolutionResponse> getSolutionsByProblemIdOrderByIdDesc(@PathVariable Long problemId) {
        return solutionService.getSolutionsByProblemIdOrderByIdDesc(problemId);
    }

    @GetMapping("/date")
    public List<SolutionResponse> getSolutionsBySolvedDate(@RequestParam LocalDate solvedDate) {
        return solutionService.getSolutionsBySolvedDate(solvedDate);
    }

    @GetMapping("/date/recent")
    public List<SolutionResponse> getSolutionsBySolvedDateOrderByIdDesc(@RequestParam LocalDate solvedDate) {
        return solutionService.getSolutionsBySolvedDateOrderByIdDesc(solvedDate);
    }

    @GetMapping("/correct")
    public List<SolutionResponse> getSolutionsByCorrect(@RequestParam boolean correct) {
        return solutionService.getSolutionsByCorrect(correct);
    }

    @PostMapping
    public SolutionResponse createSolution(@RequestBody SolutionCreateRequest request) {
        return solutionService.createSolution(request);
    }

    // 특정 풀이 상세 조회
    @GetMapping("/{solutionId}")
    public SolutionResponse getSolutionById(@PathVariable Long solutionId) {
        return solutionService.getSolutionById(solutionId);
    }
}