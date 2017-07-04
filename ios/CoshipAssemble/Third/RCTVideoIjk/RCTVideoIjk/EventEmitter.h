//
//  EventEmitter.h
//  RCTVideoIjk
//
//  Created by ninty on 2017/6/23.
//  Copyright © 2017年 coship. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTVideoIjk.h"
@import UIKit;

@interface EventEmitter : NSObject

-(instancetype)initWithView:(RCTVideoIjk*)reactView;

-(void)buffer:(BOOL)isBuffer;

-(void)load:(IJKFFMoviePlayerController *)_player;

-(void)loadStart:(id)source;

-(void)progress:(IJKFFMoviePlayerController*)_player;

-(void)seek:(IJKFFMoviePlayerController*)_player to:(float)time;

-(void)end;

-(void)error:(NSInteger)reason;

@end
