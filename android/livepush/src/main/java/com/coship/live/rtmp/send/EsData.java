package com.coship.live.rtmp.send;

/**
 * Created by 909799 on 2016/12/15.
 */
public class EsData {

    public final static int NALU_TYPE_IDR = 5;
    public final static int NALU_TYPE_SPS = 7;
    public final static int NALU_TYPE_PPS = 8;
    public final static int NALU_TYPE_P = 1;

    public final static int VIDEO_TS = 5;
    public final static int AUDIO_TS = 6;

    private int len;
    private int tagType;//视频，还是音频
    private long time;
    private int frameType; //视频帧的类型
    private byte[] data;


    /**视频包**/
    public EsData(byte[] data, int frameType) {
        this.data = data;
        this.frameType = frameType;
        this.tagType = EsData.VIDEO_TS;
    }
    /**音频帧**/
    public EsData(byte[] data) {
        this.data = data;
        this.tagType = EsData.AUDIO_TS;
    }
    public boolean isAudio(){
        if(tagType == AUDIO_TS){
            return true;
        }
        return false;
    }

    public boolean isVideo(){
        if(tagType == VIDEO_TS){
            return true;
        }
        return false;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public int getLen() {
        return len;
    }

    public void setLen(int len) {
        this.len = len;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public int getFrameType() {
        return frameType;
    }

    public void setFrameType(int frameType) {
        this.frameType = frameType;
    }

    public int getTagType() {
        return tagType;
    }

    public void setTagType(int tagType) {
        this.tagType = tagType;
    }

    public void destory(){
        data = null;
    }

    public boolean isKeyframe() {
        return frameType == NALU_TYPE_IDR;
    }
    public boolean isSps() {
        return frameType == NALU_TYPE_SPS;
    }
    public boolean isPpS() {
        return frameType == NALU_TYPE_PPS;
    }
    public boolean isPframe() {
        return frameType == NALU_TYPE_P;
    }
}
