package com.coshipassemble.third;

import android.nfc.Tag;
import android.view.TextureView;

import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.IMessageListener;
import com.coship.live.PushTextureView;
import com.coship.live.util.LogTools;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by 909799 on 2017/6/16.
 */
public class VideoViewManager extends SimpleViewManager<PushTextureView> {
    private static final int COMMAND_START_PREV_ID = 1;//开始预览
    private static final String COMMAND_START_PREV_NAME = "startPrev";//开始预览\

    private static final int COMMAND_START_CONNECT_AND_PUSH_ID = 2;//开始连接和推流
    private static final String COMMAND_START_CONNECT_AND_PUSH_NAME = "startConnect";//开始连接和推流

    private static final int COMMAND_STOP_PUSH_ID = 3;//开始连接和推流
    private static final String COMMAND_STOP_PUSH_NAME = "stop";

    private static final int COMMAND_CHANGE_CAMERA_ID = 4;//切换摄像头
    private static final String COMMAND_CHANGE_CAMERA_NAME = "changeCamera";

    private static final int COMMAND_OPEN_FLASH_ID = 5;//打开光灯
    private static final String COMMAND_OPEN_FLASH_NAME = "openFlash";

    private static final int COMMAND_CLOSE_FLASH_ID = 6;//
    private static final String COMMAND_CLOSE_FLASH_NAME = "closeFlash";

    private static final int COMMAND_OPEN_MAGIC_ID = 7;//
    private static final String COMMAND_OPEN_MAGIC_NAME = "openMagic";

    private static final int COMMAND_CLOSE_MAGIC_ID = 8;//
    private static final String COMMAND_CLOSE_MAGIC_NAME = "closeMagic";

    private static final int COMMAND_OPEN_MIC_ID = 9;//
    private static final String COMMAND_OPEN_MIC_NAME = "openMic";

     private static final int COMMAND_CLOSE_MIC_ID = 10;//
    private static final String COMMAND_CLOSE_MIC_NAME = "closeMic";

    @Override
    public String getName() {
        return "PushView";
    }

    @Override
    protected PushTextureView createViewInstance(ThemedReactContext reactContext) {
        PushTextureView view = new PushTextureView(reactContext);
        return view;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {

        Map<String, Integer> map = new HashMap<String,Integer>();
        map.put(COMMAND_START_PREV_NAME,COMMAND_START_PREV_ID);
        map.put(COMMAND_START_CONNECT_AND_PUSH_NAME,COMMAND_START_CONNECT_AND_PUSH_ID);
        map.put(COMMAND_STOP_PUSH_NAME,COMMAND_STOP_PUSH_ID);
        map.put(COMMAND_CHANGE_CAMERA_NAME,COMMAND_CHANGE_CAMERA_ID);
        map.put(COMMAND_OPEN_FLASH_NAME,COMMAND_OPEN_FLASH_ID);
        map.put(COMMAND_CLOSE_FLASH_NAME,COMMAND_CLOSE_FLASH_ID);
        map.put(COMMAND_OPEN_MAGIC_NAME,COMMAND_OPEN_MAGIC_ID);
        map.put(COMMAND_CLOSE_MAGIC_NAME,COMMAND_CLOSE_MAGIC_ID);
        map.put(COMMAND_OPEN_MIC_NAME,COMMAND_OPEN_MIC_ID);
        map.put(COMMAND_CLOSE_MIC_NAME,COMMAND_CLOSE_MIC_ID);
        
        return  map;
    }

    @Override
    public void receiveCommand(PushTextureView root, int commandId, @Nullable ReadableArray args) {
        switch(commandId){
            case COMMAND_START_PREV_ID:
                root.startPreview(args.getString(0),args.getString(1),args.getString(2),args.getString(3));
                break;
            case COMMAND_START_CONNECT_AND_PUSH_ID:
                LogTools.e("args_0:",args.getString(0));
//                LogTools.e("args_1:",args.getString(1));
//                LogTools.e("args_2:",args.getString(2));
                root.startConnect(args.getString(0));
                break;
            case COMMAND_STOP_PUSH_ID:
                root.stopPush();
                break;
            case COMMAND_CHANGE_CAMERA_ID:
                root.changeCamera();
                break;
            case COMMAND_OPEN_FLASH_ID:
                root.openFlash(true);
                break;
            case COMMAND_CLOSE_FLASH_ID:
               root.openFlash(false);
               break;
            case COMMAND_OPEN_MAGIC_ID:
               root.openMagic(true);
               break;
            case COMMAND_CLOSE_MAGIC_ID:
               root.openMagic(false);
               break;
            case COMMAND_OPEN_MIC_ID:
               openMic();
               break;
            case COMMAND_CLOSE_MIC_ID:
               closeMic();
               break;
        }
    }

    public void openMic(){
        RtmpHelper.isMicOpen = true;
    }
    public void closeMic(){
        RtmpHelper.isMicOpen = false;
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onPushMessage", MapBuilder.of("registrationName", "onPushMessage"));
    }

    @ReactProp(name = "source")
    public void setSource(PushTextureView pushView,@Nullable ReadableMap source){
        if(source != null){
            if (source.hasKey("bitrate")) {
                String bitrate = source.getString("bitrate");
                String bitrateName  = source.getString("bitrateName");
                String resolution  = source.getString("resolution");
                String fps = source.getString("fps");

                pushView.config(bitrate,bitrateName,resolution,fps);


            }
        }
    }


}
