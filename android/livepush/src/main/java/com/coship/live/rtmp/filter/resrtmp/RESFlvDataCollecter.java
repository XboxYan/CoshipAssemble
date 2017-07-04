package com.coship.live.rtmp.filter.resrtmp;

/**
 * Created by lake on 16-5-24.
 */
public interface RESFlvDataCollecter {
//    void collect(RESFlvData flvData, int type);
    void collect(byte[] tbyte, boolean isIDR);
    void collectTs(RESTsData tsData);
}



