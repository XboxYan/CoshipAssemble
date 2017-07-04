package com.coship.live.rtmp.filter.model;

import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;

/**
 * Created by lake on 25/05/16.
 */
public class MediaCodecGLWapper {
    public EGLDisplay eglDisplay;
    public EGLConfig eglConfig;
    public EGLSurface eglSurface;
    public EGLContext eglContext;

    public int cam2dProgram;
    public int cam2dTextureLoc;
    public int cam2dPostionLoc;
    public int cam2dTextureCoordLoc;

    public int camProgram;
    public int camTextureLoc;
    public int camPostionLoc;
    public int camTextureCoordLoc;

    public int drawProgram;
    public int drawTextureLoc;
    public int drawPostionLoc;
    public int drawTextureCoordLoc;
}