package io.branch.testbed_native_android;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import io.branch.rnbranch.RNBranchModule;

/**
 * Created by jdee on 3/30/17.
 */

public class MainApplication extends MultiDexApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        RNBranchModule.getAutoInstance(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
