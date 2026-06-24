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

    // 받은 DTO의 값을 꺼내서 entity 만들기
    public Problem createProblem(ProblemCreateRequest request) {
        Problem problem = new Problem(
                request.getPlatform(),
                request.getProblemNumber(),
                request.getTitle(),
                request.getUrl(),
                request.getTags()
        );
        // 만들 entity 객체를 repository에 save 명령
        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }
}