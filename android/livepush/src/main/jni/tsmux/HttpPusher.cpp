#include <malloc.h>
#include <jni.h>
#include <string.h>
#include "android/log.h"
#include "HttpPusher.h"
#include "Mux.h"

//char* jstring_to_cstr(JNIEnv *env, jstring jstr);


char* jstring_to_cstr(JNIEnv *env, jstring jstr)
{
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 1 \n");
    char* str = NULL;
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 2 \n");
    jclass clsstring = env->FindClass("java/lang/String");
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 3 \n");
    jstring strencode = env->NewStringUTF("utf-8");
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 4 \n");
    jmethodID mid = env->GetMethodID(clsstring, "getBytes", "(Ljava/lang/String;)[B");
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 5 \n");
    jbyteArray barr= (jbyteArray)env->CallObjectMethod(jstr, mid, strencode);
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 6 \n");
    jsize alen = env->GetArrayLength(barr);
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 7 \n");
    jbyte* ba = env->GetByteArrayElements(barr, JNI_FALSE);
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 8 \n");
    if (alen > 0)
    {
        __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 9 \n");
        str = (char*)malloc(alen + 1);
        memcpy(str, ba, alen);
        str[alen] = 0;
        __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 10 \n");
    }
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 11 \n");
    env->ReleaseByteArrayElements(barr, ba, 0);
    __android_log_write(ANDROID_LOG_INFO,"jstring_to_cstr"," in 12 \n");

    return str;
}

JNIEXPORT jint JNICALL Java_com_coship_live_rtmp_jni_RtmpJni_connectTsServer
        (JNIEnv *env, jobject obj, jstring jurl)
{
   /* __android_log_write(ANDROID_LOG_INFO,"connect"," in \n");
    char *url = jstring_to_cstr(env, jurl);
    __android_log_write(ANDROID_LOG_INFO,"connect"," in 1 \n");
    int result = HttpPusherConnect(url);
    __android_log_write(ANDROID_LOG_INFO,"connect"," in 2 \n");
    free(url);

    __android_log_write(ANDROID_LOG_INFO,"connect"," in 3 \n");
    __android_log_write(ANDROID_LOG_INFO,"connect"," in end \n");
    return result;*/

    const char *url = env->GetStringUTFChars(jurl, 0);
    int result = HttpPusherConnect(url);
    env->ReleaseStringUTFChars(jurl, url);


//    if(pVideo_Audio_Ts_File == NULL){
//        LOGE("创建文件");
//        pVideo_Audio_Ts_File = OpenFile("/storage/emulated/0/mux_test2.ts", "ab+");
//    }

    return result;
}



//JNIEXPORT jint JNICALL Java_com_coship_live_rtmp_jni_RtmpJni_push
//        (JNIEnv *env, jobject obj1, jbyteArray jbuf, jlong obj2,jstring type)
//{
//    //__android_log_write(ANDROID_LOG_INFO,"type",type);
//    int nLen = env->GetArrayLength(jbuf);
//    unsigned char* buf = (unsigned char*)env->GetByteArrayElements(jbuf, 0);
//    return HttpPusherPush(buf, nLen, 0);
//}

JNIEXPORT jint JNICALL Java_com_coship_live_rtmp_jni_RtmpJni_closeTs
        (JNIEnv *env, jobject obj)
{
    return HttpPusherClose();
}

JNIEXPORT jint JNICALL Java_com_coship_live_rtmp_jni_RtmpJni_httpStatus(JNIEnv *env, jobject obj)
{
    return GetPushConnectStatus();
}

JNIEXPORT jint JNICALL Java_com_coship_live_rtmp_jni_RtmpJni_pushDataMux
        (JNIEnv *env, jobject obj1, jbyteArray jbuf, jlong stime,jint frame_type) {
    if (jbuf != NULL) {
        int nLen = env->GetArrayLength(jbuf);
        //LOGE("pushDataMux:%d",type);
        unsigned char *buf = (unsigned char *) env->GetByteArrayElements(jbuf, 0);
        unsigned long pts_time = (unsigned long) stime;
        if (frame_type == 7 || frame_type == 8 || frame_type == 5 || frame_type == 1) {
            unsigned char *data = new unsigned char[nLen + 4];
            data[0] = 0x00;
            data[1] = 0x00;
            data[2] = 0x00;
            data[3] = 0x01;
            memcpy(data + 4, buf, nLen);
            if (frame_type == 7 || frame_type == 8) {
                pts_time = 0;
            }
            WriteBuf2TsFile(15, 1, data, nLen + 4, pts_time, frame_type);
        } else {
            unsigned char *dataAudio = new unsigned char[nLen];
            memcpy(dataAudio, buf, nLen);
            WriteBuf2TsFile(8000, 0, dataAudio, nLen, pts_time, frame_type);
        }

        env->ReleaseByteArrayElements(jbuf, (jbyte *) buf, 0);

    }
    return 1;
}




