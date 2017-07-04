package com.coship.live.rtmp.filter.hardfilter;

import com.coship.live.rtmp.filter.core.GLHelper;

import java.nio.FloatBuffer;
import java.nio.ShortBuffer;


/**
 * Created by lake on 16-5-31.
 */
public class BaseHardVideoFilter {
    protected int SIZE_WIDTH;
    protected int SIZE_HEIGHT;
    protected ShortBuffer drawIndecesBuffer;

    public void onInit(int VWidth, int VHeight) {
        SIZE_WIDTH = VWidth;
        SIZE_HEIGHT = VHeight;
        drawIndecesBuffer = GLHelper.getDrawIndecesBuffer();
    }

    public void onDraw(final int cameraTexture,final int targetFrameBuffer, final FloatBuffer shapeBuffer, final FloatBuffer textrueBuffer) {
    }

    public void onDestroy() {

    }
}
