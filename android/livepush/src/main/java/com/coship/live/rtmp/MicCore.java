package com.coship.live.rtmp;

public class MicCore {
    
    private boolean isHardEncoder = false;
    private AudioStream audioStream;

    public void start(boolean misHardEncoder) {
        this.isHardEncoder = misHardEncoder;

        if (audioStream == null) {
            audioStream = new AudioStream(isHardEncoder);
        }
        audioStream.startRecord();

    }

    public void stop() {

       audioStream.stop();

    }


}
