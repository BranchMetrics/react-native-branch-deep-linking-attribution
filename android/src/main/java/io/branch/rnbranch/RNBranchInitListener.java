package io.branch.rnbranch;

import android.net.Uri;
import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.BranchError;
import io.branch.referral.util.LinkProperties;

/**
 * Created by jdee on 4/10/17.
 */

public interface RNBranchInitListener {
    /**
     * Called when RNBranch.initSession succeeds or fails and whenever a link is opened.
     * @param uri the original Uri passed to the app (null for initialization responses)
     * @param branchUniversalObject a BranchUniversalObject representing the link or null
     * @param linkProperties an instance of LinkProperties representing the link configuration or null
     * @param error a BranchError indicating an error (null if no error)
     */
    void onInitFinished(Uri uri, BranchUniversalObject branchUniversalObject, LinkProperties linkProperties, BranchError error);
}
