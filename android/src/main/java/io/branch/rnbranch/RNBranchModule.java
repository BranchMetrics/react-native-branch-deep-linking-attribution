package io.branch.rnbranch;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.os.Handler;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.*;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.*;
import com.facebook.react.bridge.ReadableMap;

import io.branch.referral.*;
import io.branch.referral.Branch.BranchLinkCreateListener;
import io.branch.referral.util.*;
import io.branch.indexing.*;

import org.json.*;
import java.util.*;

public class RNBranchModule extends ReactContextBaseJavaModule {
  public static final String REACT_CLASS = "RNBranch";
  public static final String REACT_MODULE_NAME = "RNBranch";
  private static final String NATIVE_INIT_SESSION_FINISHED_EVENT = "onInitSessionFinished";
  private static final String RN_INIT_SESSION_EVENT = "RNBranch.initSessionSuccess";

  private static JSONObject initSessionResult = null;
  private BroadcastReceiver mInitSessionEventReceiver = null;

  private static ReactActivity mActivity = null;
  private static Branch mBranch = null;

  public static void initSession(final Uri uri, ReactActivity reactActivity) {
    mBranch = Branch.getInstance(reactActivity.getApplicationContext());
    mActivity = reactActivity;
    mBranch.initSession(new Branch.BranchReferralInitListener(){

      private ReactActivity mmActivity = null;

      @Override
      public void onInitFinished(JSONObject referringParams, BranchError error) {

        Log.d(REACT_CLASS, "onInitFinished");
        JSONObject result = new JSONObject();
        try{
          result.put("params", referringParams != null && referringParams.has("~id") ? referringParams : JSONObject.NULL);
          result.put("error", error != null ? error.getMessage() : JSONObject.NULL);
          result.put("uri", uri != null ? uri.toString() : JSONObject.NULL);
        } catch(JSONException ex) {
          try {
            result.put("error", "Failed to convert result to JSONObject: " + ex.getMessage());
          } catch(JSONException k) {}
        }
        initSessionResult = result;
        LocalBroadcastManager.getInstance(mmActivity).sendBroadcast(new Intent(NATIVE_INIT_SESSION_FINISHED_EVENT));
      }

      private Branch.BranchReferralInitListener init(ReactActivity activity) {
        mmActivity = activity;
        return this;
      }
    }.init(reactActivity), uri, reactActivity);
  }

  public static void onStop() {
    mBranch.closeSession();
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
        mBranchModule.sendRNEvent(RN_INIT_SESSION_EVENT, convertJsonToMap(initSessionResult));
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
    return REACT_MODULE_NAME;
  }

  @ReactMethod
  public void getInitSessionResult(Promise promise) {
    promise.resolve(convertJsonToMap(initSessionResult));
  }

  @ReactMethod
  public void setDebug() {
    Branch branch = Branch.getInstance();
    branch.setDebug();
  }

  @ReactMethod
  public void getLatestReferringParams(Promise promise) {
    Branch branch = Branch.getInstance();
    promise.resolve(convertJsonToMap(branch.getLatestReferringParams()));
  }

