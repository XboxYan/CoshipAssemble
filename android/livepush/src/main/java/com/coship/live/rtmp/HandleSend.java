package com.coship.live.rtmp;

import com.coship.live.rtmp.jni.RtmpJni;
import com.coship.live.rtmp.send.EsData;
import com.coship.live.rtmp.thread.IRunnableHandle;
import com.coship.live.rtmp.thread.LoopThread;
import com.coship.live.util.LogTools;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;


public class HandleSend {
    private static final String TAG = HandleSend.class.getName();
    public final int VIDEO_SOFT = 0;
    public final int AUDIO_SOFT = 1;
    public final int AUDIO_HARD = 4;
    public final int VIDEO_HARD = 3;
    public final int AUDIO_SOFT_ENCODED = 11;
    public final int AUDIO_HARD_ENCODED = 41;

    public final static int VIDEO_TS = 5;
    public final static int AUDIO_TS = 6;

    private long start_time;
    private long curr_time;
    private boolean isFirst = true;
    private static HandleSend instance;

    private final int SEND_BUFFER_SIZE = 80;
    public ArrayBlockingQueue<EsData> esBuffer = new ArrayBlockingQueue<EsData>(SEND_BUFFER_SIZE);

    public static HandleSend getInstance() {
        if (instance == null) {
            instance = new HandleSend();
        }
        return instance;
    }

    private LoopThread sendThread;
    private EsData sendTsData;

    public void startSendThread() {
        esBuffer.clear();
        sendThread = new LoopThread(new IRunnableHandle() {
            @Override
            public void runFunction() {
                if (esBuffer.size() > 0) {
                    try {
                        sendTsData = esBuffer.poll(100, TimeUnit.MILLISECONDS );
                        //sendTsData = videoBuffer.poll();
                        if (sendTsData != null) {
                            if (sendTsData.isVideo()) {
                                //LogTools.d(TAG, "video:" + sendTsData.getTime() + ":" + System.currentTimeMillis());
                                RtmpJni.getInstance().pushDataMux(sendTsData.getData(), sendTsData.getTime(), sendTsData.getFrameType());
                            } else if (sendTsData.isAudio()) {
                                //LogTools.d(TAG, "audio:" + sendTsData.getTime() + ":" + System.currentTimeMillis());
                                RtmpJni.getInstance().pushDataMux(sendTsData.getData(), sendTsData.getTime(), sendTsData.getFrameType());
                            }
                            sendTsData.destory();
                        }

                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        });
        sendThread.start();
    }


    long start;

    public synchronized void handleData(byte[] data, int type) {
        if (isFirst) {
            start_time = System.currentTimeMillis();
            isFirst = false;
        }
        curr_time = System.currentTimeMillis() - start_time;

        //限制发送的帧数。
        if (type == VIDEO_SOFT) {
            RtmpJni.getInstance().updateVideoSoft(data, data.length, curr_time);
        } else if (type == AUDIO_SOFT) {
            RtmpJni.getInstance().updateAudioSoft(data, data.length, curr_time, 0);
        } else if (type == VIDEO_HARD) {
            RtmpJni.getInstance().updateVideoHard(data, data.length, curr_time);
        } else if (type == AUDIO_HARD) {
            RtmpJni.getInstance().updateAudioHard(data, data.length, curr_time, 0);
        } else if (type == AUDIO_HARD_ENCODED) {
            RtmpJni.getInstance().updateAudioHard(data, data.length, curr_time, 1);
        } else if (type == AUDIO_SOFT_ENCODED) {
            RtmpJni.getInstance().updateAudioSoft(data, data.length, curr_time, 1);
        } else if (type == VIDEO_TS) {
            RtmpJni.getInstance().pushDataMux(data, curr_time, 1);
        }
    }
    public void stop(){
        esBuffer.clear();
        if(sendThread!=null){
            sendThread.stop(false);
        }
        isFirst = true;
    }
    public synchronized void handleDataTs(EsData esData) {
        if (isFirst) {
            start_time = System.currentTimeMillis();
            isFirst = false;
        }
        curr_time = System.currentTimeMillis() - start_time;
//        if (curr_time > 90000) {
//            start_time = System.currentTimeMillis();
//            curr_time = 0;
//        }
        esData.setTime(curr_time);
        try {
            if(esBuffer.size()>40&&esData.isVideo()&&esData.isKeyframe()){
                return ;
            }
            boolean result = esBuffer.offer(esData);
            LogTools.e("size:" + esBuffer.size());
            if(!result){
                LogTools.e("drop frame");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
