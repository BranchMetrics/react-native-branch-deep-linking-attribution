package com.dispatcher.rnbranch;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.*;

import io.branch.referral.Branch;
import io.branch.referral.BranchError;

import org.json.*;
import java.util.*;

public class RNBranchModule extends ReactContextBaseJavaModule {
  public static final String REACT_CLASS = "RNBranch";
  private static final String NATIVE_INIT_SESSION_FINISHED_EVENT = "onInitSessionFinished";
  private static final String RN_INIT_SESSION_FINISHED_EVENT = "RNBranch.initSessionFinished";

  private static JSONObject initSessionResult = null;
  private BroadcastReceiver mInitSessionEventReceiver = null;

  public static void initSession(Uri uri, ReactActivity reactActivity) {
    Branch branch = Branch.getInstance();
    branch.initSession(new Branch.BranchReferralInitListener(){
        private ReactActivity mActivity = null;

        @Override
        public void onInitFinished(JSONObject referringParams, BranchError error) {    
            JSONObject result = new JSONObject();
            try{
                result.put("params", referringParams != null ? referringParams : JSONObject.NULL);
                result.put("error", error != null ? error.getMessage() : JSONObject.NULL);                
            } catch(JSONException ex) {
                try { 
                    result.put("error", "Failed to convert result to JSONObject: " + ex.getMessage());
                } catch(JSONException k) {}
            }
            initSessionResult = result;
            LocalBroadcastManager.getInstance(mActivity).sendBroadcast(new Intent(NATIVE_INIT_SESSION_FINISHED_EVENT));
        }

        private Branch.BranchReferralInitListener init(ReactActivity activity) {
            mActivity = activity;
            return this;
        }
    }.init(reactActivity), uri, reactActivity);
  }  

  public RNBranchModule(ReactApplicationContext reactContext) {
    super(reactContext);
    
    forwardInitSessionFinishedEventToReactNative(reactContext);
  }

  private void forwardInitSessionFinishedEventToReactNative(ReactApplicationContext reactContext) {
    mInitSessionEventReceiver = new BroadcastReceiver() {
      RNBranchModule mBranchModule;

      @Override
      public void onReceive(Context context, Intent intent) {
        mBranchModule.sendRNEvent(RN_INIT_SESSION_FINISHED_EVENT, convertJsonToMap(initSessionResult));
      }

      private BroadcastReceiver init(RNBranchModule branchModule) {
        mBranchModule = branchModule;
        return this;
      }
    }.init(this);

    LocalBroadcastManager.getInstance(reactContext).registerReceiver(mInitSessionEventReceiver, new IntentFilter(NATIVE_INIT_SESSION_FINISHED_EVENT));
  }

  @Override
  public void onCatalystInstanceDestroy() {    
    LocalBroadcastManager.getInstance(getReactApplicationContext()).unregisterReceiver(mInitSessionEventReceiver);
  }

  @Override
  public String getName() {     
    return REACT_CLASS;
  }

  @ReactMethod
  public void getInitSessionResult(Callback cb) {     
    cb.invoke(convertJsonToMap(initSessionResult));
  }

  @ReactMethod
  public void setDebug() {    
    Branch branch = Branch.getInstance();
    branch.setDebug();
  }

  @ReactMethod
  public void getLatestReferringParams(Callback cb) {    
    Branch branch = Branch.getInstance();
    cb.invoke(convertJsonToMap(branch.getLatestReferringParams()));
  }

  @ReactMethod
  public void getFirstReferringParams(Callback cb) {    
    Branch branch = Branch.getInstance();
    cb.invoke(convertJsonToMap(branch.getFirstReferringParams()));
  }

  @ReactMethod
  public void setIdentity(String identity) {    
    Branch branch = Branch.getInstance();
    branch.setIdentity(identity);
  }

  @ReactMethod
  public void logout() {    
    Branch branch = Branch.getInstance();
    branch.logout();
  }

  @ReactMethod
  public void userCompletedAction(String event, ReadableMap appState) throws JSONException {    
    Branch branch = Branch.getInstance();
    branch.userCompletedAction(event, convertMapToJson(appState));
  }

  public void sendRNEvent(String eventName, @Nullable WritableMap params) {
    getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
    JSONObject object = new JSONObject();
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
    while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        switch (readableMap.getType(key)) {
            case Null:
                object.put(key, JSONObject.NULL);
                break;
            case Boolean:
                object.put(key, readableMap.getBoolean(key));
                break;
            case Number:
                object.put(key, readableMap.getDouble(key));
                break;
            case String:
                object.put(key, readableMap.getString(key));
                break;
            case Map:
                object.put(key, convertMapToJson(readableMap.getMap(key)));
                break;
            case Array:
                object.put(key, convertArrayToJson(readableMap.getArray(key)));
                break;
        }
    }
    return object;
  }

  private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
    JSONArray array = new JSONArray();
    for (int i = 0; i < readableArray.size(); i++) {
        switch (readableArray.getType(i)) {
            case Null:
                break;
            case Boolean:
                array.put(readableArray.getBoolean(i));
                break;
            case Number:
                array.put(readableArray.getDouble(i));
                break;
            case String:
                array.put(readableArray.getString(i));
                break;
            case Map:
                array.put(convertMapToJson(readableArray.getMap(i)));
                break;
            case Array:
                array.put(convertArrayToJson(readableArray.getArray(i)));
                break;
        }
    }
    return array;
  }

  private static WritableMap convertJsonToMap(JSONObject jsonObject) {
    if(jsonObject == null) {
        return null;
    }

    WritableMap map = new WritableNativeMap();

    try {
        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
    } catch(JSONException ex) {
        map.putString("error", "Failed to convert JSONObject to WriteableMap: " + ex.getMessage());
    }

    return map;
  }

  private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
    WritableArray array = new WritableNativeArray();

    for (int i = 0; i < jsonArray.length(); i++) {
        Object value = jsonArray.get(i);
        if (value instanceof JSONObject) {
            array.pushMap(convertJsonToMap((JSONObject) value));
        } else if (value instanceof  JSONArray) {
            array.pushArray(convertJsonToArray((JSONArray) value));
        } else if (value instanceof  Boolean) {
            array.pushBoolean((Boolean) value);
        } else if (value instanceof  Integer) {
            array.pushInt((Integer) value);
        } else if (value instanceof  Double) {
            array.pushDouble((Double) value);
        } else if (value instanceof String)  {
            array.pushString((String) value);
        } else {
            array.pushString(value.toString());
        }
    }
    return array;
    }
  }