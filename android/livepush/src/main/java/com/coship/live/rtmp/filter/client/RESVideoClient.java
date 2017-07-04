package com.coship.live.rtmp.filter.client;

import android.graphics.SurfaceTexture;
import android.hardware.Camera;

import com.coship.live.util.LogTools;
import com.coship.live.rtmp.filter.core.CameraHelper;
import com.coship.live.rtmp.filter.core.RESHardVideoCore;
import com.coship.live.rtmp.filter.core.RESVideoCore;
import com.coship.live.rtmp.filter.hardfilter.BaseHardVideoFilter;
import com.coship.live.rtmp.filter.listener.RESScreenShotListener;
import com.coship.live.rtmp.filter.model.RESConfig;
import com.coship.live.rtmp.filter.model.RESCoreParameters;
import com.coship.live.rtmp.model.RtmpHelper;

import java.io.IOException;
import java.util.List;


/**
 * Created by lake on 16-5-24.
 */
public class RESVideoClient {
    RESCoreParameters resCoreParameters;
    private Camera camera;
    private SurfaceTexture camTexture;
    private int cameraNum;


    private int currentCameraIndex;
    private RESVideoCore videoCore;

    public RESVideoClient(RESCoreParameters parameters) {
        resCoreParameters = parameters;
        cameraNum = Camera.getNumberOfCameras();
        currentCameraIndex = resCoreParameters.currentCameraIndex;

    }

    public int getCurrentCameraIndex() {
        return currentCameraIndex;
    }

    public boolean prepare(RESConfig resConfig) {
        if (currentCameraIndex >= cameraNum) {
            currentCameraIndex = resConfig.getDefaultCamera();
        }
        if (null == (camera = createCamera(currentCameraIndex))) {
            LogTools.e("can not open camera");
            return false;
        }
        Camera.Parameters parameters = camera.getParameters();
        CameraHelper.selectCameraPreviewWH(parameters, resCoreParameters, resConfig.getTargetVideoSize());
        if (resCoreParameters.isPortrait) {
            resCoreParameters.videoHeight = resCoreParameters.previewVideoWidth;
            resCoreParameters.videoWidth = resCoreParameters.previewVideoHeight;
        } else {
            resCoreParameters.videoWidth = resCoreParameters.previewVideoWidth;
            resCoreParameters.videoHeight = resCoreParameters.previewVideoHeight;
        }


        CameraHelper.selectCameraFpsRange(parameters, resCoreParameters);
        if (!CameraHelper.selectCameraColorFormat(parameters, resCoreParameters)) {
            LogTools.e("CameraHelper.selectCameraColorFormat,Failed");
            resCoreParameters.dump();
            return false;
        }
        if (!CameraHelper.configCamera(camera, resCoreParameters)) {
            LogTools.e("CameraHelper.configCamera,Failed");
            resCoreParameters.dump();
            return false;
        }
        switch (resCoreParameters.filterMode) {
            case RESCoreParameters.FILTER_MODE_SOFT:
                //videoCore = new RESSoftVideoCore(resCoreParameters);
                break;
            case RESCoreParameters.FILTER_MODE_HARD:
                videoCore = new RESHardVideoCore(resCoreParameters);
                break;
        }
        videoCore.setCurrentCamera(currentCameraIndex);
        if (!videoCore.prepare(resConfig)) {
            return false;
        }
        prepareVideo();
        return true;
    }

    private Camera createCamera(int cameraId) {
        try {
            camera = Camera.open(cameraId);
        } catch (SecurityException e) {
            LogTools.trace("no permission", e);
            return null;
        } catch (Exception e) {
            LogTools.trace("camera.open()failed", e);
            return null;
        }
        return camera;
    }

