package com.coship.live.rtmp;

import com.coship.live.rtmp.filter.streamAgent.HardStreamingAgent;
import com.coship.live.rtmp.jni.RtmpJni;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.model.VideoConfig;
import com.coship.live.rtmp.proxy.HardEncoderDataProxy;
import com.coship.live.rtmp.proxy.ICallBack;
import com.coship.live.rtmp.proxy.IDataBack;
import com.coship.live.rtmp.thread.LoopThread;
import com.coship.live.util.LogTools;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class HardEncoderAgentMagic extends BaseAgent implements ICallBack {
    private static final String TAG = HardEncoderAgentMagic.class.getName();

    private MicCore micCore;

    private IDataBack dataBack;
    private LoopThread heartThread;
    private Timer timer;
    private boolean stopFlag = false;
    private boolean isFinishStart = true;
    private int status = 0; //0:默认 1:start 2:pause 3:stop
    private HardStreamingAgent agent;
    private boolean connect_sucess = true;
    private VideoConfig videoConfig;

    public void configure(VideoConfig videoConfig){

        this.videoConfig = videoConfig;
        status = 0;
    }

    @Override
    public void previewCamera() {

        agent  = new HardStreamingAgent(RtmpHelper.txv_preview, RtmpHelper.context,videoConfig);
        agent.previewCamera();

        RtmpHelper.postPushMessage(RtmpHelper.STATUS_BG_IMAGE_HIDDEN);

    }


    @Override
    public void startConnect(String url) {

        status = 1;
        stopFlag = false;
        isFinishStart = false;
        connect_sucess = true;

        HandleSend.getInstance().startSendThread();

        dataBack = new HardEncoderDataProxy(this);

        RtmpJni.getInstance().dataProxy = dataBack;

        int ret = 0;

        String[] urls = url.split("[?]");
        //内网写死的地址
        //ret = RtmpJni.getInstance().connectTsServer("http://10.9.220.16:9092/12");
        //外网写死地址
        //ret = RtmpJni.getInstance().connectTsServer("http://10.9.219.8:9001/100?fps="+videoConfig.getFramerate()+"&resulution="+videoConfig.getCurrSize().getWidth()+"*"+videoConfig.getCurrSize().getHeight());
        //实际传入地址
        ret = RtmpJni.getInstance().connectTsServer(urls[0]);


        if(ret == -110){
            LogTools.e(TAG, "重连中点击返回了，退出重连");
            return;
        }else if(ret == -111){
            LogTools.e(TAG,"暂停状态下，不用再重连");
            return;

        }else if(ret<0){
            //连接失败，需要页面处理
            LogTools.e(TAG, "初始化报错");
            isFinishStart = true;
            RtmpHelper.postPushMessage(RtmpHelper.PUSH_CONNECT_ERROR);
            connect_sucess = false;

            return ;
        }

        if(micCore == null){
            micCore = new MicCore();
        }
        agent.startConnect();

        RtmpHelper.postPushMessage(RtmpHelper.PUSH_CONNECT_SUCCESS);

        micCore.start(true);
        //这种模式下，不需要上传机器设备信息

        if(timer == null){
            timer = new Timer();
        }


        //心跳监测连接状态
        if (timer != null) {
            timer.cancel();
        }
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                int ret = RtmpJni.getInstance().httpStatus();
                if (ret <= 0) {
                    //连接断开了 重连
                    RtmpHelper.postPushMessage(RtmpHelper.PUSH_HTTP_DISCONNECT);
                    timer.cancel();
                }
            }
        }, 4000, 1000);
        isFinishStart = true;
    }


    private void stopRtmp(){

        if(timer != null) {
            timer.cancel();
        }
        timer = null;

//		if(cameraCore != null) {
//			cameraCore.stop();
//		}
        if(micCore != null) {
            micCore.stop();
        }

//		if(avcCodec!= null){
//			avcCodec.stop();
//		}
//		avcCodec = null;

        RtmpJni.getInstance().dataProxy = null;
        dataBack = null;
        //closed rtmp
//		while(!isFinishStart){
//			//如果启动方法还未完成，等待启动方法完成
//		}

        RtmpJni.getInstance().closeTs();

    }

    @Override
    public void stop() {
        LogTools.i(TAG,"stop-1");
        if(agent!=null){
           agent.destory();
        }
        LogTools.i(TAG,"stop-2");
        agent = null;
        status = 3;
        stopFlag = true;
        HandleSend.getInstance().stop();
        this.stopRtmp();
    }

    @Override
    public void pause() {
        status = 2;
        this.stopRtmp();
    }

    @Override
    public void callBack(int type) {
           /***此段不会被执行，去掉,后面优化代码可以去掉**/
//        LiveHelper.startLiveState(LiveHelper.STATUS.DONE);
//        System.out.print("rtmp CONNECT");
//        LogTools.e("SOFT_DECODER","推流过程中，连接断开了");
//        stop();
    }


    @Override
    public void openFlash(boolean boo){
        agent.openFlash(boo);
    }

    @Override
    public void openMagic(boolean boo){
        agent.openMagic(boo);
    }



    @Override
    public void changeCamera() {
        if(agent!=null){
            if(isFinishStart) {
                agent.swapCamea();
            }
        }
    }

    @Override
    public void focus() {
        if(agent!=null){
            if(isFinishStart) {
                agent.focus();
            }
        }
    }

    @Override
    public void resumeCamera() {
//        if(agent!=null){
//            agent.resumeCamera();
//        }
    }
    public void updateRotion(int rotation){
        if(agent!=null) {
            agent.updateRotion(rotation);
        }
    }

}
