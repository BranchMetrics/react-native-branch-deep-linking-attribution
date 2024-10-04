package com.branchreactnativetestbed;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class ManifestHelper extends ReactContextBaseJavaModule {

    ManifestHelper(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ManifestHelper";
    }

    @ReactMethod
    public void getManifestValue(String key, Promise promise) {
        try {
            ApplicationInfo ai = getReactApplicationContext().getPackageManager().getApplicationInfo(
                getReactApplicationContext().getPackageName(), 
                PackageManager.GET_META_DATA
            );
            String value = ai.metaData.getString(key);
            promise.resolve(value);
        } catch (PackageManager.NameNotFoundException e) {
            promise.reject("NameNotFoundException", e);
        }
    }
}