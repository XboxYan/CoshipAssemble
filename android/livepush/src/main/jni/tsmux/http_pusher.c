#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <netdb.h>
#include <sys/types.h> 
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include <jni.h>
#include <android/log.h>

#define  LOG_TAG   "TS_MUX"
#define  LOGI(...)  __android_log_print(ANDROID_LOG_INFO,LOG_TAG,__VA_ARGS__)
#define  LOGE(...)  __android_log_print(ANDROID_LOG_ERROR,LOG_TAG,__VA_ARGS__)

/* 定义全局的客户端套接字 */
int g_fd;

/* 局部函数前向声明 */
static int MakeRequestHeader(char *szHeader, const char *lpszUri, const char *lpszHost);
static int SendBuffer(int nFD, const char *lpszBuf, int nLen,int tt);
static int SendChunkData(int nFD, const char *lpszBuf, int nLen);
static int ParseUrl(const char *lpszUrl, char *szHost, char *szIp, unsigned short *uPort, char *szUri);

/*
 * 功能: 连接服务器
 * 参数: 
 *      lpszUrl: http://ip:port/live/{token}
 * 返回: 成功返回 0; 失败返回 -1
 */
int HttpPusherConnect(const char *lpszUrl)
{
    LOGE("connect begin");
    int result = -1;

    do
    {
        g_fd = -1;

        // 解析 url, 分离出 ip/port/uri
        char szHost[64];
        char szIp[32];
        char szUri[256];
        unsigned short uPort;
        if (-1 == ParseUrl(lpszUrl, szHost, szIp, &uPort, szUri))
        {
           break;
        }
        LOGE("lpszUrl:%s",lpszUrl);
        LOGE("szHost:%s",szHost);
        LOGE("szIp:%s",szIp);
        LOGE("uPort:%u",uPort);
        LOGE("szUri:%s",szUri);

        // 创建套接字
        g_fd = socket(AF_INET, SOCK_STREAM, 0);
        if (-1 == g_fd)
        {
            break;
        }

        LOGE("g_fd_1:%d",g_fd);

        // 设置地址结构体
        struct sockaddr_in addr;
        addr.sin_port        = htons(uPort);
        addr.sin_family      = AF_INET;
        addr.sin_addr.s_addr = inet_addr(szIp);

//        socklen_t sendbuflen = 0;
//        socklen_t len = sizeof(sendbuflen);
//        getsockopt(g_fd, SOL_SOCKET, SO_SNDBUF, (void*)&sendbuflen, &len);
//        LOGE("default,sendbuf:%d/n", sendbuflen);
//
//        sendbuflen = 1024*1024;
//        setsockopt(g_fd, SOL_SOCKET, SO_SNDBUF, (void*)&sendbuflen, len);
//        getsockopt(g_fd, SOL_SOCKET, SO_SNDBUF, (void*)&sendbuflen, &len);
//        LOGE("now,sendbuf:%d/n", sendbuflen);

        // 连接服务器
        if (-1 == connect(g_fd, (struct sockaddr*)&addr, sizeof(struct sockaddr)))
        {
            break;
        }
        LOGE("connect sucdess");
        LOGE("g_fd_2:%d",g_fd);
        // 发送请求头
        char szHeader[1024];
        int nHeaderSize = MakeRequestHeader(szHeader, szUri, szHost);
        if (-1 == SendBuffer(g_fd, szHeader, nHeaderSize,0))
        {
            break;
        }
        LOGE("send head sucdess");
        LOGE("g_fd_3:%d",g_fd);
        result = 0;
    } while (0);
    LOGE("connect end:%d",result);
    return result;
}

int HttpPusherPush(unsigned char *lpszBuf, int nLen, long long lTimestamp)
{
//    LOGE("pushData%d",nLen);
    //LOGE("HttpPusherPush_g_fd:%d",g_fd);
    if(g_fd == -1){
        //网络已经断开了，不发数据
        LOGE("HttpPusherClosed do not send data");
        return 0;
    }
    const char *mybuf = (const char*)lpszBuf;
    return SendChunkData(g_fd, mybuf, nLen);
}
int GetPushConnectStatus(){
    if(g_fd == -1){
        return 0;
    }else{
        return 1;
    }
}

int HttpPusherClose()
{
    LOGE("HttpPusherClose");
    if (g_fd != -1)
    {
        close(g_fd);
        g_fd = -1;
    }
    LOGE("HttpPusherClose1");
    return 0;
}

