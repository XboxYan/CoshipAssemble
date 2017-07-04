//
//  EventEmitter.m
//  RCTVideoIjk
//
//  Created by ninty on 2017/6/23.
//  Copyright © 2017年 coship. All rights reserved.
//

#import "EventEmitter.h"
#import <React/UIView+React.h>

@implementation EventEmitter{
    RCTVideoIjk *_rectView;
    NSNumber *_tag;
}

-(instancetype)initWithView:(RCTVideoIjk *)rectView{
    _rectView = rectView;
    return [super init];
}

-(void)buffer:(BOOL)isBuffer{
    if(_rectView.onVideoBuffer){
        _rectView.onVideoBuffer(@{@"isBuffering": @(isBuffer), @"target": _tag});
    }
}

-(void)load:(IJKFFMoviePlayerController *)_player{
    if(_rectView.onVideoLoad && _player) {
        _rectView.onVideoLoad(@{@"duration": [NSNumber numberWithFloat:_player.duration],
                           @"currentTime": [NSNumber numberWithFloat:_player.currentPlaybackTime],
                           @"canPlayReverse": [NSNumber numberWithBool:YES],
                           @"canPlayFastForward": [NSNumber numberWithBool:YES],
                           @"canPlaySlowForward": [NSNumber numberWithBool:YES],
                           @"canPlaySlowReverse": [NSNumber numberWithBool:YES],
                           @"canStepBackward": [NSNumber numberWithBool:YES],
                           @"canStepForward": [NSNumber numberWithBool:YES],
                           @"naturalSize": @{
                                   @"width": [NSNumber numberWithFloat:_player.naturalSize.width],
                                   @"height": [NSNumber numberWithFloat:_player.naturalSize.height]
                                   },
                           @"target": _tag});
    }
}

-(void)loadStart:(id)source{
    _tag = _rectView.reactTag;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        //Perform on next run loop, otherwise onVideoLoadStart is nil
        if(_rectView.onVideoLoadStart) {
            id uri = [source objectForKey:@"uri"];
            id type = [source objectForKey:@"type"];
            _rectView.onVideoLoadStart(@{@"src": @{
                                            @"uri": uri ? uri : [NSNull null],
                                            @"type": type ? type : [NSNull null],
                                            @"isNetwork": [NSNumber numberWithBool:(bool)[source objectForKey:@"isNetwork"]]},
                                            @"target": _tag
                                            });
        }
    });
}

-(void)progress:(IJKFFMoviePlayerController*)_player{
    if(_rectView.onVideoProgress){
        _rectView.onVideoProgress(@{
                               @"currentTime": [NSNumber numberWithFloat:_player.currentPlaybackTime],
                               @"playableDuration": [NSNumber numberWithFloat:_player.playableDuration],
                               @"target": _tag,
                               });
    }
}

-(void)seek:(IJKFFMoviePlayerController*)_player to:(float)time{
    if(_rectView.onVideoSeek) {
        _rectView.onVideoSeek(@{@"currentTime": [NSNumber numberWithFloat:_player.currentPlaybackTime],
                           @"seekTime": [NSNumber numberWithFloat:time],
                           @"target": _tag});
    }
}

-(void)end{
    if(_rectView.onVideoEnd) {
        _rectView.onVideoEnd(@{@"target": _tag});
    }
}

-(void)error:(NSInteger)reason{
    if(_rectView.onVideoError){
        _rectView.onVideoError(@{@"error": @{@"code": [NSNumber numberWithInteger: reason],
                                             @"domain": @""},
                                 @"target": _tag});
    }
}
@end
