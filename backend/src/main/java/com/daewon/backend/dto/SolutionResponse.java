package com.daewon.backend.dto;

import com.daewon.backend.entity.Solution;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SolutionResponse {

    private Long id;

    private Long problemId;
    private String platform;
    private String problemNumber;
    private String problemTitle;

    private String language;
    private String code;
    private String memo;
    private int attemptCount;
    private boolean correct;
    private LocalDate solvedDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SolutionResponse(Solution solution) {
        this.id = solution.getId();

        this.problemId = solution.getProblem().getId();
        this.platform = solution.getProblem().getPlatform();
        this.problemNumber = solution.getProblem().getProblemNumber();
        this.problemTitle = solution.getProblem().getTitle();

        this.language = solution.getLanguage();
        this.code = solution.getCode();
        this.memo = solution.getMemo();
        this.attemptCount = solution.getAttemptCount();
        this.correct = solution.isCorrect();
        this.solvedDate = solution.getSolvedDate();

        this.createdAt = solution.getCreatedAt();
        this.updatedAt = solution.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getProblemId() {
        return problemId;
    }

    public String getPlatform() {
        return platform;
    }

    public String getProblemNumber() {
        return problemNumber;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public String getLanguage() {
        return language;
    }

    public String getCode() {
        return code;
    }

    public String getMemo() {
        return memo;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public boolean isCorrect() {
        return correct;
    }

    public LocalDate getSolvedDate() {
        return solvedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}