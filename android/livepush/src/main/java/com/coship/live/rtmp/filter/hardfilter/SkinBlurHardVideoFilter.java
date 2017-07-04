package com.coship.live.rtmp.filter.hardfilter;

import android.opengl.GLES20;

/**
 * Created by lake on 06/06/16.
 */
public class SkinBlurHardVideoFilter extends OriginalHardVideoFilter {
    int xStepLoc;
    int yStepLoc;

    public SkinBlurHardVideoFilter(String s) {
        super(null, s);
    }

    @Override
    public void onInit(int VWidth, int VHeight) {
        super.onInit(VWidth, VHeight);
        yStepLoc = GLES20.glGetUniformLocation(glProgram, "yStep");
        xStepLoc = GLES20.glGetUniformLocation(glProgram, "xStep");
    }

    @Override
    protected void onPreDraw() {
        super.onPreDraw();
        GLES20.glUniform1f(xStepLoc, (float) (2.0 / SIZE_WIDTH));
        GLES20.glUniform1f(yStepLoc, (float) (2.0 / SIZE_HEIGHT));
    }
}
