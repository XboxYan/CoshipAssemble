package com.coship.live.rtmp.model;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.view.Surface;
import android.view.TextureView;


public class RtmpHelper {

    public static  int winWidth = 0; //视频容器的的宽高
    public static  int winHeight = 0; //视频容器的宽高

    public static int videoWidth = 0; //视频的宽
    public static int videoHeight = 0; //视频的高

    public static boolean isFullScreen = false;
    public static boolean isMicOpen = true;
    public static class MyPorocolMode{
        public static final int RTMP = 0;
        public static final int TS = 1;
    }



    public static Handler pushHandler;

    public static Context context;

    public static boolean isBeautiful = false;
    public static TextureView txv_preview;

    public static Surface surface;

    //播放段获取了视频尺寸
    public static final int UPDATE_PLAY_SIZE = 0;
    public static final int PLAY_CONNECT_ERROR = 2;

    //直播段修改屏幕预览尺寸
//    public static final int UPDATE_PREVIEW_SIZE = 5;
    public static final int STATUS_BG_IMAGE_HIDDEN = 0;
    public static final int STATUS_PREPARE = 6;
    public static final int STATUS_MAGIC_VIEW_HIDDEN = 7;
    public static final int PUSH_CONNECT_SUCCESS = 8;
    public static final int PUSH_CONNECT_ERROR = 22;
    public static final int REQUEST_LIVE_STATUS_START_SUCCESS = 9;
    public static final int REQUEST_LIVE_STATUS_START_FAILED = 10;

    public static final int SYS_PLAYER_START_PLAY = 11;
    public static final int SYS_SURFACE_CREATED = 12;

    public static final int CAMERA_OPEN_SUCCESS = 13;//摄像头启动成功
    public static final int CAMERA_OPEN_FAILED = 14; //摄像头启动失败
    public static final int CAMERA_OPEN_SUCCESS_FONT = 15;//前置摄像头开启
    public static final int CAMERA_OPEN_SUCCESS_BACK = 16;//后置摄像头开启

    public static final int RESET_TO_SENSOR = 17;

    public static final int SYS_PLAYER_PLAY_COMPLETION = 18;//一起看一集影片播放结束

    public static final int MOBILE_NET_PLAY = 19;


    public static final int PUSH_HTTP_DISCONNECT = 20;

    public static final int PLAY_UPDATE_ONLINE_NUM = 21;//更新房间在线人数

    public static final int WEEK_NETWORK = 22;
    public static final int WEEK_NETWORK_DIALOG = 23;


    public static final int DELAY_KEY_DWON_RESET = 24;



    public static void postPushMessage(int messageType){
        if(pushHandler!=null) {
            Message message = pushHandler.obtainMessage();
            message.what = messageType;
            pushHandler.sendMessage(message);
        }
    }


}
