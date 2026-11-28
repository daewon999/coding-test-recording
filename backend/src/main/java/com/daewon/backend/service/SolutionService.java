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
import com.daewon.backend.dto.SolutionUpdateRequest;
import org.springframework.transaction.annotation.Transactional;
import com.daewon.backend.dto.SolutionPageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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
                                1,
                                request.isCorrect(),
                                request.getSolvedDate());

                Solution savedSolution = solutionRepository.save(solution);

                return new SolutionResponse(savedSolution);
        }

        @Transactional(readOnly = true)
        public SolutionPageResponse getSolutionPage(int page, int size, String query, Boolean correct) {
                if (page < 0 || size < 1 || size > 100) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "페이지는 0 이상, 크기는 1~100이어야 합니다.");
                }
                // 고유 ID로 정렬하여 같은 날짜의 기록도 순서가 일정하도록 합니다.
                var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
                var title = query.strip();
                var result = correct == null
                                ? solutionRepository.findByProblem_TitleContainingIgnoreCase(title, pageable)
                                : solutionRepository.findByProblem_TitleContainingIgnoreCaseAndCorrect(title, correct, pageable);
                return new SolutionPageResponse(result.map(SolutionResponse::new).getContent(),
                                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
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

        // 풀이만 삭제하고 연결된 문제 정보는 유지합니다.
        @Transactional
        public void deleteSolution(Long solutionId) {
                Solution solution = solutionRepository.findById(solutionId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "해당 풀이를 찾을 수 없습니다."));

                solutionRepository.delete(solution);
        }

        // 문제 정보는 유지하고, 연결된 풀이만 모두 삭제합니다.
        @Transactional
        public void deleteSolutionsByProblemId(Long problemId) {
                Problem problem = problemRepository.findById(problemId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "해당 문제를 찾을 수 없습니다."));

                solutionRepository.deleteByProblem(problem);
        }

        @Transactional
        public SolutionResponse updateSolution(
                        Long solutionId,
                        SolutionUpdateRequest request) {
                // 메모는 선택 사항이고, 나머지는 필수입니다.
                if (request.getLanguage() == null
                                || request.getLanguage().isBlank()
                                || request.getLanguage().length() > 255) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "사용 언어는 1~255자로 입력해주세요.");
                }

                if (request.getCode() == null || request.getCode().isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "풀이 코드를 입력해주세요.");
                }

                if (request.getCorrect() == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "정답 여부를 입력해주세요.");
                }

                if (request.getSolvedDate() == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "풀이 날짜를 입력해주세요.");
                }

                Solution solution = solutionRepository.findById(solutionId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "해당 풀이를 찾을 수 없습니다."));

                solution.update(
                                request.getLanguage(),
                                request.getCode(),
                                request.getMemo(),
                                solution.getAttemptCount(),
                                request.getCorrect(),
                                request.getSolvedDate());

                // DB에 변경을 반영하고 @PreUpdate의 수정 시각을 갱신합니다.
                solutionRepository.flush();

                return new SolutionResponse(solution);
        }
}
