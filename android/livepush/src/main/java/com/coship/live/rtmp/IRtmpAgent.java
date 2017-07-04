package com.coship.live.rtmp;

import java.util.List;

public interface IRtmpAgent {

	public void start();
	public void stop();
	public void rstart();
	public void pause();
	public void changeCamera();
	public void openFlash(boolean boo);
	public void openMagic(boolean boo);
	public void resumeCamera();
	public void previewCamera();
	public void focus();
	public void updateRotion(int rotation);
	public void startConnect(String url);
}