    private boolean prepareVideo() {
        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_SOFT) {
            camera.addCallbackBuffer(new byte[resCoreParameters.previewBufferSize]);
            camera.addCallbackBuffer(new byte[resCoreParameters.previewBufferSize]);
        }
        return true;
    }

    private boolean startVideo() {
        camTexture = new SurfaceTexture(RESVideoCore.OVERWATCH_TEXTURE_ID);
        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_SOFT) {
//            camera.setPreviewCallbackWithBuffer(new Camera.PreviewCallback() {
//                @Override
//                public void onPreviewFrame(byte[] data, Camera camera) {
//                    if (videoCore != null && data != null) {
//                        ((RESSoftVideoCore) videoCore).queueVideo(data);
//                    }
//                    camera.addCallbackBuffer(data);
//                }
//            });
        } else {
            camTexture.setOnFrameAvailableListener(new SurfaceTexture.OnFrameAvailableListener() {
                @Override
                public void onFrameAvailable(SurfaceTexture surfaceTexture) {
                    ((RESHardVideoCore) videoCore).onFrameAvailable();
                }
            });
        }
        try {
            camera.setPreviewTexture(camTexture);
        } catch (IOException e) {
            LogTools.trace(e);
            camera.release();
            return false;
        }
        camera.startPreview();
        return true;
    }

    public boolean start() {
        if (!startVideo()) {
            resCoreParameters.dump();
            LogTools.e("RESVideoClient,start(),failed");
            return false;
        }
        videoCore.start(camTexture);
        flushCamera();
        return true;
    }
    public boolean previewCamera(){
        if (!startVideo()) {
            resCoreParameters.dump();
            LogTools.e("RESVideoClient,start(),failed");
            RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_FAILED);
            return false;
        }
        RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_SUCCESS);
        if(currentCameraIndex == Camera.CameraInfo.CAMERA_FACING_BACK){
            RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_SUCCESS_BACK);
        }else{
            RtmpHelper.postPushMessage(RtmpHelper.CAMERA_OPEN_SUCCESS_FONT);
        }

        videoCore.previewCamera(camTexture);
        return true;
    }
    public boolean startConnect(){
        videoCore.startConnect(camTexture);
        flushCamera();
        return true;
    }


    public boolean stop() {
        LogTools.e("RESVideoClient","stop-1");
        videoCore.stop();
        if(camTexture != null) {
            camTexture.release();
        }
        LogTools.e("RESVideoClient","stop-2");
        camera.stopPreview();
        LogTools.e("RESVideoClient", "stop-3");
        return true;
    }

    public boolean destroy() {
        camera.release();
        videoCore.destroy();
        return true;
    }

    public void createPreview(SurfaceTexture surfaceTexture, int visualWidth, int visualHeight) {
        videoCore.createPreview(surfaceTexture, visualWidth, visualHeight);
    }

    public void updatePreview(int visualWidth, int visualHeight) {
        if(videoCore!=null) {
            videoCore.updatePreview(visualWidth, visualHeight);
        }
    }

    public void destroyPreview() {
        videoCore.destroyPreview();
    }

    public boolean swapCamera() {
        LogTools.d("RESClient,swapCamera()");
        if(camera == null){
            return false;
        }
        camera.setPreviewCallback(null);
        camera.stopPreview();
        camera.release();
        if (null == (camera = createCamera(currentCameraIndex = (++currentCameraIndex) % cameraNum))) {
            LogTools.e("can not swap camera");
            return false;
        }
        videoCore.setCurrentCamera(currentCameraIndex);
        if(!CameraHelper.configCamera(camera, resCoreParameters)){
            return false;
        }
        prepareVideo();
        camTexture.release();
        videoCore.updateCamTexture(null);
        startVideo();
        if(camTexture != null) {
            videoCore.updateCamTexture(camTexture);
        }

        return true;
    }
    private int currentRotion = 1;

    public void openFlash(boolean boo){
        if(currentCameraIndex == Camera.CameraInfo.CAMERA_FACING_BACK){
            if(camera != null){

                Camera.Parameters parameters = camera.getParameters();
                if(boo) {
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                }else{
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                }
                camera.setParameters(parameters);
            }

        }

    }
    public void focus(){
        if(camera != null){
            try {
                camera.autoFocus(null);
            } catch (Exception e) {
            }
        }
    }

    private boolean flushCamera() {
        LogTools.d("RESClient,swapCamera()");

        videoCore.updateCamTexture(null);
        camTexture.release();

        camera.stopPreview();
        camera.release();
        if (null == (camera = createCamera(currentCameraIndex))) {
            LogTools.e("can not swap camera");
            return false;
        }
        videoCore.setCurrentCamera(currentCameraIndex);
        CameraHelper.configCamera(camera, resCoreParameters);
        prepareVideo();
        camTexture.release();
        videoCore.updateCamTexture(null);
        startVideo();
        videoCore.updateCamTexture(camTexture);
        return true;
    }


    public void updateRotion(){
        videoCore.setCurrentCamera(currentCameraIndex);
    }

    public boolean resumeCamera() {
        LogTools.d("RESClient,swapCamera()");
        camera.stopPreview();
        camera.release();
        if (null == (camera = createCamera(currentCameraIndex = (++currentCameraIndex) % cameraNum))) {
            LogTools.e("can not swap camera");
            return false;
        }
        videoCore.setCurrentCamera(currentCameraIndex);
        CameraHelper.configCamera(camera, resCoreParameters);
        prepareVideo();
        camTexture.release();
        videoCore.updateCamTexture(null);
        startVideo();
        videoCore.updateCamTexture(camTexture);
        return true;
    }

    public boolean toggleFlashLight() {
        try {
            Camera.Parameters parameters = camera.getParameters();
            List<String> flashModes = parameters.getSupportedFlashModes();
            String flashMode = parameters.getFlashMode();
            if (!Camera.Parameters.FLASH_MODE_TORCH.equals(flashMode)) {
                if (flashModes.contains(Camera.Parameters.FLASH_MODE_TORCH)) {
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                    camera.setParameters(parameters);
                    return true;
                }
            } else if (!Camera.Parameters.FLASH_MODE_OFF.equals(flashMode)) {
                if (flashModes.contains(Camera.Parameters.FLASH_MODE_OFF)) {
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                    camera.setParameters(parameters);
                    return true;
                }
            }
        } catch (Exception e) {
            LogTools.d("toggleFlashLight,failed" + e.getMessage());
            return false;
        }
        return false;
    }

    public boolean setZoomByPercent(float targetPercent) {
        targetPercent = Math.min(Math.max(0f, targetPercent), 1f);
        Camera.Parameters p = camera.getParameters();
        p.setZoom((int) (p.getMaxZoom() * targetPercent));
        camera.setParameters(p);
        return true;
    }

