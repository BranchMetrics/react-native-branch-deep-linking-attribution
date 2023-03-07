package io.branch.rnbranch;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Base64;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.util.Log;
import android.os.Handler;

import com.facebook.react.bridge.*;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.*;
import com.facebook.react.bridge.ReadableMap;

import io.branch.referral.*;
import io.branch.referral.Branch.BranchLinkCreateListener;
import io.branch.referral.BuildConfig;
import io.branch.referral.QRCode.BranchQRCode;
import io.branch.referral.util.*;
import io.branch.referral.Branch;
import io.branch.indexing.*;

import org.json.*;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.annotation.Nonnull;

@ReactModule(name = RNBranchModule.NAME)
public class RNBranchModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "RNBranch";
    public static final String NAME = "RNBranch";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT = "io.branch.rnbranch.RNBranchModule.onInitSessionFinished";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT_BRANCH_UNIVERSAL_OBJECT = "branch_universal_object";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT_LINK_PROPERTIES = "link_properties";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT_PARAMS = "params";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT_ERROR = "error";
    public static final String NATIVE_INIT_SESSION_FINISHED_EVENT_URI = "uri";
    public static final String NATIVE_INIT_SESSION_STARTED_EVENT = "io.branch.rnbranch.RNBranchModule.onInitSessionStarted";
    public static final String NATIVE_INIT_SESSION_STARTED_EVENT_URI = "uri";
    private static final String RN_INIT_SESSION_SUCCESS_EVENT = "RNBranch.initSessionSuccess";
    private static final String RN_INIT_SESSION_ERROR_EVENT = "RNBranch.initSessionError";
    private static final String RN_INIT_SESSION_START_EVENT = "RNBranch.initSessionStart";
    private static final String INIT_SESSION_SUCCESS = "INIT_SESSION_SUCCESS";
    private static final String INIT_SESSION_ERROR = "INIT_SESSION_ERROR";
    private static final String INIT_SESSION_START = "INIT_SESSION_START";

    private static final String STANDARD_EVENT_ADD_TO_CART = "STANDARD_EVENT_ADD_TO_CART";
    private static final String STANDARD_EVENT_ADD_TO_WISHLIST = "STANDARD_EVENT_ADD_TO_WISHLIST";
    private static final String STANDARD_EVENT_VIEW_CART = "STANDARD_EVENT_VIEW_CART";
    private static final String STANDARD_EVENT_INITIATE_PURCHASE = "STANDARD_EVENT_INITIATE_PURCHASE";
    private static final String STANDARD_EVENT_ADD_PAYMENT_INFO = "STANDARD_EVENT_ADD_PAYMENT_INFO";
    private static final String STANDARD_EVENT_PURCHASE = "STANDARD_EVENT_PURCHASE";
    private static final String STANDARD_EVENT_VIEW_AD = "STANDARD_EVENT_VIEW_AD";
    private static final String STANDARD_EVENT_CLICK_AD = "STANDARD_EVENT_CLICK_AD";

    private static final String STANDARD_EVENT_SEARCH = "STANDARD_EVENT_SEARCH";
    private static final String STANDARD_EVENT_VIEW_ITEM = "STANDARD_EVENT_VIEW_ITEM";
    private static final String STANDARD_EVENT_VIEW_ITEMS = "STANDARD_EVENT_VIEW_ITEMS";
    private static final String STANDARD_EVENT_RATE = "STANDARD_EVENT_RATE";
    private static final String STANDARD_EVENT_SHARE = "STANDARD_EVENT_SHARE";

    private static final String STANDARD_EVENT_COMPLETE_REGISTRATION = "STANDARD_EVENT_COMPLETE_REGISTRATION";
    private static final String STANDARD_EVENT_COMPLETE_TUTORIAL = "STANDARD_EVENT_COMPLETE_TUTORIAL";
    private static final String STANDARD_EVENT_ACHIEVE_LEVEL = "STANDARD_EVENT_ACHIEVE_LEVEL";
    private static final String STANDARD_EVENT_UNLOCK_ACHIEVEMENT = "STANDARD_EVENT_UNLOCK_ACHIEVEMENT";
    private static final String STANDARD_EVENT_INVITE = "STANDARD_EVENT_INVITE";
    private static final String STANDARD_EVENT_LOGIN = "STANDARD_EVENT_LOGIN";
    private static final String STANDARD_EVENT_RESERVE = "STANDARD_EVENT_RESERVE";
    private static final String STANDARD_EVENT_SUBSCRIBE = "STANDARD_EVENT_SUBSCRIBE";
    private static final String STANDARD_EVENT_START_TRIAL = "STANDARD_EVENT_START_TRIAL";

    private static final String IDENT_FIELD_NAME = "ident";
    public static final String UNIVERSAL_OBJECT_NOT_FOUND_ERROR_CODE = "RNBranch::Error::BUONotFound";
    public static final String GENERIC_ERROR = "RNBranch::Error";
    private static final long AGING_HASH_TTL = 3600000;
    private static final String PLUGIN_NAME = "ReactNative";

    private static JSONObject initSessionResult = null;
    private BroadcastReceiver mInitSessionFinishedEventReceiver = null;
    private BroadcastReceiver mInitSessionStartedEventReceiver = null;
    private static Branch.BranchUniversalReferralInitListener initListener = null;

    private static Activity mActivity = null;
    private static boolean mInitialized = false;
    private static volatile boolean mNewIntent = true;
    private static JSONObject mRequestMetadata = new JSONObject();

    private AgingHash<String, BranchUniversalObject> mUniversalObjectMap = new AgingHash<>(AGING_HASH_TTL);

    private static Branch.BranchReferralInitListener referralInitListener = null;

    public static void getAutoInstance(Context context) {
        Branch.registerPlugin(PLUGIN_NAME, io.branch.rnbranch.BuildConfig.RNBRANCH_VERSION);
        Branch.getAutoInstance(context);
    }

    public static void reInitSession(Activity reactActivity) {
        Branch branch = Branch.getInstance();
        Intent intent = reactActivity.getIntent();
        Log.d(REACT_CLASS,"reInitSession intent " + intent);
        if (intent != null) {
            intent.putExtra("branch_force_new_session", true);
            notifyJSOfInitSessionStart(reactActivity, intent.getData());
            Branch.sessionBuilder(reactActivity).withCallback(referralInitListener).reInit();
        } else {
            Log.w(REACT_CLASS, "reInitSession was called but the Intent is null");
        }
    }

    public static void initSession(final Uri uri, Activity reactActivity, Branch.BranchUniversalReferralInitListener anInitListener) {
        Log.d(REACT_CLASS,"initSession uri " + uri + " reactActivity " + reactActivity + " anInitListener" + anInitListener);
        initListener = anInitListener;
        initSession(uri, reactActivity);
    }

    public static void initSession(final Uri uri, Activity reactActivity) {
        Log.d(REACT_CLASS,"initSession uri " + uri + " reactActivity " + reactActivity);

        Branch branch = setupBranch(reactActivity.getApplicationContext());

        mActivity = reactActivity;
        final boolean isNewIntent = mNewIntent;
        referralInitListener = new Branch.BranchReferralInitListener(){

            private Activity mmActivity = null;

            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                Log.d(REACT_CLASS,"onInitFinished referringParams " + referringParams);

                // react native currently expects this to never be null
                if (referringParams == null) {
                    referringParams = new JSONObject();
                }

                Log.d(REACT_CLASS, "onInitFinished");
                JSONObject result = new JSONObject();

                try {
                    result.put(NATIVE_INIT_SESSION_FINISHED_EVENT_PARAMS, referringParams);
                    result.put(NATIVE_INIT_SESSION_FINISHED_EVENT_ERROR, error != null ? error.getMessage() : JSONObject.NULL);
                    result.put(NATIVE_INIT_SESSION_FINISHED_EVENT_URI, isNewIntent && uri != null ? uri.toString() : JSONObject.NULL);
                }
                catch (JSONException e) {
                    Log.e(REACT_CLASS, e.getMessage());
                }
                initSessionResult = result;

                BranchUniversalObject branchUniversalObject =  BranchUniversalObject.getReferredBranchUniversalObject();
                LinkProperties linkProperties = LinkProperties.getReferredLinkProperties();

                if (initListener != null) {
                    Log.d(REACT_CLASS,"onInitFinished " + branchUniversalObject + " " + linkProperties + " error " +error);
                    initListener.onInitFinished(branchUniversalObject, linkProperties, error);
                }
                generateLocalBroadcast(referringParams, uri, branchUniversalObject, linkProperties, error);
            }

            private Branch.BranchReferralInitListener init(Activity activity) {
                mmActivity = activity;
                return this;
            }

            private void generateLocalBroadcast(JSONObject referringParams,
                                                Uri uri,
                                                BranchUniversalObject branchUniversalObject,
                                                LinkProperties linkProperties,
                                                BranchError error) {
                
                Intent broadcastIntent = new Intent(NATIVE_INIT_SESSION_FINISHED_EVENT);

                if (referringParams != null) {
                    broadcastIntent.putExtra(NATIVE_INIT_SESSION_FINISHED_EVENT_PARAMS, referringParams.toString());
                }

                if (branchUniversalObject != null) {
                    broadcastIntent.putExtra(NATIVE_INIT_SESSION_FINISHED_EVENT_BRANCH_UNIVERSAL_OBJECT, branchUniversalObject);
                }

                if (linkProperties != null) {
                    broadcastIntent.putExtra(NATIVE_INIT_SESSION_FINISHED_EVENT_LINK_PROPERTIES, linkProperties);
                }

                /*
                 * isNewIntent is a capture of the value of mNewIntent above, so does not change when
                 * mNewIntent changes in onNewIntent.
                 */
                if (isNewIntent && uri != null) {
                    broadcastIntent.putExtra(NATIVE_INIT_SESSION_FINISHED_EVENT_URI, uri.toString());
                }

                if (error != null) {
                    broadcastIntent.putExtra(NATIVE_INIT_SESSION_FINISHED_EVENT_ERROR, error.getMessage());
                }

                LocalBroadcastManager.getInstance(mmActivity).sendBroadcast(broadcastIntent);
            }
        }.init(reactActivity);

        notifyJSOfInitSessionStart(reactActivity, uri);
        
        Branch.InitSessionBuilder initSessionBuilder = Branch.sessionBuilder(reactActivity).withCallback(referralInitListener).withData(uri);
        Log.d(REACT_CLASS, "sessionBuilder " + initSessionBuilder);
        initSessionBuilder.init();
    }

    /**
     * Call from Activity.onNewIntent:
     *   @Override
     *   public void onNewIntent(Intent intent) {
     *     super.onNewIntent(intent);
     *     RNBranchModule.onNewIntent(intent);
     *   }
     * @param intent the new Intent received via Activity.onNewIntent
     */
    public static void onNewIntent(@Nonnull Intent intent) {
        Log.d(REACT_CLASS,"onNewIntent " + intent);
        mActivity.setIntent(intent);
        mNewIntent = true;
        reInitSession(mActivity);
    }

    /**
     * Notify JavaScript of init session start. This generates an RNBranch.initSessionStart
     * event to JS via the RN native event emitter.
     * @param context a Context for the LocalBroadcastManager
     * @param uri the URI to include in the notification or null
     */
    private static void notifyJSOfInitSessionStart(Context context, Uri uri) {
        Log.d(REACT_CLASS,"notifyJSOfInitSessionStart  " + uri);

        /*
         * This check just ensures that we only generate one RNBranch.initSessionStart
         * event per call to onNewIntent().
         */
        if (!mNewIntent) return;
        mNewIntent = false;

        Intent broadcastIntent = new Intent(NATIVE_INIT_SESSION_STARTED_EVENT);
        if (uri != null) {
            broadcastIntent.putExtra(NATIVE_INIT_SESSION_STARTED_EVENT_URI, uri);
        }

        Log.d(REACT_CLASS, "Broadcasting NATIVE_INIT_SESSION_STARTED_EVENT");
        LocalBroadcastManager.getInstance(context).sendBroadcast(broadcastIntent);
    }

    /**
     * @deprecated setDebug is deprecated and all functionality has been disabled. If you wish to enable
     * logging, please invoke enableLogging. If you wish to simulate installs, please Test Devices
     * (https://help.branch.io/using-branch/docs/adding-test-devices)
     */
    @Deprecated
    public static void setDebug() { }

    public static void enableLogging() {
        Branch.enableLogging();
    }

    public static void setRequestMetadata(String key, String val) {
        if (key == null) {
            return;
        }

        if (mRequestMetadata.has(key) && val == null) {
            mRequestMetadata.remove(key);
        }

        try {
            mRequestMetadata.put(key, val);
        } catch (JSONException e) {
            // no-op
        }
    }

    public RNBranchModule(ReactApplicationContext reactContext) {
        super(reactContext);
        listenForInitSessionEventsToReactNative(reactContext);
    }

    @javax.annotation.Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        // RN events transmitted to JS

        constants.put(INIT_SESSION_SUCCESS, RN_INIT_SESSION_SUCCESS_EVENT);
        constants.put(INIT_SESSION_ERROR, RN_INIT_SESSION_ERROR_EVENT);
        constants.put(INIT_SESSION_START, RN_INIT_SESSION_START_EVENT);

        // constants for use with BranchEvent

        // Commerce events

        constants.put(STANDARD_EVENT_ADD_TO_CART, BRANCH_STANDARD_EVENT.ADD_TO_CART.getName());
        constants.put(STANDARD_EVENT_ADD_TO_WISHLIST, BRANCH_STANDARD_EVENT.ADD_TO_WISHLIST.getName());
        constants.put(STANDARD_EVENT_VIEW_CART, BRANCH_STANDARD_EVENT.VIEW_CART.getName());
        constants.put(STANDARD_EVENT_INITIATE_PURCHASE, BRANCH_STANDARD_EVENT.INITIATE_PURCHASE.getName());
        constants.put(STANDARD_EVENT_ADD_PAYMENT_INFO, BRANCH_STANDARD_EVENT.ADD_PAYMENT_INFO.getName());
        constants.put(STANDARD_EVENT_PURCHASE, BRANCH_STANDARD_EVENT.PURCHASE.getName());
        constants.put(STANDARD_EVENT_VIEW_AD, BRANCH_STANDARD_EVENT.VIEW_AD.getName());
        constants.put(STANDARD_EVENT_CLICK_AD, BRANCH_STANDARD_EVENT.CLICK_AD.getName());

        // Content Events

        constants.put(STANDARD_EVENT_SEARCH, BRANCH_STANDARD_EVENT.SEARCH.getName());
        constants.put(STANDARD_EVENT_VIEW_ITEM, BRANCH_STANDARD_EVENT.VIEW_ITEM.getName());
        constants.put(STANDARD_EVENT_VIEW_ITEMS , BRANCH_STANDARD_EVENT.VIEW_ITEMS.getName());
        constants.put(STANDARD_EVENT_RATE, BRANCH_STANDARD_EVENT.RATE.getName());
        constants.put(STANDARD_EVENT_SHARE, BRANCH_STANDARD_EVENT.SHARE.getName());

        // User Lifecycle Events

        constants.put(STANDARD_EVENT_COMPLETE_REGISTRATION, BRANCH_STANDARD_EVENT.COMPLETE_REGISTRATION.getName());
        constants.put(STANDARD_EVENT_COMPLETE_TUTORIAL , BRANCH_STANDARD_EVENT.COMPLETE_TUTORIAL.getName());
        constants.put(STANDARD_EVENT_ACHIEVE_LEVEL, BRANCH_STANDARD_EVENT.ACHIEVE_LEVEL.getName());
        constants.put(STANDARD_EVENT_UNLOCK_ACHIEVEMENT, BRANCH_STANDARD_EVENT.UNLOCK_ACHIEVEMENT.getName());
        constants.put(STANDARD_EVENT_INVITE, BRANCH_STANDARD_EVENT.INVITE.getName());
        constants.put(STANDARD_EVENT_LOGIN , BRANCH_STANDARD_EVENT.LOGIN.getName());
        constants.put(STANDARD_EVENT_RESERVE, BRANCH_STANDARD_EVENT.RESERVE.getName());
        constants.put(STANDARD_EVENT_SUBSCRIBE, BRANCH_STANDARD_EVENT.SUBSCRIBE.getName());
        constants.put(STANDARD_EVENT_START_TRIAL, BRANCH_STANDARD_EVENT.START_TRIAL.getName());

        return constants;
    }

    private void listenForInitSessionEventsToReactNative(ReactApplicationContext reactContext) {
        mInitSessionFinishedEventReceiver = new BroadcastReceiver() {
            RNBranchModule mBranchModule;

            @Override
            public void onReceive(Context context, Intent intent) {
                final boolean hasError = (initSessionResult.has("error") && !initSessionResult.isNull("error"));
                final String eventName = hasError ? RN_INIT_SESSION_ERROR_EVENT : RN_INIT_SESSION_SUCCESS_EVENT;
                
                mBranchModule.sendRNEvent(eventName, convertJsonToMap(initSessionResult));
            }

            private BroadcastReceiver init(RNBranchModule branchModule) {
                mBranchModule = branchModule;
                return this;
            }
        }.init(this);

        LocalBroadcastManager.getInstance(reactContext).registerReceiver(mInitSessionFinishedEventReceiver, new IntentFilter(NATIVE_INIT_SESSION_FINISHED_EVENT));

        mInitSessionStartedEventReceiver = new BroadcastReceiver() {
            RNBranchModule mBranchModule;

            @Override
            public void onReceive(Context context, Intent intent) {
                Uri uri = intent.getParcelableExtra(NATIVE_INIT_SESSION_STARTED_EVENT_URI);
                WritableMap payload = new WritableNativeMap();
                if (uri != null) {
                    payload.putString(NATIVE_INIT_SESSION_STARTED_EVENT_URI, uri.toString());
                }
                else {
                    payload.putNull(NATIVE_INIT_SESSION_STARTED_EVENT_URI);
                }
                mBranchModule.sendRNEvent(RN_INIT_SESSION_START_EVENT, payload);
            }

            private BroadcastReceiver init(RNBranchModule branchModule) {
                mBranchModule = branchModule;
                return this;
            }
        }.init(this);

        LocalBroadcastManager.getInstance(reactContext).registerReceiver(mInitSessionStartedEventReceiver, new IntentFilter(NATIVE_INIT_SESSION_STARTED_EVENT));
    }

    @Override
    public void onCatalystInstanceDestroy() {
        Log.d(REACT_CLASS,"onCatalystInstanceDestroy ");

        LocalBroadcastManager.getInstance(getReactApplicationContext()).unregisterReceiver(mInitSessionFinishedEventReceiver);
        LocalBroadcastManager.getInstance(getReactApplicationContext()).unregisterReceiver(mInitSessionStartedEventReceiver);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void notifyNativeToInit(){
        Log.d(REACT_CLASS, "notifyNativeToInit");
        Branch.notifyNativeToInit();
    }

    @ReactMethod
    public void disableTracking(boolean disable) {
        Branch branch = Branch.getInstance();
        branch.disableTracking(disable);
    }

    @ReactMethod
    public void isTrackingDisabled(Promise promise) {
        Branch branch = Branch.getInstance();
        promise.resolve(branch.isTrackingDisabled());
    }

    @ReactMethod
    public void createUniversalObject(ReadableMap universalObjectMap, Promise promise) {
        String ident = UUID.randomUUID().toString();
        BranchUniversalObject universalObject = createBranchUniversalObject(universalObjectMap);
        mUniversalObjectMap.put(ident, universalObject);

        WritableMap response = new WritableNativeMap();
        response.putString(IDENT_FIELD_NAME, ident);
        promise.resolve(response);
    }

    @ReactMethod
    public void releaseUniversalObject(String ident) {
        mUniversalObjectMap.remove(ident);
    }

    @ReactMethod
    public void redeemInitSessionResult(Promise promise) {
        promise.resolve(convertJsonToMap(initSessionResult));
    }

    @ReactMethod
    public void getLatestReferringParams(boolean synchronous, Promise promise) {
        Branch branch = Branch.getInstance();
        if (synchronous)
            promise.resolve(convertJsonToMap(branch.getLatestReferringParamsSync()));
        else
            promise.resolve(convertJsonToMap(branch.getLatestReferringParams()));
    }

    @ReactMethod
    public void getFirstReferringParams(Promise promise) {
        Branch branch = Branch.getInstance();
        promise.resolve(convertJsonToMap(branch.getFirstReferringParams()));
    }

    @ReactMethod
    public void lastAttributedTouchData(int window, final Promise promise) {
        Branch branch = Branch.getInstance();
        branch.getLastAttributedTouchData(new ServerRequestGetLATD.BranchLastAttributedTouchDataListener() {
                @Override
                public void onDataFetched(JSONObject jsonObject, BranchError error) {
                    if (error == null) {
                        promise.resolve(convertJsonToMap(jsonObject));
                    } else {
                        promise.reject(GENERIC_ERROR, error.getMessage());
                    }
                }
            }, window);
    }

    @ReactMethod
    public void setIdentity(String identity) {
        Branch branch = Branch.getInstance();
        branch.setIdentity(identity);
    }

   @ReactMethod
    public void setIdentityAsync(String identity, final Promise promise) {
        Branch branch = Branch.getInstance();
        branch.setIdentity(identity, new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                if (error != null) {
                    promise.reject("RNBranch::Error::setIdentityAsync failed", error.getMessage());
                } else {
                    promise.resolve(convertJsonToMap(referringParams));
                }
            }
        });
    }

    @ReactMethod
    public void setRequestMetadataKey(String key, String value) {
        // setRequestMetadata does not do what it appears to do.  Call directly to the native code.
        Branch branch = Branch.getInstance();
        branch.setRequestMetadata(key, value);
    }

    @ReactMethod
    public void addFacebookPartnerParameter(String name, String value) {
        Branch branch = Branch.getInstance();
        branch.addFacebookPartnerParameterWithName(name, value);
    }

    @ReactMethod
    public void clearPartnerParameters() {
        Branch branch = Branch.getInstance();
        branch.clearPartnerParameters();
    }

    @ReactMethod
    public void logout() {
        Branch branch = Branch.getInstance();
        branch.logout();
    }

    @ReactMethod
    public static void setPreinstallCampaign(String campaign) {
        Branch branch = Branch.getInstance();
        branch.setPreinstallCampaign(campaign);
    }

    @ReactMethod
    public static void setPreinstallPartner(String partner) {
        Branch branch = Branch.getInstance();
        branch.setPreinstallPartner(partner);
    }

    @ReactMethod
    public void logEvent(ReadableArray contentItems, String eventName, ReadableMap params, Promise promise) {
        List<BranchUniversalObject> buos = new ArrayList<>();
        for (int i = 0; i < contentItems.size(); ++ i) {
            String ident = contentItems.getString(i);
            BranchUniversalObject universalObject = findUniversalObjectOrReject(ident, promise);
            if (universalObject == null) return;
            buos.add(universalObject);
        }

        BranchEvent event = createBranchEvent(eventName, params);
        event.addContentItems(buos);
        event.logEvent(mActivity);
        promise.resolve(null);
    }

    @ReactMethod
    public void userCompletedAction(String event, ReadableMap appState) throws JSONException {
        Branch branch = Branch.getInstance();
        branch.userCompletedAction(event, convertMapToJson(appState));
    }

    @ReactMethod
    public void userCompletedActionOnUniversalObject(String ident, String event, ReadableMap state, Promise promise) {
        BranchUniversalObject universalObject = findUniversalObjectOrReject(ident, promise);
        if (universalObject == null) return;

        universalObject.userCompletedAction(event, convertMapToParams(state));
        promise.resolve(null);
    }

    @ReactMethod
    public void sendCommerceEvent(String revenue, ReadableMap metadata, final Promise promise) throws JSONException {
        Branch branch = Branch.getInstance();

        CommerceEvent commerceEvent = new CommerceEvent();
        commerceEvent.setRevenue(Double.parseDouble(revenue));

        JSONObject jsonMetadata = null;
        if (metadata != null) {
            jsonMetadata = convertMapToJson(metadata);
        }

        branch.sendCommerceEvent(commerceEvent, jsonMetadata, null);
        promise.resolve(null);
    }

    @ReactMethod
    public void showShareSheet(String ident, ReadableMap shareOptionsMap, ReadableMap linkPropertiesMap, ReadableMap controlParamsMap, Promise promise) {
        Context context = getReactApplicationContext();

        Handler mainHandler = new Handler(context.getMainLooper());

        Runnable myRunnable = new Runnable() {
            Promise mPm;
            Context mContext;
            ReadableMap shareOptionsMap, linkPropertiesMap, controlParamsMap;
            String ident;

            private Runnable init(ReadableMap _shareOptionsMap, String _ident, ReadableMap _linkPropertiesMap, ReadableMap _controlParamsMap, Promise promise, Context context) {
                mPm = promise;
                mContext = context;
                shareOptionsMap = _shareOptionsMap;
                ident = _ident;
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

                BranchUniversalObject branchUniversalObject = findUniversalObjectOrReject(ident, mPm);
                if (branchUniversalObject == null) {
                    return;
                }

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
        }.init(shareOptionsMap, ident, linkPropertiesMap, controlParamsMap, promise, context);

        mainHandler.post(myRunnable);
    }

    @ReactMethod
    public void registerView(String ident, Promise promise) {
        BranchUniversalObject branchUniversalObject = findUniversalObjectOrReject(ident, promise);
        if (branchUniversalObject == null) {
             return;
        }

        branchUniversalObject.registerView();
        promise.resolve(null);
    }

    @ReactMethod
    public void generateShortUrl(String ident, ReadableMap linkPropertiesMap, ReadableMap controlParamsMap, final Promise promise) {
        LinkProperties linkProperties = createLinkProperties(linkPropertiesMap, controlParamsMap);

        BranchUniversalObject branchUniversalObject = findUniversalObjectOrReject(ident, promise);
        if (branchUniversalObject == null) {
            return;
        }

        branchUniversalObject.generateShortUrl(mActivity, linkProperties, new BranchLinkCreateListener() {
            @Override
            public void onLinkCreate(String url, BranchError error) {
                Log.d(REACT_CLASS, "onLinkCreate " + url);
                if (error != null) {
                    if (error.getErrorCode() == BranchError.ERR_BRANCH_DUPLICATE_URL) {
                        promise.reject("RNBranch::Error::DuplicateResourceError", error.getMessage());
                    }
                    else {
                        promise.reject(GENERIC_ERROR, error.getMessage());
                    }
                    return;
                }

                WritableMap map = new WritableNativeMap();
                map.putString("url", url);
                promise.resolve(map);
            }
        });
    }

    @ReactMethod
    public void openURL(String url, ReadableMap options) {
        Log.d(REACT_CLASS, "openURL url: " + url);
        if (mActivity == null) {
            // initSession is called before JS loads. This probably indicates failure to call initSession
            // in an activity.
            Log.e(REACT_CLASS, "Branch native Android SDK not initialized in openURL");
            return;
        }

        /*
         * Using Intent.ACTION_VIEW here will open a browser for non-Branch links unless the
         * domain is registered in an intent-filter in the manifest. Instead specify the host
         * Activity.
         */
        Intent intent = new Intent(mActivity, mActivity.getClass());
        intent.setData(Uri.parse(url));
        intent.putExtra("branch_force_new_session", true);

        mActivity.startActivity(intent);
    }

  @ReactMethod
    public void getBranchQRCode(ReadableMap branchQRCodeSettingsMap, ReadableMap branchUniversalObjectMap, ReadableMap linkPropertiesMap, ReadableMap controlParamsMap, final Promise promise) {
        
        BranchUniversalObject branchUniversalObject = createBranchUniversalObject(branchUniversalObjectMap);
        LinkProperties linkProperties = createLinkProperties(linkPropertiesMap, controlParamsMap);
        BranchQRCode qrCode = createBranchQRCode(branchQRCodeSettingsMap);

        try {
            qrCode.getQRCodeAsData(getReactApplicationContext().getCurrentActivity(), branchUniversalObject, linkProperties, new BranchQRCode.BranchQRCodeDataHandler() {
                @Override
                public void onSuccess(byte[] qrCodeData) {
                    String qrCodeString = Base64.encodeToString(qrCodeData, Base64.DEFAULT);
                    promise.resolve(qrCodeString);
                }
    
                @Override
                public void onFailure(Exception e) {
                    Log.d("Failed to get QR Code", e.getMessage());
                    promise.reject("Failed to get QR Code", e.getMessage());
                }    
                });
        } catch (IOException e) {
            e.printStackTrace();
            Log.d("Failed to get QR Code", e.getMessage());
            promise.reject("Failed to get QR Code", e.getMessage());
        }
    }

    public BranchQRCode createBranchQRCode(ReadableMap branchQRCodeSettingsMap) {
        BranchQRCode branchQRCode = new BranchQRCode();

        if (branchQRCodeSettingsMap.hasKey("codeColor")) branchQRCode.setCodeColor(branchQRCodeSettingsMap.getString("codeColor"));
        if (branchQRCodeSettingsMap.hasKey("backgroundColor")) branchQRCode.setBackgroundColor(branchQRCodeSettingsMap.getString("backgroundColor"));
        if (branchQRCodeSettingsMap.hasKey("centerLogo")) branchQRCode.setCenterLogo(branchQRCodeSettingsMap.getString("centerLogo"));
        if (branchQRCodeSettingsMap.hasKey("width")) branchQRCode.setWidth(branchQRCodeSettingsMap.getInt("width"));
        if (branchQRCodeSettingsMap.hasKey("margin")) branchQRCode.setMargin(branchQRCodeSettingsMap.getInt("margin"));
        
        if (branchQRCodeSettingsMap.hasKey("imageFormat")) {
            String imageFormat = branchQRCodeSettingsMap.getString("imageFormat");
            if (imageFormat != null ) {
                if (imageFormat.equals("JPEG")) {
                    branchQRCode.setImageFormat(BranchQRCode.BranchImageFormat.JPEG);
                } else {
                    branchQRCode.setImageFormat(BranchQRCode.BranchImageFormat.PNG);
                }
            }
        }
        return branchQRCode;
    }

    public static BranchEvent createBranchEvent(String eventName, ReadableMap params) {
        BranchEvent event;
        try {
            BRANCH_STANDARD_EVENT standardEvent = BRANCH_STANDARD_EVENT.valueOf(eventName);
            // valueOf on BRANCH_STANDARD_EVENT Enum has succeeded, so this is a standard event.
            event = new BranchEvent(standardEvent);
        } catch (IllegalArgumentException e) {
            // The event name is not found in standard events.
            // So use custom event mode.
            event = new BranchEvent(eventName);
        }

        if (params.hasKey("currency")) {
            String currencyString = params.getString("currency");
            CurrencyType currency = CurrencyType.getValue(currencyString);
            if (currency != null) {
                event.setCurrency(currency);
            }
            else {
                Log.w(REACT_CLASS, "Invalid currency " + currencyString);
            }
        }

        if (params.hasKey("transactionID")) event.setTransactionID(params.getString("transactionID"));
        if (params.hasKey("revenue")) event.setRevenue(Double.parseDouble(params.getString("revenue")));
        if (params.hasKey("shipping")) event.setShipping(Double.parseDouble(params.getString("shipping")));
        if (params.hasKey("tax")) event.setTax(Double.parseDouble(params.getString("tax")));
        if (params.hasKey("coupon")) event.setCoupon(params.getString("coupon"));
        if (params.hasKey("affiliation")) event.setAffiliation(params.getString("affiliation"));
        if (params.hasKey("description")) event.setDescription(params.getString("description"));
        if (params.hasKey("searchQuery")) event.setSearchQuery(params.getString("searchQuery"));
        if (params.hasKey("alias")) event.setCustomerEventAlias(params.getString("alias"));

        if (params.hasKey("customData")) {
            ReadableMap customData = params.getMap("customData");
            ReadableMapKeySetIterator it = customData.keySetIterator();
            while (it.hasNextKey()) {
                String key = it.nextKey();
                
                ReadableType readableType = customData.getType(key);
                if(readableType == ReadableType.String) {
                    event.addCustomDataProperty(key, customData.getString(key));
                }
                else{
                    Log.w(REACT_CLASS, "customData values must be strings. Value for property " + key + " is not a string type.");
                }
            }
        }

        return event;
    }

    public static LinkProperties createLinkProperties(ReadableMap linkPropertiesMap, @Nullable ReadableMap controlParams){
        LinkProperties linkProperties = new LinkProperties();
        if (linkPropertiesMap.hasKey("alias")) linkProperties.setAlias(linkPropertiesMap.getString("alias"));
        if (linkPropertiesMap.hasKey("campaign")) linkProperties.setCampaign(linkPropertiesMap.getString("campaign"));
        if (linkPropertiesMap.hasKey("channel")) linkProperties.setChannel(linkPropertiesMap.getString("channel"));
        if (linkPropertiesMap.hasKey("feature")) linkProperties.setFeature(linkPropertiesMap.getString("feature"));
        if (linkPropertiesMap.hasKey("stage")) linkProperties.setStage(linkPropertiesMap.getString("stage"));

        if (linkPropertiesMap.hasKey("tags")) {
            ReadableArray tags = linkPropertiesMap.getArray("tags");
            for (int i=0; i<tags.size(); ++i) {
                String tag = tags.getString(i);
                linkProperties.addTag(tag);
            }
        }

        if (controlParams != null) {
            ReadableMapKeySetIterator iterator = controlParams.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                Object value = getReadableMapObjectForKey(controlParams, key);
                linkProperties.addControlParameter(key, value.toString());
            }
        }

        return linkProperties;
    }

    private static Branch setupBranch(Context context) {
        Branch branch = Branch.getAutoInstance(context);

        if (!mInitialized) {
            Log.i(REACT_CLASS, "Initializing Branch SDK v. " + BuildConfig.VERSION_NAME);

            if (mRequestMetadata != null) {
                Iterator keys = mRequestMetadata.keys();
                while (keys.hasNext()) {
                    String key = (String) keys.next();
                    try {
                        branch.setRequestMetadata(key, mRequestMetadata.getString(key));
                    } catch (JSONException e) {
                        // no-op
                    }
                }
            }

            mInitialized = true;
        }

        return branch;
    }

    private BranchUniversalObject findUniversalObjectOrReject(final String ident, final Promise promise) {
        BranchUniversalObject universalObject = mUniversalObjectMap.get(ident);

        if (universalObject == null) {
            final String errorMessage = "BranchUniversalObject not found for ident " + ident + ".";
            promise.reject(UNIVERSAL_OBJECT_NOT_FOUND_ERROR_CODE, errorMessage);
        }

        return universalObject;
    }

    public ContentMetadata createContentMetadata(ReadableMap map) {
        ContentMetadata metadata = new ContentMetadata();

        if (map.hasKey("contentSchema")) {
            BranchContentSchema schema = BranchContentSchema.valueOf(map.getString("contentSchema"));
            metadata.setContentSchema(schema);
        }

        if (map.hasKey("quantity")) {
            metadata.setQuantity(map.getDouble("quantity"));
        }

        if (map.hasKey("price")) {
            double price = Double.parseDouble(map.getString("price"));
            CurrencyType currency = null;
            if (map.hasKey("currency")) currency = CurrencyType.valueOf(map.getString("currency"));
            metadata.setPrice(price, currency);
        }

        if (map.hasKey("sku")) {
            metadata.setSku(map.getString("sku"));
        }

        if (map.hasKey("productName")) {
            metadata.setProductName(map.getString("productName"));
        }

        if (map.hasKey("productBrand")) {
            metadata.setProductBrand(map.getString("productBrand"));
        }

        if (map.hasKey("productCategory")) {
            ProductCategory category = getProductCategory(map.getString("productCategory"));
            if (category != null) metadata.setProductCategory(category);
        }

        if (map.hasKey("productVariant")) {
            metadata.setProductVariant(map.getString("productVariant"));
        }

        if (map.hasKey("condition")) {
            ContentMetadata.CONDITION condition = ContentMetadata.CONDITION.valueOf(map.getString("condition"));
            metadata.setProductCondition(condition);
        }

        if (map.hasKey("ratingAverage") || map.hasKey("ratingMax") || map.hasKey("ratingCount")) {
            Double average = null, max = null;
            Integer count = null;
            if (map.hasKey("ratingAverage")) average = map.getDouble("ratingAverage");
            if (map.hasKey("ratingCount")) count = map.getInt("ratingCount");
            if (map.hasKey("ratingMax")) max = map.getDouble("ratingMax");
            metadata.setRating(average, max, count);
        }

        if (map.hasKey("addressStreet") ||
                map.hasKey("addressCity") ||
                map.hasKey("addressRegion") ||
                map.hasKey("addressCountry") ||
                map.hasKey("addressPostalCode")) {
            String street = null, city = null, region = null, country = null, postalCode = null;
            if (map.hasKey("addressStreet")) street = map.getString("addressStreet");
            if (map.hasKey("addressCity")) street = map.getString("addressCity");
            if (map.hasKey("addressRegion")) street = map.getString("addressRegion");
            if (map.hasKey("addressCountry")) street = map.getString("addressCountry");
            if (map.hasKey("addressPostalCode")) street = map.getString("addressPostalCode");
            metadata.setAddress(street, city, region, country, postalCode);
        }

        if (map.hasKey("latitude") || map.hasKey("longitude")) {
            Double latitude = null, longitude = null;
            if (map.hasKey("latitude")) latitude = map.getDouble("latitude");
            if (map.hasKey("longitude")) longitude = map.getDouble("longitude");
            metadata.setLocation(latitude, longitude);
        }

        if (map.hasKey("imageCaptions")) {
            ReadableArray captions = map.getArray("imageCaptions");
            for (int j=0; j < captions.size(); ++j) {
                metadata.addImageCaptions(captions.getString(j));
            }
        }

        if (map.hasKey("customMetadata")) {
            ReadableMap customMetadata = map.getMap("customMetadata");
            ReadableMapKeySetIterator it = customMetadata.keySetIterator();
            while (it.hasNextKey()) {
                String key = it.nextKey();
                metadata.addCustomMetadata(key, customMetadata.getString(key));
            }
        }

        return metadata;
    }

    public BranchUniversalObject createBranchUniversalObject(ReadableMap branchUniversalObjectMap) {
        BranchUniversalObject branchUniversalObject = new BranchUniversalObject()
                .setCanonicalIdentifier(branchUniversalObjectMap.getString("canonicalIdentifier"));

        if (branchUniversalObjectMap.hasKey("title")) branchUniversalObject.setTitle(branchUniversalObjectMap.getString("title"));
        if (branchUniversalObjectMap.hasKey("canonicalUrl")) branchUniversalObject.setCanonicalUrl(branchUniversalObjectMap.getString("canonicalUrl"));
        if (branchUniversalObjectMap.hasKey("contentDescription")) branchUniversalObject.setContentDescription(branchUniversalObjectMap.getString("contentDescription"));
        if (branchUniversalObjectMap.hasKey("contentImageUrl")) branchUniversalObject.setContentImageUrl(branchUniversalObjectMap.getString("contentImageUrl"));

        if (branchUniversalObjectMap.hasKey("locallyIndex")) {
            if (branchUniversalObjectMap.getBoolean("locallyIndex")) {
                branchUniversalObject.setLocalIndexMode(BranchUniversalObject.CONTENT_INDEX_MODE.PUBLIC);
            }
            else {
                branchUniversalObject.setLocalIndexMode(BranchUniversalObject.CONTENT_INDEX_MODE.PRIVATE);
            }
        }

        if (branchUniversalObjectMap.hasKey("publiclyIndex")) {
            if (branchUniversalObjectMap.getBoolean("publiclyIndex")) {
                branchUniversalObject.setContentIndexingMode(BranchUniversalObject.CONTENT_INDEX_MODE.PUBLIC);
            }
            else {
                branchUniversalObject.setContentIndexingMode(BranchUniversalObject.CONTENT_INDEX_MODE.PRIVATE);
            }
        }

        if (branchUniversalObjectMap.hasKey("contentIndexingMode")) {
            switch (branchUniversalObjectMap.getType("contentIndexingMode")) {
                case String:
                    String mode = branchUniversalObjectMap.getString("contentIndexingMode");

                    if (mode.equals("private"))
                        branchUniversalObject.setContentIndexingMode(BranchUniversalObject.CONTENT_INDEX_MODE.PRIVATE);
                    else if (mode.equals("public"))
                        branchUniversalObject.setContentIndexingMode(BranchUniversalObject.CONTENT_INDEX_MODE.PUBLIC);
                    else
                        Log.w(REACT_CLASS, "Unsupported value for contentIndexingMode: " + mode +
                                ". Supported values are \"public\" and \"private\"");
                    break;
                default:
                    Log.w(REACT_CLASS, "contentIndexingMode must be a String");
                    break;
            }
        }

        if (branchUniversalObjectMap.hasKey("currency") && branchUniversalObjectMap.hasKey("price")) {
            String currencyString = branchUniversalObjectMap.getString("currency");
            CurrencyType currency = CurrencyType.valueOf(currencyString);
            branchUniversalObject.setPrice(branchUniversalObjectMap.getDouble("price"), currency);
        }

        if (branchUniversalObjectMap.hasKey("expirationDate")) {
            String expirationString = branchUniversalObjectMap.getString("expirationDate");
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            format.setTimeZone(TimeZone.getTimeZone("UTC"));
            try {
                Date date = format.parse(expirationString);
                Log.d(REACT_CLASS, "Expiration date is " + date.toString());
                branchUniversalObject.setContentExpiration(date);
            }
            catch (ParseException e) {
                Log.w(REACT_CLASS, "Invalid expiration date format. Valid format is YYYY-mm-ddTHH:MM:SS, e.g. 2017-02-01T00:00:00. All times UTC.");
            }
        }

        if (branchUniversalObjectMap.hasKey("keywords")) {
            ReadableArray keywords = branchUniversalObjectMap.getArray("keywords");
            for (int i=0; i<keywords.size(); ++i) {
                branchUniversalObject.addKeyWord(keywords.getString(i));
            }
        }

        if(branchUniversalObjectMap.hasKey("metadata")) {
            ReadableMap metadataMap = branchUniversalObjectMap.getMap("metadata");
            ReadableMapKeySetIterator iterator = metadataMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String metadataKey = iterator.nextKey();
                Object metadataObject = getReadableMapObjectForKey(metadataMap, metadataKey);
                branchUniversalObject.addContentMetadata(metadataKey, metadataObject.toString());
                HashMap<String, String> metadata = branchUniversalObject.getMetadata();
            }
        }

        if (branchUniversalObjectMap.hasKey("type")) branchUniversalObject.setContentType(branchUniversalObjectMap.getString("type"));

        if (branchUniversalObjectMap.hasKey("contentMetadata")) {
            branchUniversalObject.setContentMetadata(createContentMetadata(branchUniversalObjectMap.getMap("contentMetadata")));
        }

        return branchUniversalObject;
    }

    @Nullable
    public ProductCategory getProductCategory(final String stringValue) {
        ProductCategory[] possibleValues = ProductCategory.class.getEnumConstants();
        for (ProductCategory value: possibleValues) {
            if (stringValue.equals(value.getName())) {
                return value;
            }
        }
        Log.w(REACT_CLASS, "Could not find product category " + stringValue);
        return null;
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
        switch (readableMap.getType(key)) {
            case Null:
                return "Null";
            case Boolean:
                return readableMap.getBoolean(key);
            case Number:
                if (readableMap.getDouble(key) % 1 == 0) {
                    return readableMap.getInt(key);
                } else {
                    return readableMap.getDouble(key);
                }
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

    // Convert an arbitrary ReadableMap to a string-string hash of custom params for userCompletedAction.
    private static HashMap<String, String> convertMapToParams(ReadableMap map) {
        if (map == null) return null;

        HashMap<String, String> hash = new HashMap<>();

        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (map.getType(key)) {
                case String:
                    hash.put(key, map.getString(key));
                case Boolean:
                    hash.put(key, "" + map.getBoolean(key));
                case Number:
                    hash.put(key, "" + map.getDouble(key));
                default:
                    Log.w(REACT_CLASS, "Unsupported data type in params, ignoring");
            }
        }

        return hash;
    }
}
