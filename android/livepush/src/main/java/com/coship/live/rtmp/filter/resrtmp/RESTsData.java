package com.coship.live.rtmp.filter.resrtmp;

/**
 * Created by 909799 on 2016/12/16.
 */
public class RESTsData {

    public final static int NALU_TYPE_IDR = 5;
    public final static int NALU_TYPE_SPS = 7;
    public final static int NALU_TYPE_PPS = 8;
    public final static int NALU_TYPE_P = 1;

    public RESTsData(byte[] byteBuffer, int size,int videoFrameType) {
        this.byteBuffer = byteBuffer;
        this.size = size;
        this.videoFrameType = videoFrameType;
    }

    public byte[] byteBuffer; //数据

    public int size; //字节长度

    public int videoFrameType;

    public boolean isKeyframe() {
        return videoFrameType == NALU_TYPE_IDR;
    }
    public boolean isSps() {
        return videoFrameType == NALU_TYPE_SPS;
    }
    public boolean isPpS() {
        return videoFrameType == NALU_TYPE_PPS;
    }
}
