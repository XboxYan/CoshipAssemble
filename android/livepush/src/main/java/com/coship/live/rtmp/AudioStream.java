package com.coship.live.rtmp;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaFormat;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Process;
import android.util.Log;

import com.coship.live.rtmp.HandleSend;
import com.coship.live.rtmp.model.RtmpHelper;
import com.coship.live.rtmp.send.EsData;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.ByteBuffer;

/**
 * Created by Helong on 16/3/26-14:31.
 */
public class AudioStream {

    private int samplingRate = 8000;
    private int bitRate = 128*1000;//128kbps
    private int BUFFER_SIZE = 10*1024;
    int mSamplingRateIndex=0;
    AudioRecord mAudioRecord;
    MediaCodec mMediaCodec;
    private Thread mThread = null;
    private Thread encodeThread = null;
    String TAG = "audio_stream";
    //final String path = Environment.getExternalStorageDirectory() + "/123450001.aac";
    boolean stoped = false;

    protected MediaCodec.BufferInfo mBufferInfo = new MediaCodec.BufferInfo();
    protected ByteBuffer[] mBuffers = null;
    protected ByteBuffer mBuffer = null;
    protected int mIndex = -1;
    private int channel = AudioFormat.CHANNEL_IN_MONO;

    /** There are 13 supported frequencies by ADTS. **/
    public static final int[] AUDIO_SAMPLING_RATES = { 96000, // 0
            88200, // 1
            64000, // 2
            48000, // 3
            44100, // 4
            32000, // 5
            24000, // 6
            22050, // 7
            16000, // 8
            12000, // 9
            11025, // 10
            8000, // 11
            7350, // 12
            -1, // 13
            -1, // 14
            -1, // 15
    };
    private boolean isHardEncoder = false;
    public AudioStream(boolean misHardEncoder) {
        this.isHardEncoder = misHardEncoder;
        int i = 0;
        for (; i < AUDIO_SAMPLING_RATES.length; i++) {
            if (AUDIO_SAMPLING_RATES[i] == samplingRate) {
                mSamplingRateIndex = i;
                break;
            }
        }
    }

