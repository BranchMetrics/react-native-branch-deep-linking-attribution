package io.branch.testbed_native_android;

import android.app.Application;

import io.branch.referral.Branch;

/**
 * Created by jdee on 3/30/17.
 */

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Branch.getAutoInstance(this);
    }
}
