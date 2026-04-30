package com.daewon.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * 여러 개의 Solution은 하나의 Problem에 연결될 수 있습니다.
     *
     * 예:
     * Problem: 백준 2295 - 세 수의 합
     * Solution 1: 2026-04-01 풀이
     * Solution 2: 2026-04-21 풀이
     * Solution 3: 2026-05-10 풀이
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    // 사용 언어: Python, Java, C++ 등
    private String language;

    // 코드는 길어질 수 있으므로 TEXT 타입으로 저장
    @Column(columnDefinition = "TEXT")
    private String code;

    // 메모도 길어질 수 있으므로 TEXT 타입으로 저장
    @Column(columnDefinition = "TEXT")
    private String memo;

    // 시도 횟수
    private int attemptCount;

    // 정답 여부
    private boolean correct;

    // 실제로 문제를 푼 날짜
    private LocalDate solvedDate;

    // 이 풀이 기록이 처음 저장된 시간
    private LocalDateTime createdAt;

    // 이 풀이 기록이 마지막으로 수정된 시간
    private LocalDateTime updatedAt;

    // JPA가 Entity를 만들 때 필요한 기본 생성자입니다.
    public Solution() {
    }

    // Service에서 Solution 객체를 만들 때 사용할 생성자입니다.
    public Solution(
            Problem problem,
            String language,
            String code,
            String memo,
            int attemptCount,
            boolean correct,
            LocalDate solvedDate
    ) {
        this.problem = problem;
        this.language = language;
        this.code = code;
        this.memo = memo;
        this.attemptCount = attemptCount;
        this.correct = correct;
        this.solvedDate = solvedDate;
    }

    /*
     * Entity가 처음 저장되기 직전에 자동으로 실행됩니다.
     * createdAt, updatedAt을 직접 넣지 않아도 현재 시간으로 저장하기 위해 사용합니다.
     */
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /*
     * Entity가 수정되기 직전에 자동으로 실행됩니다.
     * 수정 시간이 자동으로 갱신됩니다.
     */
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Problem getProblem() {
        return problem;
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

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public void setSolvedDate(LocalDate solvedDate) {
        this.solvedDate = solvedDate;
    }
}