    private void init() {

        try {
            stoped=false;
            int bufferSize = AudioRecord.getMinBufferSize(samplingRate,
                    channel, AudioFormat.ENCODING_PCM_16BIT);
            mAudioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC,
                    samplingRate, channel,
                    AudioFormat.ENCODING_PCM_16BIT, bufferSize);
            mMediaCodec = MediaCodec.createEncoderByType("audio/mp4a-latm");
            MediaFormat format = new MediaFormat();
            format.setString(MediaFormat.KEY_MIME, "audio/mp4a-latm");
            format.setInteger(MediaFormat.KEY_BIT_RATE, bitRate);
            if(channel == AudioFormat.CHANNEL_IN_MONO) {
                format.setInteger(MediaFormat.KEY_CHANNEL_COUNT, 1);
            }else{
                format.setInteger(MediaFormat.KEY_CHANNEL_COUNT, 2);
            }
            format.setInteger(MediaFormat.KEY_SAMPLE_RATE, samplingRate);
            format.setInteger(MediaFormat.KEY_AAC_PROFILE,
                    MediaCodecInfo.CodecProfileLevel.AACObjectLC);
            format.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, BUFFER_SIZE);
            mMediaCodec.configure(format, null, null,
                    MediaCodec.CONFIGURE_FLAG_ENCODE);
        } catch (Exception e) {

        }
    }

    private boolean AACStreamingSupported() {
        if (Build.VERSION.SDK_INT < 14)
            return false;
        try {
            MediaRecorder.OutputFormat.class.getField("AAC_ADTS");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 编码
     */
    long start_time = 0;
    private void startEncode() {
        mBuffers = mMediaCodec.getOutputBuffers();
        mBuffer=null;
        encodeThread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (!Thread.interrupted() && !stoped) {
                    try {
                        if (mBuffer == null) {
                            mBuffer = ByteBuffer.allocate(10240);
                            while (!Thread.currentThread().isInterrupted() && !stoped) {
                                mIndex = mMediaCodec.dequeueOutputBuffer(mBufferInfo, 50000);
                                if (mIndex >= 0) {
                                    if (mBufferInfo.flags == MediaCodec.BUFFER_FLAG_CODEC_CONFIG) {
                                        continue;
                                    }
                                    mBuffer.clear();
                                    mBuffer.position(7);
                                    mBuffers[mIndex].get(mBuffer.array(), 7, mBufferInfo.size);
                                    mBuffers[mIndex].clear();
                                    mBuffer.position(mBuffer.position() + mBufferInfo.size);
                                    addMyADTStoPacket(mBuffer.array(), mBufferInfo.size + 7);
                                    mBuffer.flip();
                                    break;
                                } else if (mIndex == MediaCodec.INFO_OUTPUT_BUFFERS_CHANGED) {
                                    mBuffers = mMediaCodec.getOutputBuffers();
                                } else if (mIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                                    Log.v(TAG, "output format changed...");
                                } else if (mIndex == MediaCodec.INFO_TRY_AGAIN_LATER) {
                                    Log.v(TAG, "No buffer available...");
                                } else {
                                    Log.e(TAG, "Message: " + mIndex);
                                }
                            }
                        }
                        int size = mBufferInfo.size + 7;
                        byte[] buffer = new byte[size];
                        mBuffer.get(buffer);

                        if (RtmpHelper.isMicOpen) {
                            EsData esData = new EsData(buffer,EsData.AUDIO_TS);
                            HandleSend.getInstance().handleDataTs(esData);

                        }

                        if(start_time == 0){
                            start_time = System.currentTimeMillis();
                        }
                        start_time = System.currentTimeMillis();


                        if (mBuffer.position() >= size) { // read complete
                            mMediaCodec.releaseOutputBuffer(mIndex, false);
                            mBuffer = null;
                        }
                    } catch (RuntimeException e) {
                        StringWriter sw = new StringWriter();
                        PrintWriter pw = new PrintWriter(sw);
                        e.printStackTrace(pw);
                        String stack = sw.toString();
                        Log.i(TAG, "record" + stack);
                    }
                }
            }
        }, "AACEncoder");
        encodeThread.start();
    }


    public void startRecord() {
        try {
            init();
            mAudioRecord.startRecording();
            mMediaCodec.start();
            final ByteBuffer[] inputBuffers = mMediaCodec.getInputBuffers();
            mThread = new Thread(new Runnable() {
                @Override
                public void run() {
                    Process.setThreadPriority(Process.THREAD_PRIORITY_AUDIO);
                    int len = 0, bufferIndex = 0;
                    try {
                        while (!Thread.interrupted() && !stoped) {

                            bufferIndex = mMediaCodec.dequeueInputBuffer(50000);
                            if (bufferIndex >= 0) {
                                inputBuffers[bufferIndex].clear();
                                len = mAudioRecord.read(inputBuffers[bufferIndex], BUFFER_SIZE);
                                if (len == AudioRecord.ERROR_INVALID_OPERATION || len == AudioRecord.ERROR_BAD_VALUE) {
                                    mMediaCodec.queueInputBuffer(bufferIndex, 0, 0, 0, 0);
                                } else {
                                    mMediaCodec.queueInputBuffer(bufferIndex, 0, len, 0, 0);
                                }
                            }
                        }
                    } catch (RuntimeException e) {
                        StringWriter sw = new StringWriter();
                        PrintWriter pw = new PrintWriter(sw);
                        e.printStackTrace(pw);
                        String stack = sw.toString();
                        Log.i(TAG, "record" + stack);

                    }
                }
            }, "AACRecoder");
            mThread.start();
            startEncode();
        } catch (Exception e) {
            Log.e(TAG, "Record___Error!!!!!");
        }
    }

    private void addADTStoPacket(byte[] packet, int packetLen) {
        packet[0] = (byte) 0xFF;
        packet[1] = (byte) 0xF1;
        packet[2] = (byte) (((2 - 1) << 6) + (mSamplingRateIndex << 2) + (1 >> 2));
        packet[3] = (byte) (((1 & 3) << 6) + (packetLen >> 11));
        packet[4] = (byte) ((packetLen & 0x7FF) >> 3);
        packet[5] = (byte) (((packetLen & 7) << 5) + 0x1F);
        packet[6] = (byte) 0xFC;
    }

    /**
     *  Add ADTS header at the beginning of each and every AAC packet.
     *  This is needed as MediaCodec encoder generates a packet of raw
     *  AAC data.
     *
     *  Note the packetLen must count in the ADTS header itself !!! .
     *注意，这里的packetLen参数为raw aac Packet Len + 7; 7 bytes adts header
     **/
    private void addMyADTStoPacket(byte[] packet, int packetLen) {
        int profile = 2;  //AAC LC，MediaCodecInfo.CodecProfileLevel.AACObjectLC;
        int freqIdx = mSamplingRateIndex;  //32K, 见后面注释avpriv_mpeg4audio_sample_rates中32000对应的数组下标，来自ffmpeg源码
        int chanCfg = 2;  //见后面注释channel_configuration，Stero双声道立体声
        if(channel == AudioFormat.CHANNEL_IN_MONO) {
            chanCfg = 1;
        }

        /*int avpriv_mpeg4audio_sample_rates[] = {
            96000, 88200, 64000, 48000, 44100, 32000,
                    24000, 22050, 16000, 12000, 11025, 8000, 7350
        };
        channel_configuration: 表示声道数chanCfg
        0: Defined in AOT Specifc Config
        1: 1 channel: front-center
        2: 2 channels: front-left, front-right
        3: 3 channels: front-center, front-left, front-right
        4: 4 channels: front-center, front-left, front-right, back-center
        5: 5 channels: front-center, front-left, front-right, back-left, back-right
        6: 6 channels: front-center, front-left, front-right, back-left, back-right, LFE-channel
        7: 8 channels: front-center, front-left, front-right, side-left, side-right, back-left, back-right, LFE-channel
        8-15: Reserved
        */

        // fill in ADTS data
        packet[0] = (byte)0xFF;
        packet[1] = (byte)0xF9;
        packet[2] = (byte)(((profile-1)<<6) + (freqIdx<<2) +(chanCfg>>2));
        packet[3] = (byte)(((chanCfg&3)<<6) + (packetLen>>11));
        packet[4] = (byte)((packetLen&0x7FF) >> 3);
        packet[5] = (byte)(((packetLen&7)<<5) + 0x1F);
        packet[6] = (byte)0xFC;
    }


    public void stop() {
        try {

            if (mThread != null) {
                mThread.interrupt();
            }
            if (encodeThread != null) {
                encodeThread.interrupt();
            }
            stoped = true;
            if (mAudioRecord != null) {
                mAudioRecord.stop();
                mAudioRecord.release();
                mAudioRecord = null;
            }
            if (mMediaCodec != null) {
                mMediaCodec.stop();
                mMediaCodec.release();
                mMediaCodec = null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Stop___Error!!!!!");
        }
    }

}
