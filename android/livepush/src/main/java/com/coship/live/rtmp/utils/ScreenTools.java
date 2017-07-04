package com.coship.live.rtmp.utils;

import java.lang.reflect.Field;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Rect;
import android.view.Window;

/**
 * 获取屏幕,分辨率相关
 */
public class ScreenTools {
	private Context mCtx;
	private static ScreenTools mScreenTools;
	
	public static ScreenTools instance(Context ctx){
		if(null == mScreenTools){
			mScreenTools = new ScreenTools(ctx);
		}
		return mScreenTools;
	}
	
	private ScreenTools(Context ctx){
		mCtx = ctx.getApplicationContext();
	}
	
	public int getScreenWidth(){
		return mCtx.getResources().getDisplayMetrics().widthPixels;
	}

	public int dip2px(int dip){
		float density = getDensity(mCtx);
		return (int)(dip * density + 0.5);
	}
	
	public int px2dip(int px){
		float density = getDensity(mCtx);
		return (int)((px - 0.5) / density);
	}


	
	private  float getDensity(Context ctx){
		return ctx.getResources().getDisplayMetrics().density;
	}
	
	/**
	 * ５40 的分辨率上是85 （
	 * @param width　当前屏幕宽度
	 * @return
	 */
	public int getScal(){
		 return (int)(getScreenWidth() * 100 / 480);
	}
	
	 /**
	  * 宽全屏, 根据当前分辨率　动态获取高度 
	  * height 在８００*４８０情况下　的高度
	  * @return
	  */
	public int get480Height(int height480){
		 int width = getScreenWidth();
		 return (height480 * width / 480); 
	 }
	
	/**
	 * 获取状态栏高度
	 * @return
	 */
	public int getStatusBarHeight(){
		Class<?> c = null;
		Object obj = null;
		Field field = null;
		int x = 0, sbar = 0;
		try {
			c = Class.forName("com.android.internal.R$dimen");
			obj = c.newInstance();
			field = c.getField("status_bar_height");
			x = Integer.parseInt(field.get(obj).toString());
			sbar = mCtx.getResources().getDimensionPixelSize(x);
		} catch (Exception e1) {
			e1.printStackTrace();
		} 
		return sbar;
	}

	/**
	 * 获取状态栏高度
	 * @return
	 */
	public int getNavBarHeight(){
		Class<?> c = null;
		Object obj = null;
		Field field = null;
		int x = 0, sbar = 0;
		try {
			c = Class.forName("com.android.internal.R$dimen");
			obj = c.newInstance();
			field = c.getField("navigation_bar_height");
			x = Integer.parseInt(field.get(obj).toString());
			sbar = mCtx.getResources().getDimensionPixelSize(x);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return sbar;
	}
    //另外一种获取状态栏的方法
//	private int getStatusBarHeight() {
//		Resources resources = mCtx.getResources();
//		int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
//		int height = resources.getDimensionPixelSize(resourceId);
//		return height;
//	}
//
	private int getNavigationBarHeight() {
		Resources resources = mCtx.getResources();
		int resourceId = resources.getIdentifier("navigation_bar_height","dimen", "android");
		int height = resources.getDimensionPixelSize(resourceId);
		int heightP = resources.getDimensionPixelOffset(resourceId);

		return height;
	}



	public int getScreenHeight(){
		return mCtx.getResources().getDisplayMetrics().heightPixels;
	}

	/**
	 * 出去状态栏高度的，屏幕高度
	 * @return
	 */
	public int getScreenHeightNoBar(){
		return (getScreenHeight() - getStatusBarHeight());
	}
}