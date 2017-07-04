ifeq ($(APP_ABI), x86)
LIB_NAME_PLUS := x86
else
LIB_NAME_PLUS := armeabi
endif

LOCAL_PATH := $(call my-dir)

#libray tspush
include $(CLEAR_VARS)
LOCAL_MODULE := tspush
LOCAL_LDFLAGS := -Wl,--build-id
LOCAL_LDLIBS := \
	-llog \
	-lz \
	-lm \

LOCAL_SRC_FILES := \
	tsmux/http_pusher.c \
	tsmux/util.c \
	tsmux/Audio.cpp \
    tsmux/FileIo.cpp \
    tsmux/Mux.cpp \
    tsmux/Mybs.cpp \
    tsmux/Mycrc_32.cpp \
    tsmux/Ts.cpp \
    tsmux/Video.cpp \
    tsmux/HttpPusher.cpp \

LOCAL_C_INCLUDES := $(LOCAL_PATH)/tsmux
LOCAL_CPP_INCLUDES := $(LOCAL_PATH)/tsmux
include $(BUILD_SHARED_LIBRARY)


ifeq ($(APP_ABI), x86)
LOCAL_CFLAGS := -DUSE_X86_CONFIG
else
LOCAL_CFLAGS := -DUSE_ARM_CONFIG
endif



