//
//  RCTVideoIjk.m
//  RCTVideoIjk
//
//  Created by ninty on 2017/6/22.
//  Copyright © 2017年 coship. All rights reserved.
//

#import <React/RCTConvert.h>
#import "RCTVideoIjk.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "EventEmitter.h"

@implementation RCTVideoIjk{
    RCTEventDispatcher *_eventDispatcher;
    EventEmitter *emitter;
    IJKFFMoviePlayerController *_player;
    Float64 _progressUpdateInterval;
    NSTimer *progressTimer;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher {
    if ((self = [super init])) {
        _eventDispatcher = eventDispatcher;
        emitter = [[EventEmitter alloc] initWithView:self];
        _progressUpdateInterval = 500;
    }
    return self;
}

-(void)initProgresstimer{
    dispatch_async(dispatch_get_main_queue(), ^{
        progressTimer = [NSTimer scheduledTimerWithTimeInterval:_progressUpdateInterval*1.0f/1000
                                                     target:self
                                                   selector:@selector(refreshProgress)
                                                   userInfo:nil
                                                    repeats:YES];
    });
}

-(void)refreshProgress{
    [emitter progress:_player];
}

#pragma mark - property
- (void)setSrc:(NSDictionary *)source{
    NSString *uri = [source objectForKey:@"uri"];
    if(!uri || uri.length == 0){
        NSLog(@"The uri is empty");
        return;
    }
    
    if(_player){
        [self removePlayerLayer];
    }
    
    [self installMovieNotificationObservers];
    [self initProgresstimer];
    _player = [[IJKFFMoviePlayerController alloc] init];
    _player.view.autoresizingMask = UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
    _player.view.frame = self.bounds;
    _player.scalingMode = IJKMPMovieScalingModeAspectFit;
    _player.shouldAutoplay = YES;
    
    self.autoresizesSubviews = YES;
    [self addSubview:_player.view];
   
    [_player prepareToPlay:uri];
    
    [emitter loadStart:source];
}

- (void)setResizeMode:(NSString*)mode
{
    if(_player){
        _player.scalingMode = IJKMPMovieScalingModeAspectFit;
    }
}

- (void)setPlayInBackground:(BOOL)playInBackground
{
    if(_player){
        [_player setPauseInBackground:!playInBackground];
    }
}

- (void)setPlayWhenInactive:(BOOL)playWhenInactive
{
    //
}

- (void)setIgnoreSilentSwitch:(NSString *)ignoreSilentSwitch
{
    //
}

- (void)setPaused:(BOOL)paused
{
    if (paused) {
        [_player pause];
    } else {
        [_player play];
    }
}

- (float)getCurrentTime
{
    return _player ? _player.currentPlaybackTime : 0;
}

- (void)setCurrentTime:(float)currentTime
{
    if(_player){
        _player.currentPlaybackTime = currentTime;
    }
}

- (void)setSeek:(float)seekTime
{
    [self setCurrentTime:seekTime];
    if (_player && ![_player isPlaying]) {
        [_player play];
    }
    [emitter seek:_player to:seekTime];
}

- (void)setRate:(float)rate
{
    if(_player){
        _player.playbackRate = rate;
    }
}

- (void)setMuted:(BOOL)muted
{
    [self setVolume:muted?0:1];
}

- (void)setVolume:(float)volume
{
    if(_player){
        _player.playbackVolume = volume;
    }
}


- (void)setRepeat:(BOOL)repeat {
    //
}

- (BOOL)getFullscreen
{
    return NO;
}

- (void)setFullscreen:(BOOL)fullscreen
{
    //
}

- (void)setControls:(BOOL)controls
{
    //
}

- (void)setProgressUpdateInterval:(float)progressUpdateInterval
{
    _progressUpdateInterval = progressUpdateInterval;
}

- (void)removePlayerLayer
{
    [progressTimer invalidate];
    [_player shutdown];
    [_player.view removeFromSuperview];
    [self removeMovieNotificationObservers];
}

#pragma mark Install Movie Notifications

/* Register observers for the various movie object notifications. */
-(void)installMovieNotificationObservers
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(loadStateDidChange:)
                                                 name:IJKMPMoviePlayerLoadStateDidChangeNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayBackDidFinish:)
                                                 name:IJKMPMoviePlayerPlaybackDidFinishNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(mediaIsPreparedToPlayDidChange:)
                                                 name:IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayBackStateDidChange:)
                                                 name:IJKMPMoviePlayerPlaybackStateDidChangeNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillResignActive:)
                                                 name:UIApplicationWillResignActiveNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationDidEnterBackground:)
                                                 name:UIApplicationDidEnterBackgroundNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillEnterForeground:)
                                                 name:UIApplicationWillEnterForegroundNotification
                                               object:nil];
}

