import notification from './Notification';
import { observable,action,computed,autorun,untracked,whyRun} from 'mobx';
import moment from 'moment';

import fetchData from './Fetch';
import Store from './LoginStore';

class ProgramOrder {
    //orderId和programId分别索引一次
    @observable programsOidMap = new Map();//key:orderId  value:program;
    @observable programsPidMap = new Map();//key:programId  value:program;

    @observable time = moment();

    constructor(){
        // this.refresh();

        // 每次重新发布全部本地通知
        autorun(()=>{
            notification.clearAll();
            if(this.orderPrograms){
                this.orderPrograms.forEach((program)=>{
                    notification.sendLocalNotification(program);
                })
            }
        })

        // 定时更新数据
        autorun(()=>{
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                this.time = moment();
            }, this.nextOrderTime > 0 ? this.nextOrderTime : 0);
        })
    }

    // 预约状态的节目单
    @computed get orderPrograms(){
        const result = this.programsOidMap.values().filter((prog)=>this.time.diff(moment(prog.startTime)) < 0);
        return this._sort(result, (a,b)=>a.startTime>b.startTime);
    }

    //过期的节目单（已经过了预约时间的
    @computed get outDateProgram(){
        const result = this.programsOidMap.values().filter((prog)=>this.time.diff(moment(prog.startTime)) >= 0);
        return this._sort(result, (a,b)=>a.startTime<b.startTime);
    }

    _sort(arr, compare){
        for(let i=0;i<arr.length;i++){
            for(let j=i+1;j<arr.length;j++){
                if(compare(arr[i], arr[j])){
                    const tmp = arr[i];
                    arr[i]=arr[j];
                    arr[j]=tmp;
                }
            }
        }
        return arr;
    }

    //最近的一次预约时间（毫秒）
    @computed get nextOrderTime(){
        if(this.orderPrograms.length > 0){
            return moment(this.orderPrograms[0].startTime).diff(moment());
        }
        return 0;
    }

    deleteByProgram(program:Object){
        const orderId = program.orderId ? program.orderId : this.programsPidMap.get(program.programId).orderId;
        return this.delete(orderId);
    }

    @action
    delete(orderId:String){
        return fetchData('DelProgramOrder',{
            par:{
                orderId: orderId
            }
        },(data)=>{
            if(data.success){
                const program = this.programsOidMap.get(orderId);
                if(program){
                    this._removeOrderInfo(program)
                }
            }
  		})
    }

    @action
    deletes(orderId:String){
        return fetchData('DelProgramOrder',{
            par:{
                orderId: orderId
            }
        },(data)=>{
            this.refresh();
  		})
    }

    add(program:Object){
        return fetchData('AddProgramOrder',{
            par:{
                programId: program.programId
            }
        },(data)=>{
            if(data.success){
                program.orderId = data.programList[0]?data.programList[0].orderId:'111111';
                if(program.startDateTime && !program.startTime ){
                    program.startTime = moment(program.startDateTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
                }
                this._addOrderInfo(program);
            }
  		})
    }

    hasOrdered(programId:String){
        return this.programsPidMap.has(programId);
    }

    trigger(program:Object){
        return this.hasOrdered(program.programId) ? this.deleteByProgram(program) : this.add(program);
    }

    @action
    refresh(){
        if(Store.needLogin){
            return;//ignore
        }
        fetchData('GetProgramOrder',{},action((data)=>{
            const datas = data.programList ? data.programList : [];
            this.programsOidMap.clear();
            this.programsPidMap.clear();
            datas.forEach((program) => {
                this._addOrderInfo(program);
            })
  		}))
    }

    @action
    _removeOrderInfo(program){
        this.programsOidMap.delete(program.orderId);
        this.programsPidMap.delete(program.programId);
    }

    @action
    _addOrderInfo(program){
        this.programsOidMap.set(program.orderId, program)
        this.programsPidMap.set(program.programId, program)
    }
}

const programOrder = new ProgramOrder();
export default programOrder;
