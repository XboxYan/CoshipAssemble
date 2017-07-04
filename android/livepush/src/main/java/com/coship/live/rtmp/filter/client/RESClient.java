package com.coship.live.rtmp.filter.client;


import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.view.Surface;

import com.coship.live.util.LogTools;
import com.coship.live.rtmp.filter.hardfilter.BaseHardVideoFilter;
import com.coship.live.rtmp.filter.listener.RESConnectionListener;
import com.coship.live.rtmp.filter.listener.RESScreenShotListener;
import com.coship.live.rtmp.filter.model.RESConfig;
import com.coship.live.rtmp.filter.model.RESCoreParameters;
import com.coship.live.rtmp.filter.model.Size;
import com.coship.live.rtmp.filter.resrtmp.RESRtmpSender;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.model.VideoConfig;

/**
 * Created by lake on 16-3-16.
 */
public class RESClient {
    private RESVideoClient videoClient;
//    private RESAudioClient audioClient;
    private final Object SyncOp;
    //parameters
    public RESCoreParameters coreParameters;
    private RESRtmpSender rtmpSender;
    private VideoConfig mVideoConfig;
    public RESClient(VideoConfig videoConfig) {
        SyncOp = new Object();
        mVideoConfig = videoConfig;
        coreParameters = new RESCoreParameters();
        CallbackDelivery.i();
    }

    /**
     * prepare to stream
     * @param resConfig config
     * @return true if prepare success
     */
    public boolean prepare(RESConfig resConfig) {

        synchronized (SyncOp) {
            checkDirection(resConfig);
            coreParameters.filterMode = resConfig.getFilterMode();
//            coreParameters.rtmpAddr = resConfig.getRtmpAddr();
            coreParameters.printDetailMsg = resConfig.isPrintDetailMsg();
            coreParameters.senderQueueLength = 150;
            coreParameters.currentCameraIndex = mVideoConfig.getCurrentCameraIndex();
            videoClient = new RESVideoClient(coreParameters);
//            audioClient = new RESAudioClient(coreParameters);
            if (!videoClient.prepare(resConfig)) {
                LogTools.d("!!!!!videoClient.prepare()failed");
                LogTools.d(coreParameters.toString());
                return false;
            }
//            if (!audioClient.prepare(resConfig)) {
//                LogTools.d("!!!!!audioClient.prepare()failed");
//                LogTools.d(coreParameters.toString());
//                return false;
//            }
            rtmpSender = new RESRtmpSender();
            rtmpSender.prepare(coreParameters);
            coreParameters.done = true;
            LogTools.d("===INFO===coreParametersReady:");
            LogTools.d(coreParameters.toString());
            return true;
        }
    }


    /**
     * start to stream
     */
    public void start() {
        synchronized (SyncOp) {
            rtmpSender.start("");
            videoClient.start();
//            audioClient.start(dataCollecter);
            LogTools.d("RESClient,start()");
        }
    }

    public void previewCamera(){
        synchronized (SyncOp) {
            rtmpSender.start("");
            videoClient.previewCamera();
            LogTools.d("previewCamera");
        }
    }

    public void openFlash(boolean boo){
        synchronized (SyncOp) {
            videoClient.openFlash(boo);
            LogTools.d("flashCamera");
        }

    }

    public void focus() {
        synchronized (SyncOp) {
            videoClient.focus();
        }
    }

    public void startConnect(){
        synchronized (SyncOp) {
            videoClient.startConnect();
            LogTools.d("previewCamera");
        }
    }


    /**
     * stop to stream
     */
    public void stop() {
        synchronized (SyncOp) {
            LogTools.d("RESClient,stop-1");
            videoClient.stop();
            //audioClient.stop();
            LogTools.d("RESClient,stop-2");
            rtmpSender.stop();
            LogTools.d("RESClient,stop-3");
        }
    }

    /**
     * clean up
     */
    public void destroy() {
        synchronized (SyncOp) {
            rtmpSender.destroy();
            videoClient.destroy();
           // audioClient.destroy();
            LogTools.d("RESClient,destroy()");
        }
    }

    /**
     * call it AFTER {@link #prepare(RESConfig)}
     *
     * @param surfaceTexture to rendering preview
     */
    public void createPreview(SurfaceTexture surfaceTexture, int visualWidth, int visualHeight) {
        videoClient.createPreview(surfaceTexture, visualWidth, visualHeight);
        LogTools.d("RESClient,createPreview()");
    }

