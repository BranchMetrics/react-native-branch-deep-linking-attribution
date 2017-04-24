package io.branch.nativetests;

import org.junit.Test;

import io.branch.rnbranch.AgingItem;

import static org.junit.Assert.*;

/**
 * Created by jdee on 4/24/17.
 */

public class AgingItemUnitTest {
    @Test
    public void testInitialization() {
        String value = "abc";

        long before = System.currentTimeMillis();
        AgingItem<String> item = new AgingItem<>(value);
        long after = System.currentTimeMillis();

        // Access time initialized to initialization time.
        assertTrue(item.getAccessTime() >= before);
        assertTrue(item.getAccessTime() <= after);

        // get() returns the constructor argument.
        assertEquals(value, item.get());
    }

    @Test
    public void testAccessTime() {
        String value = "abc";

        long beforeInitialization = System.currentTimeMillis();
        AgingItem<String> item = new AgingItem<>(value);
        long afterInitialization = System.currentTimeMillis();

        item.get();
        long afterAccess = System.currentTimeMillis();

        // Access time updated after calling get()
        assertTrue(item.getAccessTime() >= afterInitialization);
        assertTrue(item.getAccessTime() <= afterAccess);
    }
}
