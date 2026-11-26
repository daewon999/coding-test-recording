package com.daewon.backend.service;

import java.net.URI;
import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

final class ProblemUrl {
    private ProblemUrl() {}

    static String normalize(String value) {
        if (value == null || value.isBlank()) return "";
        URI uri = URI.create(value.trim());
        String scheme = uri.getScheme();
        if (scheme == null || !(scheme.equalsIgnoreCase("https") || scheme.equalsIgnoreCase("http"))
                || uri.getHost() == null || uri.getUserInfo() != null) {
            throw new IllegalArgumentException("HTTP 또는 HTTPS 문제 URL을 입력해주세요.");
        }
        String query = uri.getRawQuery() == null ? "" : Arrays.stream(uri.getRawQuery().split("&"))
                .filter(part -> {
                    String key = part.split("=", 2)[0].toLowerCase(Locale.ROOT);
                    return !key.startsWith("utm_") && !key.equals("fbclid") && !key.equals("gclid");
                }).collect(Collectors.joining("&"));
        int port = uri.getPort();
        boolean defaultPort = port == -1 || (scheme.equalsIgnoreCase("https") && port == 443)
                || (scheme.equalsIgnoreCase("http") && port == 80);
        // 경로, 식별용 쿼리와 hash 기반 문제 주소는 그대로 유지한다.
        return scheme.toLowerCase(Locale.ROOT) + "://" + uri.getHost().toLowerCase(Locale.ROOT)
                + (defaultPort ? "" : ":" + port) + (uri.getRawPath().isEmpty() ? "/" : uri.getRawPath())
                + (query.isEmpty() ? "" : "?" + query)
                + (uri.getRawFragment() == null ? "" : "#" + uri.getRawFragment());
    }
}
