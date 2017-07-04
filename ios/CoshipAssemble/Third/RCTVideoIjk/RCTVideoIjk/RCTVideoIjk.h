//
//  RCTVideoIjk.h
//  RCTVideoIjk
//
//  Created by ninty on 2017/6/22.
//  Copyright © 2017年 coship. All rights reserved.
//

#import <React/RCTView.h>
#import <IJKMediaFramework/IJKMediaFramework.h>

@class RCTEventDispatcher;


@interface RCTVideoIjk : UIView

@property (nonatomic, copy) RCTBubblingEventBlock onVideoLoadStart;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoBuffer;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoError;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoProgress;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoSeek;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoEnd;
@property (nonatomic, copy) RCTBubblingEventBlock onTimedMetadata;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerWillPresent;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerDidPresent;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerWillDismiss;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerDidDismiss;
@property (nonatomic, copy) RCTBubblingEventBlock onReadyForDisplay;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackStalled;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackResume;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackRateChange;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

@end