static int MakeRequestHeader(char *szHeader, const char *lpszUri, const char *lpszHost)
{
    return sprintf(szHeader,
                   "PUT %s HTTP/1.1\r\n"
                           "Host: %s\r\n"
                           "User-Agent: Http Pusher Kernel V1.0\r\n"
                           "Content-Type: application/octet-stream\r\n"
                           "Transfer-Encoding: chunked\r\n"
                           "\r\n",
                   lpszUri, lpszHost);
}

static int SendBuffer(int nFD, const char *lpszBuf, int nLen,int tt)
{
    int result = -1;
    while (1)
    {
        int nSentSize = send(nFD, lpszBuf, nLen, 0);
        if (nSentSize == 0)
        {
            LOGE("nFD1:%d",nFD);
            break;
        }
        else if (nSentSize == -1)
        {
            if(tt == 1){
                LOGE("有ERROR:%d",errno);
            }

            if (errno == EINTR)
            {
                LOGE("EINTR:%d",errno);
                continue;
            }
            // LOGE("nFD2:%d",nFD);
            break;
        }
        if(tt == 1&&nSentSize != 188){
            LOGE("不是188 出异常了。。。。");
        }

        result = 0;
        break;
    }

    return result;
}

static int SendChunkData(int nFD, const char *lpszBuf, int nLen)
{


    char szChunkHeader[16];
    int nChunkHeaderSize = sprintf(szChunkHeader, "%x\r\n", nLen);


    if (-1 == SendBuffer(nFD, szChunkHeader, nChunkHeaderSize,0))
    {
        LOGE("SendBuffer RETURN -1 ");
        return -1;
    }

    if (-1 == SendBuffer(nFD, lpszBuf, nLen,1))
    {
        LOGE("SendBuffer RETURN -2 ");
        return -1;
    }

    if (-1 == SendBuffer(nFD, "\r\n", 2,0))
    {
        LOGE("SendBuffer RETURN -3 ");
        return -1;
    }
//    LOGE("SendChunkData：%d",nFD);
    return 0;
}

static int ParseUrl(const char *lpszUrl, char *szHost, char *szIp, unsigned short *uPort, char *szUri)
{
    int result = -1;

    do
    {
        // lpszUrl: http://ip:port/uri

        const char *lpszHostPos = strstr(lpszUrl, "//");
        if (NULL == lpszHostPos)
        {
            break;
        }

        // Uri的起始偏移
        lpszHostPos += 2;
        const char *lpszUriPos = strstr(lpszHostPos, "/");
        if (NULL == lpszUriPos)
        {
            // 示例: http://www.baidu.com
            strcpy(szHost, lpszHostPos);
            strcpy(szUri, "/");
        }
        else
        {
            // 示例: http://www.baidu.com/
            //      http://www.baidu.com/post/1.html
            //      http://www.baidu.com/post/1.html?tag=100
            strncpy(szHost, lpszHostPos, lpszUriPos - lpszHostPos);
            szHost[lpszUriPos - lpszHostPos] = '\0';
            strcpy(szUri, lpszUriPos);
        }

        // 解析出 IP 和端口号
        int a, b, c, d;
        int nPort = 80;
        if (sscanf(lpszHostPos, "%d.%d.%d.%d:%d", &a, &b, &c, &d, &nPort) >= 4)
        {
            // 示例: 192.168.1.100:8080
            //      192.168.1.100
            sprintf(szIp, "%d.%d.%d.%d", a, b, c, d);
            *uPort = nPort;

            result = 0;
            break;
        }

        // 示例: www.baidu.com:8080
        //      www.baidu.com
        char szDomain[255];
        const char *lpszPort = strstr(lpszHostPos, ":");
        if (NULL == lpszPort)
        {
            *uPort = 80;
            strcpy(szDomain, lpszHostPos);
        }
        else
        {
            *uPort = atoi(lpszPort + 1);
            strncpy(szDomain, lpszHostPos, lpszPort - lpszHostPos);
            szDomain[lpszPort - lpszHostPos] = '\0';
        }

        // 将域名转换成 IP 地址
        struct hostent *h;
        if ((h = gethostbyname(szDomain)) == NULL)
        {
            break;
        }

        strcpy(szIp, inet_ntoa(*((struct in_addr *)h->h_addr)));
        result = 0;
    } while (0);

    return result;
}

// int main()
// {
//     if (-1 == HttpPusherConnect("http://172.20.100.50:8010/live/token"))
//     {
//         printf("Failed to connect to server\n");
//         return -1;
//     }
// 
//     if (-1 == HttpPusherPush("Hello, world!", 13, 0))
//     {
//         printf("Failed to send data\n");
//         return -1;
//     }
// 
//     HttpPusherClose();
// 
//     printf("OK\n");
//     return 0;
// }
