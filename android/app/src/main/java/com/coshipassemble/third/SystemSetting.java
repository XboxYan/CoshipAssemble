package com.coshipassemble.third;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.os.Build;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static com.facebook.react.common.ReactConstants.TAG;

/**
 * Created by ninty on 2017/5/24.
 */

public class SystemSetting extends ReactContextBaseJavaModule {

    private AudioManager am;
    private ReactApplicationContext mContext;
    SharedPreferences sp;

    public SystemSetting(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        am = (AudioManager) getReactApplicationContext().getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
        sp = mContext.getSharedPreferences("file", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "SystemSetting";
    }

    @ReactMethod
    public void setScreenMode(int mode) {
        if (checkSystemWritePermission()) {
            mode = mode == Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL ? mode : Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC;
            Settings.System.putInt(getReactApplicationContext().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS_MODE, mode);
        }

    }

    private boolean checkSystemWritePermission() {
        boolean retVal = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            retVal = Settings.System.canWrite(mContext);
            Log.d(TAG, "Can Write Settings: " + retVal);
            if (retVal) {
                //Toast.makeText(mContext, "Write allowed :-)", Toast.LENGTH_LONG).show();
            } else {
                boolean isFirst = sp.getBoolean("first", true);
                if (isFirst) {
                    //Toast.makeText(mContext, "Write not allowed :-(", Toast.LENGTH_LONG).show();
                    if (ActivityCompat.shouldShowRequestPermissionRationale(mContext.getCurrentActivity(),
                            Manifest.permission.WRITE_SETTINGS)) {
                        // 显示给用户的解释
                    } else {
                        // No explanation needed, we can request the permission.
                        ActivityCompat.requestPermissions(mContext.getCurrentActivity(),
                                new String[]{Manifest.permission.READ_CONTACTS},
                                1);
                    }
                    sp.edit().putBoolean("first", false).commit();
                }else{
//                    alert
                    Toast.makeText(mContext,"需要获得更改系统设置权限",Toast.LENGTH_SHORT).show();
                }
            }
        }
        return retVal;
    }

    @ReactMethod
    public void getScreenMode(Promise promise) {
        try {
            int mode = Settings.System.getInt(getReactApplicationContext().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS_MODE);
            promise.resolve(mode);
        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
            promise.reject("-1", "get brightness mode fail", e);
        }
    }

    @ReactMethod
    public void setBrightness(float val) {
//        setScreenMode(Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL);
        if (checkSystemWritePermission()) {
            final int brightness = (int) (val * 255);
            Settings.System.putInt(getReactApplicationContext().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS, brightness);
        }
    }

    @ReactMethod
    public void getBrightness(Promise promise) {
        try {
            int val = Settings.System.getInt(getReactApplicationContext().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS);
            promise.resolve(val * 1.0f / 255);
        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
            promise.reject("-1", "get brightness fail", e);
        }
    }

    @ReactMethod
    public void setVolume(float val) {
        am.setStreamVolume(AudioManager.STREAM_MUSIC, (int) (val * am.getStreamMaxVolume(AudioManager.STREAM_MUSIC)), AudioManager.FLAG_PLAY_SOUND);
    }

    @ReactMethod
    public void getVolume(Promise promise) {
        float volume = am.getStreamVolume(AudioManager.STREAM_MUSIC) * 1.0f / am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        promise.resolve(volume);
    }
}
