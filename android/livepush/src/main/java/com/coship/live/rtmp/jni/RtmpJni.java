package com.coship.live.rtmp.jni;

import com.coship.live.util.LogTools;
import com.coship.live.rtmp.proxy.IDataBack;


public class RtmpJni {
	private int sensor_orientation = -1;
	
	public static final int STATUS_RTMP_ERROR_SOFT_DECODE_CONNECT_OUT_TIME = 8001;  
	public static final int STATUS_RTMP_ERROR_SOFT_DECODE_STREAM_OUT_TIME = 8002;  
	public static final int STATUS_RTMP_ERROR_SOFT_DECODE_READE_DATA_OUT_TIME = 8003;
	public static final int STATUS_RTMP_ERROR_SOFT_DECODE_EOF = 8004;
	public static final int STATUS_RTMP_RECONNECT_SOFT_DECODE = 9001;

	static {
//		System.loadLibrary("crypto");
//		System.loadLibrary("ssl");
//		System.loadLibrary("rtmp-1");
//		System.loadLibrary("avutil-54");
//    	System.loadLibrary("swresample-1");
//    	System.loadLibrary("avcodec-56");
//    	System.loadLibrary("avformat-56");
//    	System.loadLibrary("swscale-3");
//    	System.loadLibrary("postproc-53");
//    	System.loadLibrary("avfilter-5");
//    	System.loadLibrary("avdevice-56");
//
//		System.loadLibrary("hardencoder");
//		System.loadLibrary("harddecoder");
//		System.loadLibrary("softencoder");
//		System.loadLibrary("softdecoder");
//		System.loadLibrary("softdecoder");
//		System.loadLibrary("AudioTrack");
//		System.loadLibrary("yuvutil");
		System.loadLibrary("tspush");

    }

	private long last_audio = 0;
	private long last_video = 0;
	public void callbackYuv(byte[] ydata,byte[] udata,byte[] vdata,long time){
		last_video = System.currentTimeMillis();
		if(dataProxy != null) {
			dataProxy.callbackYuv(ydata, udata, vdata, time);
		}
	}
	/***返回未编码的数据**/
	public void callbackHardVideo(byte[] yuvData){
		if(dataProxy != null){
			dataProxy.callbackH264(yuvData);
		}
	}
	/***回调音频数据**/
	public void callbackAu(byte[] pData,long time){
		last_audio = System.currentTimeMillis();
		if(dataProxy != null){
		   dataProxy.callbackPCM(pData, time);
		}
	}
	public void callbackSoftH264(byte[] pData){
		if(dataProxy != null) {
			dataProxy.callbackSoftH264(pData);
		}
	}

	public void callBackSize(int width,int height){
		System.out.print(width);
		System.out.print(height);
		if(dataProxy != null) {
			dataProxy.callBackSize(width, height);
		}
	}
	
	public void callBackStatus(int status){
		if(dataProxy != null) {
			dataProxy.callBackStatus(status);
		}
		LogTools.e("Error log", "" + status);
	}
	//hard encode call back status
	public void callBackHardEncodeStatus(int status){
		if(dataProxy != null) {
			dataProxy.callBackStatus(status);
		}
		LogTools.e("Error log", "" + status);
	}
	/**硬编回调日志**/
	public void callBackHardEncodeLog(int type,int value){
        LogTools.v("callHardQualityLog:", System.currentTimeMillis() + ":" + type);

	}
	/**软编回调日志**/
	public void callBackSoftEncodeLog(int type,int value){
		LogTools.v("callSoftQualityLog:", System.currentTimeMillis() + ":" + type);

	}
	/**软解回调日志**/
	public void callBackSoftDecodeLog(int type,int value){
		LogTools.v("callBackSoftDecodeLog:", System.currentTimeMillis() + ":" + type);

	}


	//初始编码参数
    public native int initSoftEncoderConfigure(int width,int height,int framerate,int bitrate,int previewFormat);
    public native int initHardEncoderConfigure(int width,int height,int framerate,int bitrate);
    
    public native int startSoftDecode(String inputurl,int connect_out_time,int stream_out_time,int decode_flag);
    public native int startSoftReadData();
    public native int stopSoftDecoder();

    
    public native int initSoftEncoder(String outputurl,int connect_out_time,int stream_out_time,int bestIndex);
	public native int trySoftConnect(String outputurl,int index);
	public native int closeTrySoftConnect(int index);
    public native int stopSoftEncoder();
    
    public native int initHardEncoder(String outputurl,int connect_out_time,int stream_out_time,int bestIndex);
	public native int tryHardConnect(String outputurl,int index);
	public native int closeTryHardConnect(int index);
    public native int stopHardEncoder();
    
    public native int startHardDecode(String inputurl,int connect_out_time,int stream_out_time);
    public native int startHardReadData();
    public native int stopHardDecoder();
   
    public native int updateVideoSoft(byte[] data,int len,long time);
    public native int updateVideoHard(byte[] data,int len,long time);

    public native void initRotate(int width, int height);
    public native void rotateFront(byte[] src, byte[] dst, int width, int height,int flip);
    public native void rotateBack(byte[] src, byte[] dst, int width, int height,int flip);
	public native void rotateFontYV(byte[] src, byte[] dst, int width, int height,int flip);
	public native void rotateBackYV(byte[] src, byte[] dst, int width, int height,int flip);
	public native void rotateYV180(byte[] src, byte[] dst, int width, int height);
	public native void rotateNV180(byte[] src, byte[] dst, int width, int height);

    public native void reverseYUV420SP(byte[] input, int width,int height);
    public native void reverseYUV420P(byte[] input,int width,int height);


    public native int ConvertToI420(byte[] nv21,byte[] dst,int w, int h, int type);

	public native void insertYuv(byte[] src, byte[] dstY, byte[] dstU,byte[] dstV,int color,int isSpecal,int framesize,int qFrameSize);
    
    public native int updatePpsSps(byte[] data,int ret);
    
    public native int getConnectHardEncoderStatus();
    
    public native int getConnectSoftEncoderStatus();

    public native int updateAudioSoft(byte[] data,int len,long time,int type);
    public native byte[] softEncodeH264Video(byte[] data,int len);
    public native int updateAudioHard(byte[] data,int len,long time,int type);

	public native int connectTsServer(String serverUrl);
	public native int closeTs();
	public native int pushDataMux(byte[] data,long timestamp,int type);
	/**获取http推送连接状态**/
	public native int httpStatus();

	//OPEN SL
	/** Native methods, implemented in jni folder */
	public static native void createEngine();

	public  native boolean createAudioPlayer();
	public  native int updatePCM(byte[] pcm,int len);

	public  native void setPlayingAudioPlayer(boolean isPlaying);

	public  native void setVolumeAudioPlayer(int millibel);

	public  native void setMutAudioPlayer(boolean mute);

	public  native void shutdown();
	/********************************/


	private static RtmpJni sInstance;
	
	public IDataBack dataProxy;

	private RtmpJni() {

	}

	public static RtmpJni getInstance() {
		if (sInstance == null) {
			sInstance = new RtmpJni();
		}
		return sInstance;
	}
}
