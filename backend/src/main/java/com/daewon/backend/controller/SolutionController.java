package com.daewon.backend.controller;

import com.daewon.backend.dto.SolutionCreateRequest;
import com.daewon.backend.dto.RecordSolutionRequest;
import com.daewon.backend.dto.RecordSolutionResult;
import com.daewon.backend.service.RecordSolutionService;
import com.daewon.backend.dto.SolutionResponse;
import com.daewon.backend.service.SolutionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.daewon.backend.dto.SolutionUpdateRequest;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solutions")
public class SolutionController {

    private final SolutionService solutionService;
    private final RecordSolutionService recordSolutionService;

    public SolutionController(SolutionService solutionService, RecordSolutionService recordSolutionService) {
        this.solutionService = solutionService;
        this.recordSolutionService = recordSolutionService;
    }

    @PostMapping("/record")
    public RecordSolutionResult recordSolution(
            @RequestBody RecordSolutionRequest request) {
        return recordSolutionService.record(request);
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
    
    // 풀이 하나 삭제
    @DeleteMapping("/{solutionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSolution(@PathVariable("solutionId") Long solutionId) {
        solutionService.deleteSolution(solutionId);
    }

    // 특정 문제의 풀이 전부 삭제
    @DeleteMapping("/problem/{problemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSolutionsByProblemId(
            @PathVariable("problemId") Long problemId) {
        solutionService.deleteSolutionsByProblemId(problemId);
    }

    @PutMapping("/{solutionId}")
    public SolutionResponse updateSolution(
            @PathVariable("solutionId") Long solutionId,
            @RequestBody SolutionUpdateRequest request) {
        return solutionService.updateSolution(solutionId, request);
    }
}