  @ReactMethod
  public void getFirstReferringParams(Promise promise) {
    Branch branch = Branch.getInstance();
    promise.resolve(convertJsonToMap(branch.getFirstReferringParams()));
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

  @ReactMethod
  public void showShareSheet(ReadableMap branchUniversalObjectMap, ReadableMap shareOptionsMap, ReadableMap linkPropertiesMap, ReadableMap controlParamsMap, Promise promise) {
    Context context = getReactApplicationContext();

    Handler mainHandler = new Handler(context.getMainLooper());

    Runnable myRunnable = new Runnable() {
      Promise mPm;
      Context mContext;
      ReadableMap shareOptionsMap, branchUniversalObjectMap, linkPropertiesMap, controlParamsMap;

      private Runnable init(ReadableMap _shareOptionsMap, ReadableMap _branchUniversalObjectMap, ReadableMap _linkPropertiesMap, ReadableMap _controlParamsMap, Promise promise, Context context) {
        mPm = promise;
        mContext = context;
        shareOptionsMap = _shareOptionsMap;
        branchUniversalObjectMap = _branchUniversalObjectMap;
        linkPropertiesMap = _linkPropertiesMap;
        controlParamsMap = _controlParamsMap;
        return this;
      }

      @Override
      public void run() {
        String messageHeader = shareOptionsMap.hasKey("messageHeader") ? shareOptionsMap.getString("messageHeader") : "";
        String messageBody = shareOptionsMap.hasKey("messageBody") ? shareOptionsMap.getString("messageBody") : "";
        ShareSheetStyle shareSheetStyle = new ShareSheetStyle(mContext, messageHeader, messageBody)
          .setCopyUrlStyle(mContext.getResources().getDrawable(android.R.drawable.ic_menu_send), "Copy", "Added to clipboard")
          .setMoreOptionStyle(mContext.getResources().getDrawable(android.R.drawable.ic_menu_search), "Show more")
          .addPreferredSharingOption(SharingHelper.SHARE_WITH.EMAIL)
          .addPreferredSharingOption(SharingHelper.SHARE_WITH.TWITTER)
          .addPreferredSharingOption(SharingHelper.SHARE_WITH.MESSAGE)
          .addPreferredSharingOption(SharingHelper.SHARE_WITH.FACEBOOK);

        BranchUniversalObject branchUniversalObject = createBranchUniversalObject(branchUniversalObjectMap);

        LinkProperties linkProperties = createLinkProperties(linkPropertiesMap, controlParamsMap);

        branchUniversalObject.showShareSheet(
        getCurrentActivity(),
        linkProperties,
        shareSheetStyle,
        new Branch.BranchLinkShareListener() {
          private Promise mPromise = null;

          @Override
          public void onShareLinkDialogLaunched() {
          }

          @Override
          public void onShareLinkDialogDismissed() {
            if(mPromise == null) {
              return;
            }

            WritableMap map = new WritableNativeMap();
            map.putString("channel", null);
            map.putBoolean("completed", false);
            map.putString("error", null);
            mPromise.resolve(map);
            mPromise = null;
          }

          @Override
          public void onLinkShareResponse(String sharedLink, String sharedChannel, BranchError error) {
            if(mPromise == null) {
              return;
            }

            WritableMap map = new WritableNativeMap();
            map.putString("channel", sharedChannel);
            map.putBoolean("completed", true);
            map.putString("error", (error != null ? error.getMessage() : null));
            mPromise.resolve(map);
            mPromise = null;
          }
          @Override
          public void onChannelSelected(String channelName) {
          }

          private Branch.BranchLinkShareListener init(Promise promise) {
            mPromise = promise;
            return this;
          }
        }.init(mPm));
      }
    }.init(shareOptionsMap, branchUniversalObjectMap, linkPropertiesMap, controlParamsMap, promise, context);

    mainHandler.post(myRunnable);
  }

  @ReactMethod
  public void registerView(ReadableMap branchUniversalObjectMap, Promise promise) {
    BranchUniversalObject branchUniversalObject = createBranchUniversalObject(branchUniversalObjectMap);
    branchUniversalObject.registerView();
    promise.resolve(null);
  }

  @ReactMethod
  public void generateShortUrl(ReadableMap branchUniversalObjectMap, ReadableMap linkPropertiesMap, ReadableMap controlParamsMap, final Promise promise) {
    LinkProperties linkProperties = createLinkProperties(linkPropertiesMap, controlParamsMap);

    BranchUniversalObject branchUniversalObject = createBranchUniversalObject(branchUniversalObjectMap);

    branchUniversalObject.generateShortUrl(mActivity, linkProperties, new BranchLinkCreateListener() {
      @Override
      public void onLinkCreate(String url, BranchError error) {
        Log.d(REACT_CLASS, "onLinkCreate " + url);
        WritableMap map = new WritableNativeMap();
        map.putString("url", url);
        promise.resolve(map);
      }
    });
  }

  public static LinkProperties createLinkProperties(ReadableMap linkPropertiesMap, @Nullable ReadableMap controlParams){
    LinkProperties linkProperties = new LinkProperties();
    if (linkPropertiesMap.hasKey("channel")) linkProperties.setChannel(linkPropertiesMap.getString("channel"));
    if (linkPropertiesMap.hasKey("feature")) linkProperties.setFeature(linkPropertiesMap.getString("feature"));

    if (controlParams != null) {
      if (controlParams.hasKey("$fallback_url")) {
        linkProperties.addControlParameter("$fallback_url", controlParams.getString("$fallback_url"));
      }
      if (controlParams.hasKey("$desktop_url")) {
        linkProperties.addControlParameter("$desktop_url", controlParams.getString("$desktop_url"));
      }
      if (controlParams.hasKey("$android_url")) {
        linkProperties.addControlParameter("$android_url", controlParams.getString("$android_url"));
      }
      if (controlParams.hasKey("$ios_url")) {
        linkProperties.addControlParameter("$ios_url", controlParams.getString("$ios_url"));
      }
      if (controlParams.hasKey("$ipad_url")) {
        linkProperties.addControlParameter("$ipad_url", controlParams.getString("$ipad_url"));
      }
      if (controlParams.hasKey("$fire_url")) {
        linkProperties.addControlParameter("$fire_url", controlParams.getString("$fire_url"));
      }
      if (controlParams.hasKey("$blackberry_url")) {
        linkProperties.addControlParameter("$blackberry_url", controlParams.getString("$blackberry_url"));
      }
      if (controlParams.hasKey("$windows_phone_url")) {
        linkProperties.addControlParameter("$windows_phone_url", controlParams.getString("$windows_phone_url"));
      }
    }

    return linkProperties;
  }

  public BranchUniversalObject createBranchUniversalObject(ReadableMap branchUniversalObjectMap) {
    BranchUniversalObject branchUniversalObject = new BranchUniversalObject()
      .setCanonicalIdentifier(branchUniversalObjectMap.getString("canonicalIdentifier"));

    if (branchUniversalObjectMap.hasKey("title")) branchUniversalObject.setTitle(branchUniversalObjectMap.getString("title"));
    if (branchUniversalObjectMap.hasKey("contentDescription")) branchUniversalObject.setContentDescription(branchUniversalObjectMap.getString("contentDescription"));
    if (branchUniversalObjectMap.hasKey("contentImageUrl")) branchUniversalObject.setContentImageUrl(branchUniversalObjectMap.getString("contentImageUrl"));

    if(branchUniversalObjectMap.hasKey("metadata")) {
      ReadableMap metadataMap = branchUniversalObjectMap.getMap("metadata");
      ReadableMapKeySetIterator iterator = metadataMap.keySetIterator();
      while (iterator.hasNextKey()) {
        String metadataKey = iterator.nextKey();
        Object metadataObject = getReadableMapObjectForKey(metadataMap, metadataKey);
        branchUniversalObject.addContentMetadata(metadataKey, metadataObject.toString());
      }
    }

    return branchUniversalObject;
  }

  @ReactMethod
  public void redeemRewards(int value, String bucket, Promise promise)
  {
    if (bucket == null) {
      Branch.getInstance().redeemRewards(value, new RedeemRewardsListener(promise));
    } else {
      Branch.getInstance().redeemRewards(bucket, value, new RedeemRewardsListener(promise));
    }
  }

  @ReactMethod
  public void loadRewards(Promise promise)
  {
    Branch.getInstance().loadRewards(new LoadRewardsListener(promise));
  }

  @ReactMethod
  public void getCreditHistory(Promise promise)
  {
    Branch.getInstance().getCreditHistory(new CreditHistoryListener(promise));
  }

  protected class CreditHistoryListener implements Branch.BranchListResponseListener
  {
    private Promise _promise;

    // Constructor that takes in a required callbackContext object
    public CreditHistoryListener(Promise promise) {
      this._promise = promise;
    }

    // Listener that implements BranchListResponseListener for getCreditHistory()
    @Override
    public void onReceivingResponse(JSONArray list, BranchError error) {
      ArrayList<String> errors = new ArrayList<String>();
      if (error == null) {
        try {
          ReadableArray result = convertJsonToArray(list);
          this._promise.resolve(result);
        } catch (JSONException err) {
          this._promise.reject(err.getMessage());
        }
      } else {
        String errorMessage = error.getMessage();
        Log.d(REACT_CLASS, errorMessage);
        this._promise.reject(errorMessage);
      }
    }
  }

  protected class RedeemRewardsListener implements Branch.BranchReferralStateChangedListener
  {
    private Promise _promise;

    public RedeemRewardsListener(Promise promise) {
      this._promise = promise;
    }

    @Override
    public void onStateChanged(boolean changed, BranchError error) {
      if (error == null) {
        WritableMap map = new WritableNativeMap();
        map.putBoolean("changed", changed);
        this._promise.resolve(map);
      } else {
        String errorMessage = error.getMessage();
        Log.d(REACT_CLASS, errorMessage);
        this._promise.reject(errorMessage);
      }
    }
  }

  protected class LoadRewardsListener implements Branch.BranchReferralStateChangedListener
  {
    private Promise _promise;

    public LoadRewardsListener(Promise promise) {
      this._promise = promise;
    }

    @Override
    public void onStateChanged(boolean changed, BranchError error) {
      if (error == null) {
        int credits = Branch.getInstance().getCredits();
        WritableMap map = new WritableNativeMap();
        map.putInt("credits", credits);
        this._promise.resolve(map);
      } else {
        String errorMessage = error.getMessage();
        Log.d(REACT_CLASS, errorMessage);
        this._promise.reject(errorMessage);
      }
    }
  }

  public void sendRNEvent(String eventName, @Nullable WritableMap params) {
    // This should avoid the crash in getJSModule() at startup
    // See also: https://github.com/walmartreact/react-native-orientation-listener/issues/8

    ReactApplicationContext context = getReactApplicationContext();
    Handler mainHandler = new Handler(context.getMainLooper());

    Runnable poller = new Runnable() {

      private Runnable init(ReactApplicationContext _context, Handler _mainHandler, String _eventName, WritableMap _params) {
        mMainHandler = _mainHandler;
        mEventName = _eventName;
        mContext = _context;
        mParams = _params;
        return this;
      }

      final int pollDelayInMs = 100;
      final int maxTries = 300;

      int tries = 1;
      String mEventName;
      WritableMap mParams;
      Handler mMainHandler;
      ReactApplicationContext mContext;

      @Override
      public void run() {
        try {
          Log.d(REACT_CLASS, "Catalyst instance poller try " + Integer.toString(tries));
          if (mContext.hasActiveCatalystInstance()) {
            Log.d(REACT_CLASS, "Catalyst instance active");
            mContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(mEventName, mParams);
          } else {
            tries++;
            if (tries <= maxTries) {
              mMainHandler.postDelayed(this, pollDelayInMs);
            } else {
              Log.e(REACT_CLASS, "Could not get Catalyst instance");
            }
          }
        }
        catch (Exception e) {
          e.printStackTrace();
        }
      }
    }.init(context, mainHandler, eventName, params);

    Log.d(REACT_CLASS, "sendRNEvent");

    mainHandler.post(poller);
  }

  private static Object getReadableMapObjectForKey(ReadableMap readableMap, String key) {
    switch(readableMap.getType(key)) {
      case Null:
      return "Null";
      case Boolean:
      return readableMap.getBoolean(key);
      case Number:
      return readableMap.getDouble(key);
      case String:
      return readableMap.getString(key);
      default:
      return "Unsupported Type";
    }
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
        } else if (value == null || value == JSONObject.NULL) {
          map.putNull(key);
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
