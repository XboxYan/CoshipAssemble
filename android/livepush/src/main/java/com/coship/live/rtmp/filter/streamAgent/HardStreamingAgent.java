package com.coship.live.rtmp.filter.streamAgent;

import android.content.Context;
import android.view.TextureView;


import com.coship.live.util.LogTools;
import com.coship.live.rtmp.filter.hardfilter.BaseHardVideoFilter;
import com.coship.live.rtmp.filter.hardfilter.HardVideoGroupFilter;
import com.coship.live.rtmp.filter.hardfilter.SkinBlurHardVideoFilter;
import com.coship.live.rtmp.filter.hardfilter.WhiteningHardVideoFilter;
import com.coship.live.rtmp.filter.model.RESConfig;
import com.coship.live.rtmp.filter.tools.GLESTools;
import com.coship.live.rtmp.model.VideoConfig;
import com.coship.live.R;
import java.util.LinkedList;

/**
 * Created by gp on 2016/6/29.
 */
public class HardStreamingAgent extends BaseStreamingAgent {
    private static final String TAG = HardStreamingAgent.class.getName();

    private BaseHardVideoFilter filter;
    public HardStreamingAgent(TextureView txv_preview, Context context,VideoConfig videoConfig) {

        super(txv_preview, context,videoConfig);

        filtermode = RESConfig.FilterMode.HARD;
        LinkedList<BaseHardVideoFilter> filters = new LinkedList<>();
        filters.add(new SkinBlurHardVideoFilter(GLESTools.readTextFile(context.getResources(), R.raw.skinblurgl)));
        filters.add(new WhiteningHardVideoFilter());
//        Bitmap resultBitmap = Bitmap.createBitmap(mVideoConfig.getCurrSize().getWidth(),mVideoConfig.getCurrSize().getHeight(),Bitmap.Config.ARGB_8888);
//        Canvas canvas= new Canvas(resultBitmap);
//        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.bg_logo);
//        Rect srcRect = new Rect(0,0,bitmap.getWidth(),bitmap.getHeight());
//        Rect dstRect = new Rect(0,90,144,145);
//        canvas.drawBitmap(bitmap,srcRect,dstRect,null);
//
//        filters.add(new TowInputFilterHard(null,null,resultBitmap));
        filter = new HardVideoGroupFilter(filters);

        resClient.setHardVideoFilter(null);
//      resClient.setZoomByPercent(100 / 100.0f);
//      resClient.setZoomByPercent(0.8f);
    }

    public void previewCamera(){
        resClient.previewCamera();
    }
    public void startConnect(){
        resClient.startConnect();
    }

//    public  Bitmap getTransparentBitmap(Bitmap sourceImg, int number){
//        int[] argb = new int[sourceImg.getWidth() * sourceImg.getHeight()];
//
//        sourceImg.getPixels(argb, 0, sourceImg.getWidth(), 0, 0, sourceImg
//
//                .getWidth(), sourceImg.getHeight());// 获得图片的ARGB值
//
//        number = number * 255 / 100;
//
//        for (int i = 0; i < argb.length; i++) {
//
//            argb[i] = (number << 24) | (argb[i] & 0x00FFFFFF);
//
//        }
//
//        sourceImg = Bitmap.createBitmap(argb, sourceImg.getWidth(), sourceImg
//
//                .getHeight(), Bitmap.Config.ARGB_8888);
//
//        return sourceImg;
//    }



    public void start() {

        resClient.start();

    }

    public void stop() {

        resClient.stop();

    }



    public void destory() {
        LogTools.e(TAG, "destory-1");
        resClient.stop();
        LogTools.e(TAG, "destory-2");
        resClient.destroy();
        LogTools.e(TAG, "destory-3");
        resClient = null;
    }

    public void swapCamea() {
        resClient.swapCamera();
    }
    public void focus(){
        resClient.focus();
    }

    public void resumeCamera() {
        resClient.resumeCamera();
    }
    public void openFlash(boolean boo){
        resClient.openFlash(boo);
    }

    public void openMagic(boolean boo){
        if(resClient!=null) {
           if(boo){
               resClient.setHardVideoFilter(filter);
           }else{
               resClient.setHardVideoFilter(null);
           }
        }
    }
    public void updateRotion(int rotation){
        if(resClient!=null) {
            resClient.updateRotion(resConfig,rotation);
        }
    }

}
