package io.branch.rnbranch;

import com.facebook.react.bridge.JavaScriptModule;

import java.util.Collections;
import java.util.List;

/**
 * Created by jdee on 8/2/17.
 */

public class RNBranchLegacyPackage extends RNBranchPackageBase {
    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }
}
