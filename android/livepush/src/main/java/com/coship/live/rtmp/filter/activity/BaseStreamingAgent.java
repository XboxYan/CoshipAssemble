package com.coship.live.rtmp.filter.activity;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.view.TextureView;

import com.coship.live.util.LogTools;
import com.coship.live.rtmp.filter.client.RESClient;
import com.coship.live.rtmp.filter.listener.RESConnectionListener;
import com.coship.live.rtmp.filter.model.RESConfig;
import com.coship.live.rtmp.filter.model.Size;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.model.VideoConfig;


/**
 * Created by gp on 2016/6/29.
 */
public class BaseStreamingAgent implements RESConnectionListener,TextureView.SurfaceTextureListener{

    private static final String TAG = "RES";
    public static final String DIRECTION = "direction";
    public static final String RTMPADDR = "rtmpaddr";
    protected RESClient resClient;
    protected boolean started;
    protected String rtmpaddr = "";
    // protected String rtmpaddr = "rtmp://52.28.189.254/live/livestream";
    protected RESConfig resConfig;
    protected int filtermode = RESConfig.FilterMode.HARD;
    protected  TextureView txv_preview;
    protected Context context;
    private boolean isCompletePrepare;
    protected VideoConfig mVideoConfig;
    public BaseStreamingAgent(TextureView txv_preview,Context context,VideoConfig videoConfig){
        this.txv_preview = txv_preview;
        this.mVideoConfig = videoConfig;
        this.context = context;
        this.run();
    }

    public void run() {
//        Intent i = getIntent();
//        if (i.getBooleanExtra(DIRECTION, false)) {
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
//        } else {
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
//        }
//        if (i.getStringExtra(RTMPADDR) != null && !i.getStringExtra(RTMPADDR).isEmpty()) {
//            rtmpaddr = i.getStringExtra(RTMPADDR);
//        }
        started = false;
        isInitView = false;

        this.txv_preview = txv_preview;
        txv_preview.setSurfaceTextureListener(this);
        resClient = new RESClient(mVideoConfig);

        resConfig = RESConfig.obtain();
        resConfig.setFilterMode(filtermode);
//        mVideoConfig.setCurrSize(1280,720);
        resConfig.setTargetVideoSize(new Size(mVideoConfig.getCurrSize().getWidth(), mVideoConfig.getCurrSize().getHeight()));

        resConfig.setBitRate(mVideoConfig.getBitrate());
        resConfig.setFrameRate(mVideoConfig.getFramerate());
        resConfig.setRenderingMode(RESConfig.RenderingMode.OpenGLES);
        resConfig.setDefaultCamera(Camera.CameraInfo.CAMERA_FACING_BACK);

        int frontDirection,backDirection;
        Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
        Camera.getCameraInfo(Camera.CameraInfo.CAMERA_FACING_FRONT, cameraInfo);
        frontDirection = cameraInfo.orientation;
        Camera.getCameraInfo(Camera.CameraInfo.CAMERA_FACING_BACK, cameraInfo);
        backDirection = cameraInfo.orientation;
        if (context.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) {
            resConfig.setFrontCameraDirectionMode((frontDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_270 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_90) | RESConfig.DirectionMode.FLAG_DIRECTION_FLIP_HORIZONTAL| RESConfig.DirectionMode.FLAG_DIRECTION_FLIP_VERTICAL);
            resConfig.setBackCameraDirectionMode((backDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_90 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_270));
        } else {

//            resConfig.setBackCameraDirectionMode((backDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180));
//            resConfig.setFrontCameraDirectionMode((frontDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0) | RESConfig.DirectionMode.FLAG_DIRECTION_FLIP_HORIZONTAL);

            resConfig.setBackCameraDirectionMode((backDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180));
            resConfig.setFrontCameraDirectionMode((frontDirection == 90 ? RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_180 : RESConfig.DirectionMode.FLAG_DIRECTION_ROATATION_0));
        }
        if (!resClient.prepare(resConfig)) {
            resClient = null;
            LogTools.e(TAG, "prepare,failed!!");
            return;
        }

        double screen_rat = (double) RtmpHelper.winWidth / (double) RtmpHelper.winHeight;
        double video_rat = (double)resClient.coreParameters.videoWidth/resClient.coreParameters.videoHeight;
        int visualWidth = 0;
        int visualHeitht = 0;
        if(screen_rat>=video_rat){
            visualWidth= RtmpHelper.winWidth;
            visualHeitht = (int)(RtmpHelper.winWidth /video_rat);
        }else{
            visualHeitht = RtmpHelper.winHeight;
            visualWidth = (int)(RtmpHelper.winHeight *video_rat);
        }
//        txv_preview.getLayoutParams().width = visualWidth;
//        txv_preview.getLayoutParams().height = visualHeitht;


        this.width = visualWidth;
        this.height = visualHeitht;

        resClient.setConnectionListener(this);
        isCompletePrepare = true;
        if(txv_preview.isAvailable()){

            isInitView = false;
            this.surface = txv_preview.getSurfaceTexture();
            surface.updateTexImage();
            creatView();

        }

    }

    private SurfaceTexture  surface;
    private int width;
    private int height;
    private boolean isInitView = false;
    private void creatView(){
        if(isInitView){
            return ;
        }
        isInitView = true;
        if (resClient != null) {
            resClient.createPreview(surface, width, height);
        }

    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        this.surface = surface;
        if(isCompletePrepare) {
            creatView();
        }

    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {
        LogTools.d("onSurface", "with" + width+"-height:"+height);


        double screen_rat = (double) width / (double) height;
        if(resClient != null) {
            double video_rat = (double) resClient.coreParameters.videoWidth / resClient.coreParameters.videoHeight;
            int visualWidth = 0;
            int visualHeitht = 0;
            if (screen_rat >= video_rat) {
                visualWidth = width;
                visualHeitht = (int) (width / video_rat);
            } else {
                visualHeitht = height;
                visualWidth = (int) (height * video_rat);
            }

            if (resClient != null) {
                resClient.updatePreview(visualWidth, visualHeitht);
            }
        }
    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        LogTools.e("onSurface","destory");
        if (resClient != null) {
            LogTools.e("onSurface","destory1");
            isInitView = false;
            resClient.destroyPreview();
        }
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {

    }

    @Override
    public void onOpenConnectionResult(int result) {
        /**
         * result==0 success
         * result!=0 failed
         */
        //tv_rtmp.setText("open=" + result);
    }

    @Override
    public void onWriteError(int error) {
        if (error == 100) {
            resClient.stop();
            resClient.start();
        }
        /**
         * failed to write data,maybe restart.
         */
        //tv_rtmp.setText("writeError=" + error);
    }

    @Override
    public void onCloseConnectionResult(int result) {
        /**
         * result==0 success
         * result!=0 failed
         */
        //tv_rtmp.setText("closed=" + result);
    }


}