    public void updatePreview(int visualWidth, int visualHeight) {
        videoClient.updatePreview(visualWidth, visualHeight);
        LogTools.d("RESClient,updatePreview()");
    }

    public void destroyPreview() {
        videoClient.destroyPreview();
        LogTools.d("RESClient,destroyPreview()");
    }

    /**
     * change camera on running.<br/>
     * call it AFTER {@link #start()} & BEFORE {@link #stop()}
     */
    public boolean swapCamera() {
        synchronized (SyncOp) {
            LogTools.d("RESClient,swapCamera()");
            boolean result = videoClient.swapCamera();
            mVideoConfig.setCurrentCameraIndex(videoClient.getCurrentCameraIndex());
            if(videoClient.getCurrentCameraIndex() == Camera.CameraInfo.CAMERA_FACING_BACK){
                RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_SUCCESS_BACK);
            }else{
                RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_SUCCESS_FONT);
            }
            return result;
        }
    }

    public boolean resumeCamera() {
        synchronized (SyncOp) {
            LogTools.d("RESClient,resumeCamera()");
            return videoClient.resumeCamera();
        }
    }
    private int currentRotion = 1;
    public void updateRotion(RESConfig resConfig,int rotation){
        synchronized (SyncOp) {
            if (rotation != currentRotion) {

                int degrees = 0;
                switch (rotation) {
                    case Surface.ROTATION_0:
                        degrees = 0;
                        break;
                    case Surface.ROTATION_90:
                        degrees = 90;
                        break;
                    case Surface.ROTATION_180:
                        degrees = 180;
                        break;
                    case Surface.ROTATION_270:
                        degrees = 270;
                        break;
                }

                int frontDirection,backDirection;
                Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
                Camera.getCameraInfo(Camera.CameraInfo.CAMERA_FACING_FRONT, cameraInfo);
                frontDirection = cameraInfo.orientation;
                Camera.getCameraInfo(Camera.CameraInfo.CAMERA_FACING_BACK, cameraInfo);
                backDirection = cameraInfo.orientation;

                if(degrees == 90) {
                    resConfig.setBackCameraDirectionMode((backDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180));
                    resConfig.setFrontCameraDirectionMode((frontDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0));
                }else{
                    resConfig.setBackCameraDirectionMode((backDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0));
                    resConfig.setFrontCameraDirectionMode((frontDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180));

                }
                currentRotion = rotation;


                checkDirection(resConfig);
                videoClient.updateRotion();


            }



        }

    }

    /**
     * only for soft filter mode.<br/>
     * use it to update filter property.<br/>
//     * call it with {@link #releaseSoftVideoFilter()}<br/>
     * make sure to release it in 3ms
     *
     * @return the videofilter in use
     */
//    public BaseSoftVideoFilter acquireSoftVideoFilter() {
//        return videoClient.acquireSoftVideoFilter();
//    }

//    /**
//     * only for soft filter mode.<br/>
//     * call it with {@link #acquireSoftVideoFilter()}
//     */
//    public void releaseSoftVideoFilter() {
//        videoClient.releaseSoftVideoFilter();
//    }

    public Size getVideoSize() {
        return new Size(coreParameters.videoWidth,coreParameters.videoHeight);
    }

    /**
     * only for soft filter mode.<br/>
     * set videofilter.<br/>
     * can be called Repeatedly.<br/>
     * do NOT call it between {@link #acquireSoftVideoFilter()} & {@link #releaseSoftVideoFilter()}
     *
     * @param baseSoftVideoFilter videofilter to apply
     */
//    public void setSoftVideoFilter(BaseSoftVideoFilter baseSoftVideoFilter) {
//        videoClient.setSoftVideoFilter(baseSoftVideoFilter);
//    }
    /**
     * only for hard filter mode.<br/>
     * use it to update filter property.<br/>
     * call it with {@link #releaseHardVideoFilter()}<br/>
     * make sure to release it in 3ms
     *
     * @return the videofilter in use
     */
    public BaseHardVideoFilter acquireHardVideoFilter() {
        return videoClient.acquireHardVideoFilter();
    }

    /**
     * only for hard filter mode.<br/>
     * call it with {@link #acquireHardVideoFilter()}
     */
    public void releaseHardVideoFilter() {
        videoClient.releaseHardVideoFilter();
    }

    /**
     * only for hard filter mode.<br/>
     * set videofilter.<br/>
     * can be called Repeatedly.<br/>
     * do NOT call it between {@link #acquireHardVideoFilter()} & {@link #acquireHardVideoFilter()}
     *
     * @param baseHardVideoFilter videofilter to apply
     */
    public void setHardVideoFilter(BaseHardVideoFilter baseHardVideoFilter) {
        videoClient.setHardVideoFilter(baseHardVideoFilter);
    }

    /**
     * set audiofilter.<br/>
     * can be called Repeatedly.<br/>
     * do NOT call it between {@link #acquireSoftAudioFilter()} & {@link #releaseSoftAudioFilter()}
     *
     * @param baseSoftAudioFilter audiofilter to apply
     */
