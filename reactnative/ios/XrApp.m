#import "XrApp.h"
#import <ARKit/ARKit.h>

@import RNMagicScript;
@import RNXrClient;

@implementation XrApp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(shareSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
      [RNXrClient registerSession: RCTARView.arSession];
      resolve(@"success");
}

@end
