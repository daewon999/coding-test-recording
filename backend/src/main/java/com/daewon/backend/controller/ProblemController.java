package com.daewon.backend.controller;

import com.daewon.backend.dto.ProblemCreateRequest;
import com.daewon.backend.entity.Problem;
import com.daewon.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // 전체 문제 조회
    // GET /api/problems
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    // RequestBody가 붙어서 자동으로 json을 request 객체로 바꿔줌 
    @PostMapping
    public Problem createProblem(@RequestBody ProblemCreateRequest request) {
        return problemService.createProblem(request);
    }
}