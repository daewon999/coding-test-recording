package com.daewon.backend.dto;

import java.util.List;

public record SolutionPageResponse(
        List<SolutionResponse> content,
        int number,
        int size,
        long totalElements,
        int totalPages) {
}