//    public void setSoftAudioFilter(BaseSoftAudioFilter baseSoftAudioFilter) {
//        audioClient.setSoftAudioFilter(baseSoftAudioFilter);
//    }
    /**
     * use it to update filter property.<br/>
     * call it with {@link #releaseSoftAudioFilter()}<br/>
     * make sure to release it in 3ms
     *
     * @return the audiofilter in use
     */
//    public BaseSoftAudioFilter acquireSoftAudioFilter() {
//        return audioClient.acquireSoftAudioFilter();
//    }

    /**
     * call it with {@link #acquireSoftAudioFilter()}
     */
//    public void releaseSoftAudioFilter() {
//        audioClient.releaseSoftAudioFilter();
//    }

    /**
     * get video & audio real send Speed
     *
     * @return speed in B/s
     */
    public int getAVSpeed() {
        return rtmpSender==null?0:rtmpSender.getTotalSpeed();
    }

    /**
     * call it AFTER {@link #prepare(RESConfig)}
     *
     * @param connectionListener
     */
    public void setConnectionListener(RESConnectionListener connectionListener) {
        rtmpSender.setConnectionListener(connectionListener);
    }

    /**
     * get the param of video,audio,mediacodec
     *
     * @return info
     */
    public String getConfigInfo() {
        return coreParameters.toString();
    }

    /**
     * set zoom by percent [0.0f,1.0f]
     *
     * @param targetPercent zoompercent
     */
    public boolean setZoomByPercent(float targetPercent) {
        return videoClient.setZoomByPercent(targetPercent);
    }

    /**
     * toggle flash light
     *
     * @return true if operation success
     */
    public boolean toggleFlashLight() {
        return videoClient.toggleFlashLight();
    }

    public void takeScreenShot(RESScreenShotListener listener) {
        videoClient.takeScreenShot(listener);
    }

    /**
     * =====================PRIVATE=================
     **/
    private void checkDirection(RESConfig resConfig) {
        int frontFlag = resConfig.getFrontCameraDirectionMode();
        int backFlag = resConfig.getBackCameraDirectionMode();
        int fbit = 0;
        int bbit = 0;
        if ((frontFlag >> 4) == 0) {
            frontFlag |= RESCoreParameters.FLAG_DIRECTION_ROATATION_0;
        }
        if ((backFlag >> 4) == 0) {
            backFlag |= RESCoreParameters.FLAG_DIRECTION_ROATATION_0;
        }
        for (int i = 4; i <= 8; ++i) {
            if (((frontFlag >> i) & 0x1) == 1) {
                fbit++;
            }
            if (((backFlag >> i) & 0x1) == 1) {
                bbit++;
            }
        }
        if (fbit != 1 || bbit != 1) {
            throw new RuntimeException("invalid direction rotation flag:frontFlagNum=" + fbit + ",backFlagNum=" + bbit);
        }
        if (((frontFlag & RESCoreParameters.FLAG_DIRECTION_ROATATION_0) != 0) || ((frontFlag & RESCoreParameters.FLAG_DIRECTION_ROATATION_180) != 0)) {
            fbit = 0;
        } else {
            fbit = 1;
        }
        if (((backFlag & RESCoreParameters.FLAG_DIRECTION_ROATATION_0) != 0) || ((backFlag & RESCoreParameters.FLAG_DIRECTION_ROATATION_180) != 0)) {
            bbit = 0;
        } else {
            bbit = 1;
        }
        if (bbit != fbit) {
            if (bbit == 0) {
                throw new RuntimeException("invalid direction rotation flag:back camera is landscape but front camera is portrait");
            } else {
                throw new RuntimeException("invalid direction rotation flag:back camera is portrait but front camera is landscape");
            }
        }
        if (fbit == 1) {
            coreParameters.isPortrait = true;
        } else {
            coreParameters.isPortrait = false;
        }
        coreParameters.backCameraDirectionMode = backFlag;
        coreParameters.frontCameraDirectionMode = frontFlag;
    }

//    static {
//        System.loadLibrary("restreaming");
//    }
}
