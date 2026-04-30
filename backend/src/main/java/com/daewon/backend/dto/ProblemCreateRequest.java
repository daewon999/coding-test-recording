package com.daewon.backend.dto;

public class ProblemCreateRequest {

    private String platform;
    private String problemNumber;
    private String title;
    private String url;
    private String tags;

    public String getPlatform() {
        return platform;
    }

    public String getProblemNumber() {
        return problemNumber;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getTags() {
        return tags;
    }
}