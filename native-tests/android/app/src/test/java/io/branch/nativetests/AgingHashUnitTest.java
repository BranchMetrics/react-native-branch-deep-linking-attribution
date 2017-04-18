package io.branch.nativetests;

import org.junit.Test;

import io.branch.rnbranch.AgingHash;

import static org.junit.Assert.*;

/**
 * Created by jdee on 4/18/17.
 */

public class AgingHashUnitTest {
    @Test
    public void testTtl() {
        AgingHash<String, String> hash = new AgingHash<>(3600000);
        assertEquals(3600000, hash.getTtlMillis());
    }
}
