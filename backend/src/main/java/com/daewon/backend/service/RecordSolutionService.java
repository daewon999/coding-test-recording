package com.daewon.backend.service;

import com.daewon.backend.dto.*;
import com.daewon.backend.entity.Problem;
import com.daewon.backend.entity.Solution;
import com.daewon.backend.repository.ProblemRepository;
import com.daewon.backend.repository.SolutionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class RecordSolutionService {
    private final ProblemRepository problems;
    private final SolutionRepository solutions;

    public RecordSolutionService(ProblemRepository problems, SolutionRepository solutions) {
        this.problems = problems;
        this.solutions = solutions;
    }

    @Transactional
    public RecordSolutionResult record(RecordSolutionRequest request) {
        var p = request.problem();
        var s = request.solution();
        if (p == null || s == null)
            throw badRequest("문제와 풀이 정보를 입력해주세요.");
        required(p.getPlatform(), "플랫폼");
        required(p.getTitle(), "문제 제목");
        optional(p.getProblemNumber());
        optional(p.getUrl());
        optional(p.getTags());
        required(s.getLanguage(), "언어");
        if (s.getCode() == null || s.getCode().isBlank()
                || s.getCorrect() == null || s.getSolvedDate() == null) {
            throw badRequest("코드·날짜·정답 여부를 입력해주세요.");
        }
        if (request.createNew() && request.selectedProblemId() != null)
            throw badRequest("저장 방법을 하나만 선택해주세요.");
        String url;
        try {
            url = ProblemUrl.normalize(p.getUrl());
        } catch (IllegalArgumentException ex) {
            throw badRequest("올바른 HTTP 또는 HTTPS 문제 URL을 입력해주세요.");
        }

        // 기존 데이터의 URL도 같은 규칙으로 비교한다. 과거 중복 행은 임의로 병합하지 않는다.
        List<Problem> existing = problems.findAll();
        List<Problem> urlMatches = url.isEmpty() ? List.of()
                : existing.stream()
                        .filter(problem -> url.equals(existingUrl(problem.getUrl()))).toList();
        List<Problem> candidates = !urlMatches.isEmpty() ? urlMatches
                : existing.stream()
                        .filter(problem -> titleKey(p.getTitle()).equals(titleKey(problem.getTitle()))).toList();
        Problem problem;
        boolean reused = true;
        if (urlMatches.size() == 1) {
            if (request.selectedProblemId() != null && !urlMatches.get(0).getId().equals(request.selectedProblemId())) {
                throw badRequest("URL과 선택한 문제가 다릅니다. 문제 정보를 다시 확인해주세요.");
            }
            problem = urlMatches.get(0);
        } else if (request.selectedProblemId() != null) {
            problem = candidates.stream().filter(candidate -> candidate.getId().equals(request.selectedProblemId()))
                    .findFirst().orElseThrow(() -> badRequest("후보가 변경됐습니다. 문제 정보를 다시 확인해주세요."));
        } else if (!candidates.isEmpty() && (!request.createNew() || !urlMatches.isEmpty())) {
            return new RecordSolutionResult(null, false, candidates, urlMatches.isEmpty());
        } else {
            problem = problems.save(new Problem(p.getPlatform().trim(), trim(p.getProblemNumber()),
                    p.getTitle().trim(), url, trim(p.getTags())));
            reused = false;
        }
        Solution saved = solutions.saveAndFlush(new Solution(problem, s.getLanguage().trim(), s.getCode(),
                s.getMemo(), 1, s.getCorrect(), s.getSolvedDate()));
        return new RecordSolutionResult(new SolutionResponse(saved), reused, List.of(), false);
    }

    private static String existingUrl(String value) {
        try {
            return ProblemUrl.normalize(value);
        } catch (IllegalArgumentException ex) {
            return "";
        }
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static String titleKey(String value) {
        return trim(value).replaceAll("\\s+", " ");
    }

    private static void required(String value, String name) {
        if (value == null || value.isBlank())
            throw badRequest(name + "을 입력해주세요.");
        optional(value);
    }

    private static void optional(String value) {
        if (value != null && value.length() > 255)
            throw badRequest("문제 정보와 언어는 각 255자 이내로 입력해주세요.");
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
