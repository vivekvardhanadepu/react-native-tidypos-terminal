package com.reactnativetidyposterminal;

import androidx.annotation.NonNull;
import static android.app.Activity.RESULT_OK;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;

@ReactModule(name = TidyposTerminalModule.NAME)
public class TidyposTerminalModule extends ReactContextBaseJavaModule {
  public static final String NAME = "TidyposTerminal";
  public static final Integer REQUEST_CODE = 100;
  public static final String CREDENTIALS = "credentials";
  public static final String PARAMS = "params";
  private static final String TERMINAL_APP_ID = "com.tidypos.terminal";
  private static final String RESPONSE = "response";

  private final ReactApplicationContext reactContext;
  private Promise intentPromise;

  TidyposTerminalModule(ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private WritableMap toWritableMap(Serializable data){
    HashMap<String, String> map = (HashMap<String, String>) data;
    Iterator iterator = map.entrySet().iterator();
    WritableMap writableMap = Arguments.createMap();
    while(iterator.hasNext()){
      Map.Entry elem
        = (Map.Entry)iterator.next();
      writableMap.putString((String) elem.getKey(), (String) elem.getValue());
    }
    return writableMap;
  }

  private HashMap<String, String> toHashMap(ReadableMap map) {
    HashMap<String, String> hashMap = new HashMap<>();
    ReadableMapKeySetIterator iterator = map.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      hashMap.put(key, map.getString(key));
    }
    return hashMap;
  }

  private void parseParams(String credentials, ReadableMap params, Intent intent){
    intent.putExtra(CREDENTIALS, credentials);
    intent.putExtra(PARAMS, toHashMap(params));
  }

  @ReactMethod
  public void startPayment(String credentials, ReadableMap params, final Promise promise){
    intentPromise = promise;
    Intent intent = this.reactContext.getPackageManager().getLaunchIntentForPackage(TERMINAL_APP_ID);

    if(intent == null){
      intentPromise.reject("Failed", "tidypos terminal app not found");
      return;
    }

    try {
      parseParams(credentials, params, intent);
    } catch(Exception e){
      intentPromise.reject("Failed", "params parsing error");
      return;
    }

    intent.setFlags(0);

    try {
      this.reactContext.startActivityForResult(intent, REQUEST_CODE, null);
    } catch (Exception e) {
      intentPromise.reject("Failed", "NO APP FOUND");
    }
  }

  @ReactMethod
  public void test(ReadableMap params, final Promise promise){
    Intent intent = this.reactContext.getPackageManager().getLaunchIntentForPackage("com.google.android.gm");
    if(intent == null){
      promise.reject("no app found","");
      return ;
    }
    try {
      parseParams("whatever", params, intent);
    } catch(Exception e){
      promise.reject("params parsing error", e);
      return;
    }
    System.out.println(intent);
    intent.putExtra("whatever", "data");
    promise.resolve(toWritableMap(intent.getSerializableExtra("params")));
  }

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      super.onActivityResult(activity, requestCode, resultCode, intent);

      if (intentPromise != null) {
        if (requestCode == REQUEST_CODE) {
          if (resultCode == RESULT_OK) {
            intentPromise.resolve(toWritableMap(intent.getSerializableExtra(RESPONSE)));
          }else{
            intentPromise.reject("failed", "payment failed");
          }
        }
      }
    }
  };
}