#pragma mark - App lifecycle handlers

- (void)applicationWillResignActive:(NSNotification *)notification
{
    if (!_player.isPlaying){
        return;
    }
    
    [_player pause];
}

- (void)applicationDidEnterBackground:(NSNotification *)notification
{
    //
}

- (void)applicationWillEnterForeground:(NSNotification *)notification
{
    if (!_player.isPlaying) {
        [_player play];
    }
}

-(void)removeFromSuperview{
    [self removePlayerLayer];
}

- (void)loadStateDidChange:(NSNotification*)notification
{
    //    MPMovieLoadStateUnknown        = 0,
    //    MPMovieLoadStatePlayable       = 1 << 0,
    //    MPMovieLoadStatePlaythroughOK  = 1 << 1, // Playback will be automatically started in this state when shouldAutoplay is YES
    //    MPMovieLoadStateStalled        = 1 << 2, // Playback will be automatically paused in this state, if started
    
    IJKMPMovieLoadState loadState = _player.loadState;
    
    if ((loadState & IJKMPMovieLoadStatePlaythroughOK) != 0) {
        NSLog(@"loadStateDidChange: IJKMPMovieLoadStatePlaythroughOK: %d\n", (int)loadState);
        [emitter buffer:NO];
    } else if ((loadState & IJKMPMovieLoadStateStalled) != 0) {
        NSLog(@"loadStateDidChange: IJKMPMovieLoadStateStalled: %d\n", (int)loadState);
        [emitter buffer:YES];
    } else if ((loadState & IJKMPMovieLoadStatePlayable) != 0){
        NSLog(@"loadStateDidChange: IJKMPMovieLoadStatePlayable: %d\n", (int)loadState);
        [emitter buffer:NO];
    }else{
        NSLog(@"loadStateDidChange: ???: %d\n", (int)loadState);
    }
}

- (void)moviePlayBackDidFinish:(NSNotification*)notification
{
    //    MPMovieFinishReasonPlaybackEnded,
    //    MPMovieFinishReasonPlaybackError,
    //    MPMovieFinishReasonUserExited
    int reason = [[[notification userInfo] valueForKey:IJKMPMoviePlayerPlaybackDidFinishReasonUserInfoKey] intValue];
    
    switch (reason)
    {
        case IJKMPMovieFinishReasonPlaybackEnded:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonPlaybackEnded: %d\n", reason);
            break;
            
        case IJKMPMovieFinishReasonUserExited:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonUserExited: %d\n", reason);
            break;
            
        case IJKMPMovieFinishReasonPlaybackError:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonPlaybackError: %d\n", reason);
            [emitter error:reason];
            return;
            
        default:
            NSLog(@"playbackPlayBackDidFinish: ???: %d\n", reason);
            break;
    }
    [emitter end];
}

- (void)mediaIsPreparedToPlayDidChange:(NSNotification*)notification
{
    NSLog(@"mediaIsPreparedToPlayDidChange\n");
    [emitter load:_player];
    [emitter buffer:NO];
}

- (void)moviePlayBackStateDidChange:(NSNotification*)notification
{
    //    MPMoviePlaybackStateStopped,
    //    MPMoviePlaybackStatePlaying,
    //    MPMoviePlaybackStatePaused,
    //    MPMoviePlaybackStateInterrupted,
    //    MPMoviePlaybackStateSeekingForward,
    //    MPMoviePlaybackStateSeekingBackward
    
    switch (_player.playbackState)
    {
        case IJKMPMoviePlaybackStateStopped: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: stoped", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStatePlaying: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: playing", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStatePaused: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: paused", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStateInterrupted: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: interrupted", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStateSeekingForward:
        case IJKMPMoviePlaybackStateSeekingBackward: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: seeking", (int)_player.playbackState);
            break;
        }
        default: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: unknown", (int)_player.playbackState);
            break;
        }
    }
}

#pragma mark Remove Movie Notification Handlers

/* Remove the movie notification observers from the movie object. */
-(void)removeMovieNotificationObservers
{
    [[NSNotificationCenter defaultCenter]removeObserver:self name:IJKMPMoviePlayerLoadStateDidChangeNotification object:_player];
    [[NSNotificationCenter defaultCenter]removeObserver:self name:IJKMPMoviePlayerPlaybackDidFinishNotification object:_player];
    [[NSNotificationCenter defaultCenter]removeObserver:self name:IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification object:_player];
    [[NSNotificationCenter defaultCenter]removeObserver:self name:IJKMPMoviePlayerPlaybackStateDidChangeNotification object:_player];
    
    [[NSNotificationCenter defaultCenter]removeObserver:self name:UIApplicationWillResignActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter]removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter]removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
}


@end
