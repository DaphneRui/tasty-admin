<template>
  <div class="order">
    <!-- 时间间隔 -->
    <el-date-picker
      v-model="detailDate"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"

      :picker-options="pickerOptions"
      @change="dateChange"
    >
    </el-date-picker>

    <!-- 按日期lineCart pieCart -->
    <div class="dateCart">
      <div
        class="lineChart"
        :style="{width: '1000px',height:'250px'}"
      ></div>
      <div
        class="pieChart"
        :style="{width: '800px',height:'250px'}"
      ></div>
    </div>
    <!-- 按购买者userCart-->
    <div
      class="customerChart"
      :style="{width: '800px',height:'250px'}"
    ></div>
  </div>
</template>

<script>
import './order.scss';
import  { order }  from '@/request/order';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import _ from 'lodash';

export default {
   name: 'Name',
   data () {
      return {
         /* 时间选择器 */
         detailDate:'',
         startTime: '',
         endTime: '',
         /* lineCart数据 */
         xAxisData: [],
         seriesData: [],
         pickerOptions: {
            shortcuts: [ {
               text: '最近一周',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近一个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近三个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [ start, end ]);
               }
            } ]
         },
         orderList:[],
         /* pie数据 */
         customerDate: [],
         timePie: [],
         customerPie: []
      };

   },
   mounted () {
      this.lineChart();
   },
   methods: {

      /* x轴数据 */
      formatEveryDay (start, end) {
         const startTime  = new Date(start);
         const endTime    = new Date(end);
         const range = moment.range(startTime, endTime);
         let date = Array.from(range.by('day', { step: 1 }));
         _.forEach(date,(item)=>{
            this.xAxisData.push(moment(item).format('YYYY-MM-DD'));
         });
      },
      /* 分组 */
      groupList (){
         /* 根据时间 line数据 */
         const cloneByTime = _.cloneDeep(this.orderList);
         const groupByTime = _.cloneDeep(this.xAxisData);
         const timeCount = _.groupBy(cloneByTime, (v)=>{
            return moment(v.createdAt).format('YYYY-MM-DD');
         });
         this.seriesData = _.map(groupByTime,(item)=>{
            return timeCount[item] ? timeCount[item].length : 0;

         });
         /* 根据时间 pie数据 */
         let total = this.orderList.length;
         let percent = '0%';
         _.map(this.seriesData ,(item,index)=>{
            if(item !== 0){
               percent = (Math.round(item / total * 10000) / 100.00) + '%';
            }
            this.timePie.push({
               name: this.xAxisData[index] + ' : ' + this.seriesData[index] + ' (' + percent + ')',
               value: this.seriesData[index]
            });
         });

         /* 根据顾客 pie数据 */
         const cloneByCustomer = _.cloneDeep(this.orderList);
         /* 顾客姓名 */
         const customerName = [];
         _.forEach(cloneByCustomer, (v)=>{
            if(v.user !== null){
               if(!_.includes(customerName,v.user.username)){
                  customerName.push(v.user.username);
               }
            }else{
               if(!_.includes(customerName,undefined)){
                  customerName.push(undefined);
               }
            }
         });
         /* 购买数量 */
         const customerCount = _.groupBy(cloneByCustomer, (v)=>{
            if(v.user !== null){
               return v.user.username;
            }
         });
         const customerData = _.map(customerName,(item)=>{
            return customerCount[item] ? customerCount[item].length : 0;

         });
         /* 百分比 */
         let customerPercent = '0%';
         _.map(customerData ,(item,index)=>{
            if(item !== 0){
               customerPercent = (Math.round(item / total * 10000) / 100.00) + '%';
            }
            this.customerPie.push({
               name: customerName[index] + ' : ' + customerData[index] + ' (' + customerPercent + ')',
               value: customerData[index]
            });
         });

      },
      /* 获取数据 */
      async dateChange (val){
         this.startTime = val[0].toISOString();
         this.endTime = val[1].toISOString();
         this.formatEveryDay(this.startTime,this.endTime);
         const result = await order({ start:this.startTime,end:this.endTime });
         this.orderList = result.list;
         this.groupList();
         this.lineChart();
         this.pieChart();
         this.customerChart();
         /* 清空数据 */
         this.xAxisData = [];
         this.seriesData = [];
         this.orderList = [];
         this.customerDate = [];
         this.timePie = [];
         this.customerPie = [];

      },

      lineChart () {
      // 基于准备好的dom，初始化echarts实例
         let lineChart = this.$echarts.init(document.getElementsByClassName('lineChart')[0]);
         // 指定图表的配置项和数据
         let option = {
            xAxis: {
               type: 'category',
               data: this.xAxisData
            },
            yAxis: {
               type: 'value'
            },
            series: [ {
               data: this.seriesData,
               type: 'line'
            } ]
         };
         // 使用刚指定的配置项和数据显示图表。
         lineChart.setOption(option);
      },
      pieChart () {
         let pieChart = this.$echarts.init(document.getElementsByClassName('pieChart')[0]);
         let option = {
            series: [
               {
                  type: 'pie',
                  radius: '55%',
                  center: [ '40%', '50%' ],
                  data: this.timePie,
               }
            ]
         };
         pieChart.setOption(option);
      },
      customerChart () {
         let customerPie = this.$echarts.init(document.getElementsByClassName('customerChart')[0]);
         let option = {
            series: [
               {
                  type: 'pie',
                  radius: '55%',
                  center: [ '50%', '50%' ],
                  data: this.customerPie,
               }
            ]
         };
         customerPie.setOption(option);
      },

   },

};
</script>

<style>

</style>