package com.coship.live.rtmp;

import android.os.Build;

import com.coship.live.rtmp.model.VideoConfig;

import java.util.List;


public class RtmpMain extends BaseAgent{


	private int currType = 1;

	private HardEncoderAgentMagic magicEncoderAgent;
	private IRtmpAgent currAgent;

	private static RtmpMain instance = null;

	public static final int PREVIEW_MODE = 4;//3ms
	public static final int PUSH_MODE = 5;//3ms


	public static class PlayMode{
		public static final int HARD = 1;
		public static final int SOFT= 2;
	}
	public static class PushMode{
		public static final int SOFT = 3;
		public static final int HARD = 4;
		public static final int MAGIC = 5;//带美颜功能模式
	}


	public static RtmpMain getInstance(){
		if(instance == null){
			instance = new RtmpMain();
		}
		return instance;
	}
	
	private RtmpMain(){
		
	}


	public void startConnect(String url){
		if(currType == PushMode.MAGIC){
			magicEncoderAgent.startConnect(url);
		}
	}


	public void startPreview(int type,VideoConfig videoConfig) {
		currType = type;
		if(currType == PushMode.MAGIC){
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
				if (magicEncoderAgent == null) {
					magicEncoderAgent = new HardEncoderAgentMagic();
				}
				currAgent = magicEncoderAgent;
				magicEncoderAgent.configure(videoConfig);
				magicEncoderAgent.previewCamera();
			}
		}
	}
	

	@Override
	public void stop() {
		//NotificationCenter.defaultCenter.removeListener(NotificationKey.net_connect_success,this);
		if(currAgent!=null) {
			currAgent.stop();
		}
		
	}

	@Override
	public void pause() {
		if(currAgent!=null){
			currAgent.pause();
		}
	}


	@Override
	public void changeCamera() {
		if(currAgent!=null) {
			currAgent.changeCamera();
		}
		
	}
	@Override
	public void openFlash(boolean boo){
		if(currAgent!=null) {
			currAgent.openFlash(boo);
		}
	}
	@Override
	public void openMagic(boolean boo){
		if(currAgent!=null) {
			currAgent.openMagic(boo);
		}
	}

	@Override
	public void resumeCamera() {
		if(currAgent!=null) {
			currAgent.resumeCamera();
		}

	}
	@Override
	public void focus(){
		if(currAgent!=null) {
			currAgent.focus();
		}
	}
	public void updateRotion(int rotation){
		if(currAgent!=null) {
			currAgent.updateRotion(rotation);
		}
	}


}
