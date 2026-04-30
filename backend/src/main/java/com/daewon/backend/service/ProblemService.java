package com.daewon.backend.service;

import com.daewon.backend.dto.ProblemCreateRequest;
import com.daewon.backend.entity.Problem;
import com.daewon.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public Problem createProblem(ProblemCreateRequest request) {
        Problem problem = new Problem(
                request.getPlatform(),
                request.getProblemNumber(),
                request.getTitle(),
                request.getUrl(),
                request.getTags()
        );

        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }
}