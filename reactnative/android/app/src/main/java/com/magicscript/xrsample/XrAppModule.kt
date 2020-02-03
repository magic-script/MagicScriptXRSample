package com.magicscriptxrsample

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class XrAppModule internal constructor(context: ReactApplicationContext?) : ReactContextBaseJavaModule(context!!) {
    override fun getName(): String {
        return "XrApp"
    }

    @ReactMethod
    fun shareSession(promise: Promise) {
        promise.resolve("success")
    }
}
