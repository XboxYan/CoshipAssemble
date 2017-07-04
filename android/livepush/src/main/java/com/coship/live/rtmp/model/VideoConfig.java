package com.coship.live.rtmp.model;


import android.hardware.Camera;

import java.util.ArrayList;
import java.util.List;

public class VideoConfig {
	private int bitrate = 1200*1000; //码率:700KBps 5600Kb/s 700*1024*8b/s  5.5Mbps
	private int framerate = 15;

	private List<PrevSize> superListSize = new ArrayList<PrevSize>();//超清

	private PrevSize currSize;

	public static final int CAMERA_BACK = 0;
	public static final int CAMERA_FRONT = 1;

	//  Camera.CameraInfo.CAMERA_FACING_BACK
	private int currentCameraIndex = Camera.CameraInfo.CAMERA_FACING_FRONT;

	public int getCurrentCameraIndex() {

		return currentCameraIndex;
	}

	public void setCurrentCameraIndex(int currentCameraIndex) {
		this.currentCameraIndex = currentCameraIndex;
	}

	public VideoConfig(String tbitrate,String bitname,String fps,String reslution){

		try {
//			StreamConfigJB.data tdata = parseUserSelect(Session.getInstance().getRoomInfo().getBitrate());

//			StreamConfigJB.data tdata = null;
//			StreamConfigJB streamConfigJB = new StreamConfigJB();
//			tdata = streamConfigJB.new data("1200","超清","15","1280*960");
//
			String[] sizeArr = reslution.split("[*]");
			int width = Integer.parseInt(sizeArr[0]);
			int height = Integer.parseInt(sizeArr[1]);

			framerate = Integer.parseInt(fps);
			bitrate = Integer.parseInt(tbitrate)*1000;

			currSize = new PrevSize(width,height);

		}catch (Exception e){
			e.printStackTrace();
			currSize = new PrevSize(640,480);
		}


	}

//	private StreamConfigJB.data parseUserSelect(int bitRate){
//		List<StreamConfigJB.data> bitArr = StreamConfigManager.getInstance().getDataList();
//
//		if(bitArr != null) {
//			for (int i = 0; i < bitArr.size(); i++) {
//				if(bitArr.get(i).getBitRate().equals(String.valueOf(bitRate))){
//					return bitArr.get(i);
//				}
//			}
//		}
//		return bitArr.get(0);
//
//	}

	public VideoConfig(int b, int fps){
		this.bitrate = b;
		this.framerate = fps;
	}


	public List<PrevSize> getResolutionList(){

			return superListSize;

	}

	public PrevSize getCurrSize() {
		return currSize;
	}

	public void setCurrSize(int width,int height) {

		this.currSize = new PrevSize(width,height);
	}
	public void setCurrSize(PrevSize prevSize) {

		this.currSize = prevSize;
	}

	public int getBitrate() {
		return bitrate;
	}


	public int getFramerate() {
		return framerate;
	}



	public class PrevSize{
		int width;
		int height;

		public PrevSize(int width,int height) {
			this.height = height;
			this.width = width;
		}

		public int getHeight() {
			return height;
		}

		public void setHeight(int height) {
			this.height = height;
		}

		public int getWidth() {
			return width;
		}

		public void setWidth(int width) {
			this.width = width;
		}
	}


}
