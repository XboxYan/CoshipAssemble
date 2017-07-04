package com.coship.live.rtmp.filter.core;


import android.media.MediaCodec;
import android.media.MediaFormat;

import com.coship.live.rtmp.HandleSend;
import com.coship.live.rtmp.filter.resrtmp.RESFlvData;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.send.EsData;
import com.coship.live.util.LogTools;

import java.nio.ByteBuffer;

/**
 * Created by lakeinchina on 26/05/16.
 */
public class VideoSenderThread extends Thread {
    private static final long WAIT_TIME = 10000;
    private MediaCodec.BufferInfo eInfo;
    private long startTime = 0;
    private MediaCodec dstVideoEncoder;

    VideoSenderThread(String name, MediaCodec encoder) {
        super(name);
        eInfo = new MediaCodec.BufferInfo();
        startTime = 0;
        dstVideoEncoder = encoder;
        output = new byte[480 * 640 * 3 / 2];
        yuv420 = new byte[480 * 640 * 3 / 2];
    }

    private boolean shouldQuit = false;

    void quit() {
        shouldQuit = true;
        this.interrupt();
    }

    public void destoryData() {
        m_info = null;
        output = null;
        yuv420 = null;
    }

    byte[] m_info = null;
    byte[] output = null;
    byte[] yuv420 = null;
    private boolean isFirstKeyFrame = true;
    byte[] spsByte;
    byte[] ppsByte;
    long start_time = 0;

