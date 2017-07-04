package com.coship.live.rtmp.thread;

/**
 * Created by gp on 2016/5/10.
 */
public class LoopThread extends Thread implements Runnable {
    private boolean isRunning = false;
    private boolean isFinish = true;
    private IRunnableHandle runnableHandle;
    private LoopThread(){

    }

    public boolean getStatus(){
        return isFinish;
    }

    public LoopThread(IRunnableHandle runnableHandle){
        this.runnableHandle = runnableHandle;
    }
    @Override
    public synchronized void start() {
        isRunning = true;
        super.start();
    }

    public void stop(boolean isSynchronized) {
        isRunning = false;
        //保持线程，知道方法执行完
        if(isSynchronized){
            while(!isFinish){

            }
        }
    }

    @Override
    public void run() {
        isFinish = false;

        while(isRunning) {
            runnableHandle.runFunction();
        }

        isFinish = true;
    }
}
