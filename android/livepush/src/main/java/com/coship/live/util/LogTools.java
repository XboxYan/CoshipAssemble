package com.coship.live.util;

/**
 * Created by lake on 16-3-16.
 */

import android.util.Log;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.net.UnknownHostException;

public class LogTools {
    protected static final String TAG = "RESLog";
    public static boolean enableLog = true;

    public static boolean isEnableLog() {
        return enableLog;
    }

    public static void setEnableLog(boolean enableLog) {
        LogTools.enableLog = enableLog;
    }

    public static void e(String content) {
        if (!enableLog) {
            return;
        }
        Log.e(TAG, content);
    }
    public static void e(String tag,String content) {
        if (!enableLog) {
            return;
        }
        Log.e(tag, content);
    }
    public static void v(String tag,String content) {
        if (!enableLog) {
            return;
        }
        Log.v(tag, content);
    }
    public static void i(String tag,String content) {
        if (!enableLog) {
            return;
        }
        Log.i(tag, content);
    }

    public static void d(String content) {
        if (!enableLog) {
            return;
        }
        Log.d(TAG, content);
    }
    public static void d(String tag,String content) {
        if (!enableLog) {
            return;
        }
        Log.d(tag, content);
    }

    public static void trace(String msg) {
        if (!enableLog) {
            return;
        }
        trace(msg, new Throwable());
    }

    public static void trace(Throwable e) {
        if (!enableLog) {
            return;
        }
        trace(null, e);
    }

    public static void trace(String msg, Throwable e) {
        if (!enableLog) {
            return;
        }
        if (null == e || e instanceof UnknownHostException) {
            return;
        }

        final Writer writer = new StringWriter();
        final PrintWriter pWriter = new PrintWriter(writer);
        e.printStackTrace(pWriter);
        String stackTrace = writer.toString();
        if (null == msg || msg.equals("")) {
            msg = "================error!==================";
        }
        Log.e(TAG, "==================================");
        Log.e(TAG, msg);
        Log.e(TAG, stackTrace);
        Log.e(TAG, "-----------------------------------");
    }
}