//    public BaseSoftVideoFilter acquireSoftVideoFilter() {
//        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_SOFT) {
//            return ((RESSoftVideoCore) videoCore).acquireVideoFilter();
//        }
//        return null;
//    }

//    public void releaseSoftVideoFilter() {
//        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_SOFT) {
//            ((RESSoftVideoCore) videoCore).releaseVideoFilter();
//        }
//    }
//
//    public void setSoftVideoFilter(BaseSoftVideoFilter baseSoftVideoFilter) {
//        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_SOFT) {
//            ((RESSoftVideoCore) videoCore).setVideoFilter(baseSoftVideoFilter);
//        }
//    }
    public BaseHardVideoFilter acquireHardVideoFilter() {
        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_HARD) {
            return ((RESHardVideoCore) videoCore).acquireVideoFilter();
        }
        return null;
    }

    public void releaseHardVideoFilter() {
        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_HARD) {
            ((RESHardVideoCore) videoCore).releaseVideoFilter();
        }
    }

    public void setHardVideoFilter(BaseHardVideoFilter baseHardVideoFilter) {
        if (resCoreParameters.filterMode == RESCoreParameters.FILTER_MODE_HARD) {
            ((RESHardVideoCore) videoCore).setVideoFilter(baseHardVideoFilter);
        }
    }

    public void takeScreenShot(RESScreenShotListener listener) {
        videoCore.takeScreenShot(listener);
    }
}
