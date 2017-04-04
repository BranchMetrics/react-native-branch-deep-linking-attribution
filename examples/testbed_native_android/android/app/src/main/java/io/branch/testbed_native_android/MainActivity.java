package io.branch.testbed_native_android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;

import org.json.JSONException;
import org.json.JSONObject;

import io.branch.rnbranch.*;

public class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler{
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1;
    private static final String MAIN_ACTIVITY = "MainActivity";
    private BroadcastReceiver mBroadcastReceiver = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle") // prod
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new RNBranchPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "testbed_native_android", null);

        setContentView(mReactRootView);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }

        subscribeToBranchLinks();
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    Log.e(MAIN_ACTIVITY, "Overlays not enabled");
                }
            }
        }
    }

    // Override onStart, onNewIntent:
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);
    }

    private void subscribeToBranchLinks() {
        // Catch link open events. Also transmitted to branch.subscribe in JS.
        mBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String jsonResult = intent.getStringExtra(RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT_RESULT);
                if (jsonResult == null) {
                    Log.w(MAIN_ACTIVITY, "NATIVE_INIT_SESSION_FINISHED_EVENT_RESULT extra not found");
                    return;
                }

                try {
                    JSONObject jsonObject = new JSONObject(jsonResult);
                    String error = jsonObject.getString(RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT_ERROR);
                    if (error != null) {
                        Log.e(MAIN_ACTIVITY, "Error opening Branch link: " + error);
                        return;
                    }

                    String uri = jsonObject.getString(RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT_URI);
                    if (uri != null) {
                        Log.d(MAIN_ACTIVITY, uri + " opened via Branch");
                    }

                    JSONObject params = jsonObject.getJSONObject(RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT_PARAMS);
                    if (params != null) {
                        Log.d(MAIN_ACTIVITY, "params: " + params);
                    }
                }
                catch (JSONException e) {
                    Log.w(MAIN_ACTIVITY, e.getMessage());
                }
            }
        };
        LocalBroadcastManager.getInstance(this).registerReceiver(mBroadcastReceiver, new IntentFilter(RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT));
    }
}
