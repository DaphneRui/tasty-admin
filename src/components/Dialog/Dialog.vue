<template>
  <div>
    <el-dialog
      :title="title[`${lang}`]"
      :visible.sync="dialogFormVisible"
      :style="{width: '1450px'}"
    >
      <el-form
        :model="restForm"
      >
        <!-- 餐馆名称 -->
        <el-form-item
          label="餐馆名称:"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="name[`${lang}`]"
            class="input-with-select"
          >
            <el-select
              slot="prepend"
              v-model="lang"
              @change="changeLang"
            >
              <el-option
                v-for="item in language"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <!-- 餐馆标签 -->
        <el-form-item
          label="餐馆标签:"
          :label-width="formLabelWidth"
          prop="tags"
        >
          <el-select
            v-model="tag"
            @change="addTags"
          >
            <el-option
              v-for="item in tags"
              :key="item.key"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>

          <el-tag
            v-for="item in rendertags"
            :key="item"
            closable
            :disable-transitions="false"
            @close="removeTags(item)"
          >
            {{ item }}
          </el-tag>
        </el-form-item>

        <!-- 开门时间 -->
        <el-form-item
          label="开门时间:"
          :label-width="formLabelWidth"
          prop="hours"
        >
          <!-- 纽约时间 -->
          <div>
            <p>纽约当地时间</p>
            <div class="newYork">
              <div>{{ newYorkTime }}</div><div>{{ newYorkWeek }}</div>
            </div>
          </div>
          <!-- 选择营业时间 -->
          <div
            v-for="item in bankingHour"
            :key="item.id"
          >
            <el-input
              :model="item.week"
              :style="{width: '100px'}"
              :disabled="true"
              :placeholder="item.week"
            >
            </el-input>
            <el-time-picker
              v-model="item.time"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              @change="changeBankingHour(item.time)"
            />
          </div>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveChanges"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import './dialog.scss';
import moment from 'moment-timezone';
moment.locale('zh-cn');
import { v4 as uuidv4 } from 'uuid';
import { mapActions } from 'vuex';

var timer;
export default {
   name: 'Dialog',
   props: {
      restForm:{
         type:Object,
         required:true
      },
      dialogFormVisible:{
         type:Boolean,
         required:true
      },
      tags:{
         type:Array,
         required:true
      }
   },
   data () {
      return {
         /* 操作框数据 */
         formLabelWidth: '120px',
         title: '',
         name: '',
         lang: 'zh-CN',
         tag:'noodle',
         rendertags: '',
         /* 中英文 */
         language: [
            { value: 'zh-CN',label: '中文' },
            { value: 'en-US',label: '英文' }
         ],
         /* 纽约时间 */
         newYorkTime: '',
         newYorkWeek: '',
         /* 营业时间 */
         bankingHour: [],
         newHour: []

      };
   },
   created () {
      /* 纽约时间 */
      this.getNewYorkTime();
      timer = setInterval(this.getNewYorkTime(),1000);
      /* 操作框数据 */
      this.title = JSON.parse(JSON.stringify(this.$props.restForm.name));
      this.name = JSON.parse(JSON.stringify(this.$props.restForm.name));
      this.rendertags = this.$props.restForm.tags;
      /* 营业时间 */
      this.getBankingHours(this.$props.restForm.hours);
   },

   beforeDestroy () {
      clearInterval(timer);
   },

   methods: {
      ...mapActions([
         'changeRestList',
      ]),

      /* 切换中英文 */
      changeLang (val){
         this.lang = val;
      },

      /* 增加标签 */
      addTags (val){
         if(!_.includes(this.$props.restForm.tags, val)){
            this.$props.restForm.tags.push(val);
         }
      },

      /* 删除标签 */
      removeTags (tag) {
         this.$props.restForm.tags.splice(this.$props.restForm.tags.indexOf(tag), 1);
      },

      /* 纽约时间 */
      getNewYorkTime (){
         const date = new Date();
         /* 日期 */
         this.newYorkTime = moment.tz(date, 'America/New_York').format('YYYY-MM-DD HH:mm:ss');
         /* 星期几 */
         this.newYorkWeek = moment.tz(date, 'America/New_York').format('dddd');
      },

      /* 营业时间 */
      getBankingHours (bankingHours){
         /* 星期 */
         let bankingWeek = [
            { week:'星期一',id:uuidv4() },
            { week:'星期二',id:uuidv4() },
            { week:'星期三',id:uuidv4() },
            { week:'星期四',id:uuidv4() },
            { week:'星期五',id:uuidv4() },
            { week:'星期六',id:uuidv4() },
            { week:'星期天',id:uuidv4() }
         ];

         this.bankingHour = _.map(bankingWeek,(v,index)=>{
            /* 开始时间 */
            const startTime = _.get(bankingHours[index], 'start');
            /* 结束时间 */
            const endTime = _.get(bankingHours[index], 'end');

            v.time = [ moment().startOf('day').add(startTime,'minutes').toDate(), moment().startOf('day').add(endTime,'minutes').toDate() ];

            return v;
         });

      },

      /* 改变营业时间 */
      changeBankingHour (val){
         this.newHours = _.map(this.restForm.hours,(v)=>{
            /* 开始时间 */
            const startTime = val[0].getHours() * 60 + val[0].getMinutes();
            v.start = _.get(this.restForm,'hours[index].start',startTime );
            /* 结束时间 */
            const endTime = val[1].getHours() * 60 + val[1].getMinutes();
            v.end = _.get(this.restForm,'hours[index].end',endTime );
            return v;
         });

      },

      /* 关闭Dialog */
      closeDialog (){
         this.$emit('closeDialog', false);
      },

      /* 保存修改 */
      saveChanges (){
         const data = {
            name: this.name,
            tags: this.restForm.tags,
            hours: this.newHours
         };
         this.changeRestList({ id: this.restForm._id, msg: data });
         this.closeDialog();
      }

   },

};
</script>