    @Override
    public void run() {

        while (!shouldQuit) {
            int pos = 0;
            int eobIndex = MediaCodec.INFO_TRY_AGAIN_LATER;
            try {
                eobIndex = dstVideoEncoder.dequeueOutputBuffer(eInfo, WAIT_TIME);
            } catch (Exception ignored) {

            }
            switch (eobIndex) {
                case MediaCodec.INFO_OUTPUT_BUFFERS_CHANGED:
                    LogTools.v("VideoSenderThread,MediaCodec.INFO_OUTPUT_BUFFERS_CHANGED", "");
                    break;
                case MediaCodec.INFO_TRY_AGAIN_LATER:
                    break;
                case MediaCodec.INFO_OUTPUT_FORMAT_CHANGED:
                    LogTools.v("VideoSenderThread,MediaCodec.INFO_OUTPUT_FORMAT_CHANGED:" +
                            dstVideoEncoder.getOutputFormat().toString(), "");
                    break;
                default:
                    LogTools.v("VideoSenderThread,MediaCode,eobIndex=" + eobIndex, "");
                    if (eobIndex >= 0) {
                        if (eInfo.size != 0) {
                            ByteBuffer realData = dstVideoEncoder.getOutputBuffers()[eobIndex];
//                          realData.position(eInfo.offset + 4);
//                          realData.limit(eInfo.offset + eInfo.size);


                            byte[] outData = new byte[eInfo.size];
                            realData.get(outData);

                            if (m_info == null) {
                                // 保存pps sps 只有开始时 第一个帧里有， 保存起来后面用
                                ByteBuffer spsPpsBuffer = ByteBuffer.wrap(outData);
                                if (spsPpsBuffer.getInt() == 0x00000001) {
                                    m_info = new byte[outData.length];
                                    System.arraycopy(outData, 0, m_info, 0, outData.length);

                                    int ppsPos = 0;
                                    for (int i = 3; i < m_info.length; i++) {
                                        if ((m_info[i] & 0x1F) == 8) {
                                            if (m_info[i - 1] == 0x01) {
                                                if (m_info[i - 2] == 0x00) {
                                                    if (m_info[i - 3] == 0x00) {
                                                        ppsPos = i;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    spsByte = new byte[ppsPos - 8];
                                    System.arraycopy(m_info, 4, spsByte, 0, spsByte.length);
                                    ppsByte = new byte[m_info.length - ppsPos];
                                    System.arraycopy(m_info, ppsPos, ppsByte, 0, ppsByte.length);

                                }

                            } else {

                                System.arraycopy(outData, 0, output, pos, outData.length);
                                pos += outData.length;
                            }


                            if (pos > 0) {
                                byte[] frameByte = new byte[pos - 4];
                                System.arraycopy(output, 4, frameByte, 0, frameByte.length);

                                if ((frameByte[0] & 0x1F) == 5) {

                                    EsData esData = new EsData(spsByte, EsData.NALU_TYPE_SPS);

                                    HandleSend.getInstance().handleDataTs(esData);

                                    esData = new EsData(ppsByte, EsData.NALU_TYPE_PPS);

                                    HandleSend.getInstance().handleDataTs(esData);

                                    esData = new EsData(frameByte, EsData.NALU_TYPE_IDR);

                                    HandleSend.getInstance().handleDataTs(esData);

                                } else {

                                    EsData esData = new EsData(frameByte, EsData.NALU_TYPE_IDR);

                                    HandleSend.getInstance().handleDataTs(esData);

                                }
                                if (start_time == 0) {
                                    start_time = System.currentTimeMillis();
                                }
                                //LogTools.e("codec_video_time:",""+(System.currentTimeMillis()- start_time));
                                start_time = System.currentTimeMillis();
                            }


                        }
                    }
                    dstVideoEncoder.releaseOutputBuffer(eobIndex, false);
                    break;


            }
            try {
                sleep(5);
            } catch (InterruptedException ignored) {
            }

        }
        eInfo = null;
    }


    private void sendAVCDecoderConfigurationRecord(long tms, MediaFormat format) {
        byte[] AVCDecoderConfigurationRecord = Packager.H264Packager.generateAVCDecoderConfigurationRecord(format);
        int packetLen = Packager.FLVPackager.FLV_VIDEO_TAG_LENGTH +
                AVCDecoderConfigurationRecord.length;
        byte[] finalBuff = new byte[packetLen];
        Packager.FLVPackager.fillFlvVideoTag(finalBuff,
                0,
                true,
                true,
                AVCDecoderConfigurationRecord.length);
        System.arraycopy(AVCDecoderConfigurationRecord, 0,
                finalBuff, Packager.FLVPackager.FLV_VIDEO_TAG_LENGTH, AVCDecoderConfigurationRecord.length);
        RESFlvData resFlvData = new RESFlvData();
        resFlvData.byteBuffer = finalBuff;
        resFlvData.size = finalBuff.length;
        resFlvData.dts = (int) tms;
        resFlvData.flvTagType = RESFlvData.FLV_RTMP_PACKET_TYPE_VIDEO;
        resFlvData.videoFrameType = RESFlvData.NALU_TYPE_IDR;
        //dataCollecter.collect(resFlvData, RESRtmpSender.FROM_VIDEO);
    }

    private void sendRealData(long tms, ByteBuffer realData) {
        int realDataLength = realData.remaining();
        int packetLen = Packager.FLVPackager.FLV_VIDEO_TAG_LENGTH +
                Packager.FLVPackager.NALU_HEADER_LENGTH +
                realDataLength;
        byte[] finalBuff = new byte[packetLen];
        realData.get(finalBuff, Packager.FLVPackager.FLV_VIDEO_TAG_LENGTH +
                        Packager.FLVPackager.NALU_HEADER_LENGTH,
                realDataLength);
        int frameType = finalBuff[Packager.FLVPackager.FLV_VIDEO_TAG_LENGTH +
                Packager.FLVPackager.NALU_HEADER_LENGTH] & 0x1F;
        Packager.FLVPackager.fillFlvVideoTag(finalBuff,
                0,
                false,
                frameType == 5,
                realDataLength);
        RESFlvData resFlvData = new RESFlvData();
        resFlvData.byteBuffer = finalBuff;
        resFlvData.size = finalBuff.length;
        resFlvData.dts = (int) tms;
        resFlvData.flvTagType = RESFlvData.FLV_RTMP_PACKET_TYPE_VIDEO;
        resFlvData.videoFrameType = frameType;
        //dataCollecter.collect(resFlvData, RESRtmpSender.FROM_VIDEO);
    }
}