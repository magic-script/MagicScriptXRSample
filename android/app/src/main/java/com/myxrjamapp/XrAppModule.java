package com.myxrjamapp;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class XrAppModule extends ReactContextBaseJavaModule {

  XrAppModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "XrApp";
  }

  @ReactMethod
  public void shareSession(Promise promise) {
    promise.resolve("success");
  }

  @ReactMethod
  public void setStatusMessage(String message, Promise promise) {
    promise.resolve("success");
  }
}
