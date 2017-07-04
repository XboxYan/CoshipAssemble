package com.coship.live.rtmp.proxy;

public class HardEncoderDataProxy implements IDataBack,ICallBack {

	private ICallBack obj_callBack;
	
	public HardEncoderDataProxy(ICallBack obj_callBack){
		this.obj_callBack = obj_callBack;
	}
	@Override
	public void callBack(int type) {
		// TODO Auto-generated method stub

	}

	@Override
	public void callbackYuv(byte[] ydata, byte[] udata, byte[] vdata, long time) {

	}

	@Override
	public void callbackPCM(byte[] pData,long time) {
		// TODO Auto-generated method stub
	}

	@Override
	public void callbackH264(byte[] h264) {
		// TODO Auto-generated method stub

	}


	@Override
	public void callbackSoftH264(byte[] pData) {
		// TODO Auto-generated method stub

	}

	@Override
	public void callBackSize(int width, int height) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean isAlreadyReceivedData() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void callBackStatus(int status) {
		
	}

}
