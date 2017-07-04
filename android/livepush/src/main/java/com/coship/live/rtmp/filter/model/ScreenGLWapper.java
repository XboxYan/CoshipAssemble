package com.coship.live.rtmp.filter.model;

import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;

/**
 * Created by lake on 25/05/16.
 */
public class ScreenGLWapper {
    public EGLDisplay eglDisplay;
    public EGLConfig eglConfig;
    public EGLContext eglContext;
    public EGLSurface eglSurface;

    public int drawProgram;
    public int drawTextureLoc;
    public int drawPostionLoc;
    public int drawTextureCoordLoc;
}
