#ifndef ___HTTP__PUSHER__20160823___
#define ___HTTP__PUSHER__20160823___

#ifdef __cplusplus
extern "C" {
#endif

int HttpPusherConnect(const char *lpszUrl);
int HttpPusherPush(unsigned char *lpszBuf, int nLen, long long lTimestamp);
int HttpPusherClose();
int GetPushConnectStatus();
#ifdef __cplusplus
}
#endif

#endif
