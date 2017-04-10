package io.branch.rnbranch;

import android.net.Uri;
import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.BranchError;
import io.branch.referral.util.LinkProperties;

/**
 * Created by jdee on 4/10/17.
 */

public interface RNBranchInitListener {
    public void onInitFinished(Uri uri, BranchUniversalObject branchUniversalObject, LinkProperties linkProperties, BranchError error);
}
