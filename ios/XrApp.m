//
//  XrApp.m
//  MagicScriptXRSample
//
//  Created by Nikolay Grozdanov on 11/16/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "XrApp.h"
#import <ARKit/ARKit.h>

@import RNMagicScript;
@import RNXrClient;

@implementation XrApp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(shareSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [XrClientBridge registerARSession: RCTARView.arSession];
    resolve(@"success");
}

@end
