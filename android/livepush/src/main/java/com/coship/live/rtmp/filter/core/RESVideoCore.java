package com.coship.live.rtmp.filter.core;

import android.graphics.SurfaceTexture;

import com.coship.live.rtmp.filter.listener.RESScreenShotListener;
import com.coship.live.rtmp.filter.model.RESConfig;


/**
 * Created by lake on 16-5-25.
 */
public interface RESVideoCore {
    int OVERWATCH_TEXTURE_ID = 10;
    boolean prepare(RESConfig resConfig);

    boolean start(SurfaceTexture camTex);

    void updateCamTexture(SurfaceTexture camTex);

    boolean stop();

    boolean destroy();

    void setCurrentCamera(int cameraIndex);

    void createPreview(SurfaceTexture surfaceTexture, int visualWidth, int visualHeight);

    void updatePreview(int visualWidth, int visualHeight);

    void destroyPreview();

    void takeScreenShot(RESScreenShotListener listener);

    boolean previewCamera(SurfaceTexture camTex);
    boolean startConnect(SurfaceTexture camTex);
}
