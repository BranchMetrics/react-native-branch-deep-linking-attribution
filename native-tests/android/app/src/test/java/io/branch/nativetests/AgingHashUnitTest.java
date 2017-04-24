package io.branch.nativetests;

import org.junit.Test;

import io.branch.rnbranch.AgingHash;

import static org.junit.Assert.*;

/**
 * Created by jdee on 4/18/17.
 */

public class AgingHashUnitTest {
    @Test
    public void testTtlInitialization() {
        AgingHash<String, String> hash = new AgingHash<>(3600000);

        // getTtlMillis() returns the constructor argument.
        assertEquals(3600000, hash.getTtlMillis());
    }

    @Test
    public void testGetReturnsNullWhenNotFound() {
        AgingHash<String, String> hash = new AgingHash<>(3600000);

        // get() returns null when the key is not present.
        assertNull(hash.get("key"));
    }

    @Test
    public void testPutAndGet() {
        AgingHash<String, String> hash = new AgingHash<>(3600000);
        hash.put("key", "value");

        // get() returns a value if the key is present and has not expired.
        assertEquals(hash.get("key"), "value");
    }

    @Test
    public void testRemove() {
        AgingHash<String, String> hash = new AgingHash<>(3600000);
        hash.put("key", "value");
        hash.remove("key");

        // get() returns null after remove() is called with the same key.
        assertNull(hash.get("key"));
    }

    @Test
    public void testExpiration() {
        AgingHash<String, String> hash = new AgingHash<>(1);
        hash.put("key", "value");

        try {
            Thread.sleep(10);
        } catch(Exception e) {
            fail("Failed to sleep for 10 ms: " + e.getMessage());
        }

        // Deletes expired keys on insertion
        hash.put("newKey", "newValue");
        assertNull(hash.get("key"));
    }
}
