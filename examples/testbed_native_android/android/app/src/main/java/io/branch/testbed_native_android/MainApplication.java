package io.branch.testbed_native_android;

import android.app.Application;

import com.facebook.soloader.SoLoader;

import io.branch.rnbranch.RNBranchModule;

/**
 * Created by jdee on 3/30/17.
 */

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
        RNBranchModule.getAutoInstance(this);
    }
}
