package com.coship.live.rtmp.proxy;

public interface IDataBack {
   
	public void callbackH264(byte[] h264);

	public void callbackYuv(byte[] ydata, byte[] udata, byte[] vdata, long time);

	public void callbackPCM(byte[] pData, long time);

	public void callbackSoftH264(byte[] pData);
	
	public void callBackSize(int width, int height);
	
	public boolean isAlreadyReceivedData();
	
	public void callBackStatus(int status);
	
}
