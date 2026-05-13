package dev.gustavo.freelancerdesk.util;

import java.util.UUID;

public class IdGenerator {
    private IdGenerator() {}

    public static String next(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
