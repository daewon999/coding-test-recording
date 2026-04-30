package com.daewon.backend.dto;

import java.time.LocalDate;

public class SolutionCreateRequest {

    private Long problemId;
    private String language;
    private String code;
    private String memo;
    private int attemptCount;
    private boolean correct;
    private LocalDate solvedDate;

    public Long getProblemId() {
        return problemId;
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
}