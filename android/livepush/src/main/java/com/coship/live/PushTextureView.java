package com.coship.live;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.view.TextureView;

import com.coship.live.rtmp.RtmpMain;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.model.VideoConfig;
import com.coship.live.rtmp.utils.ScreenTools;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.List;

/**
 * Created by 909799 on 2017/6/16.
 */
public class PushTextureView extends TextureView  implements IMessageListener{

    public static final String CAMERA_PREVIEW = "camer_preview";
    public static final String NET_PUSH = "net_push";


    private VideoConfig videoConfig;

    private RtmpMain rtmpMain;

    private String currMode = CAMERA_PREVIEW;

    private Context mContext;

    public PushTextureView(Context context) {
        super(context);
        mContext = context;
        init();
    }


    public PushTextureView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
        init();
    }

    private void init() {


        RtmpHelper.winWidth = ScreenTools.instance(mContext).getScreenWidth();
        RtmpHelper.winHeight = ScreenTools.instance(mContext).getScreenHeight();
        RtmpHelper.isMicOpen = true;



        RtmpHelper.pushHandler = pushHandler;

        setListener(this);

    }

    public void config(String bitrate,String bitrateName,String fps,String resolution){
        videoConfig = new VideoConfig(bitrate,bitrate,fps,resolution);
    }

    private Handler pushHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            if(backMessage!=null){
                backMessage.onMessage(msg.what);
            }
        }

    };
    private IMessageListener backMessage;
    public void setListener(IMessageListener tlistener){
        backMessage = tlistener;
    }

    public void setMode(String mode){
        currMode = mode;
    }

    public void onResume() {



        if (currMode.equals(NET_PUSH)) {
            resumeConnect();
        } else if (currMode.equals(CAMERA_PREVIEW)) {
            startPreview();
        }

    }
    public void resumeConnect() {

        new Thread(new Runnable() {
            @Override
            public void run() {
                if (rtmpMain != null) {
                    currMode = NET_PUSH;
                    rtmpMain.startPreview(RtmpMain.PushMode.MAGIC, videoConfig);
                    rtmpMain.startConnect(null);
                }
            }
        }).start();

    }


    /**
     * 开始直播预览
     */

    public void startPreview(String bitrate,String bitrateName,String fps,String resolution) {

        videoConfig = new VideoConfig(bitrate,bitrate,fps,resolution);
        setKeepScreenOn(true);
        RtmpHelper.context = mContext;
        RtmpHelper.txv_preview = this;

        new Thread(new Runnable() {
            @Override
            public void run() {
                rtmpMain = RtmpMain.getInstance();
                rtmpMain.startPreview(RtmpMain.PushMode.MAGIC, videoConfig);
            }
        }).start();


    }

    public void startPreview() {


        setKeepScreenOn(true);
        RtmpHelper.context = mContext;
        RtmpHelper.txv_preview = this;

        new Thread(new Runnable() {
            @Override
            public void run() {
                rtmpMain = RtmpMain.getInstance();
                rtmpMain.startPreview(RtmpMain.PushMode.MAGIC, videoConfig);
            }
        }).start();


    }


    public void changeCamera() {
        if(rtmpMain!=null) {
            rtmpMain.changeCamera();
        }

    }

    public void openFlash(boolean boo){
        if(rtmpMain!=null) {
            rtmpMain.openFlash(boo);
        }
    }

    public void openMagic(boolean boo){
        if(rtmpMain!=null) {
            rtmpMain.openMagic(boo);
        }
    }


    public void resumeCamera() {
        if(rtmpMain!=null) {
            rtmpMain.resumeCamera();
        }

    }

    public void focus(){
        if(rtmpMain!=null) {
            rtmpMain.focus();
        }
    }
    public void updateRotion(int rotation){
        if(rtmpMain!=null) {
            rtmpMain.updateRotion(rotation);
        }
    }


    public void startConnect(final String url){
        new Thread(new Runnable() {
            @Override
            public void run() {
                if(rtmpMain != null){
                    currMode = NET_PUSH;
                    rtmpMain.startConnect(url);
                }
            }
        }).start();

    }

    public void stopPush() {
        if (rtmpMain != null) {
            rtmpMain.stop();
        }

        //workHandler.changeLiveStatus(false);
    }


    public void pausePush(){
        if (rtmpMain != null) {
            rtmpMain.stop();
        }
    }


    @Override
    public void onMessage(int message) {
        WritableMap event = Arguments.createMap();
        event.putInt("what",message);

        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "onPushMessage",
                event
        );
    }
}
