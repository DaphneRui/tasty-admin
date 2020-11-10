<template>
  <div class="restaurant">
    <!-- 表单 -->
    <el-table
      :data="list.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      :style="{width: '100%',margin: '16px 0'}"
      max-height="500"
    >
      <!-- 餐馆 -->
      <el-table-column
        label="餐馆"
        width="auto"
        prop="name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name[`${'zh-CN'}`] }}</span>
        </template>
      </el-table-column>

      <!-- 地址 -->
      <el-table-column
        label="地址"
        width="auto"
        prop="address"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address.formatted }}</span>
        </template>
      </el-table-column>

      <!-- 标签 -->
      <el-table-column
        label="标签"
        width="auto"
        prop="tags"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.tags"
            :key="item.key"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="auto"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="isEmployee === true ? true : false"
            @click="handleEdit(scope.row)"
          >
            操作
          </el-button>
        </template>
      </el-table-column>

      <!-- 手动关闭 -->
      <el-table-column
        label="手动关闭"
        width="auto"
        prop="closed"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            :active-value="true"
            :inactive-value="false"
            :disabled="isEmployee === true ? true : false"
            @change="closeRest(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :page-size="PageSize"
      layout="prev, pager, next"
      :total="list.length"
      :current-page="currentPage"
      :style="{textAlign: 'right'}"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 操作框 -->
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
            v-for="item in restForm.tags"
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
            v-for="(item,index) in bankingHour"
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
              @change="changeBankingHour(item.time,index)"
            />
          </div>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="toggleModel(false)">
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
import './restaurant.scss';
import { mapActions,mapState } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import _ from 'lodash';
import { getStorage } from '@/common/utils';

var timer;
export default {
   name: 'Restaurant',
   data () {
      return {
         /* 显示操作框 */
         dialogFormVisible: false,
         /* 手动关闭 */
         closed: true,
         opened: false,
         // 默认显示第一条
         currentPage:1,
         // 默认每页显示的条数（可修改）
         PageSize:10,
         /* 操作框数据 */
         restForm: {},
         formLabelWidth: '120px',
         title: '',
         lang: 'zh-CN',
         tag:'noodle',
         name:'',
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
   computed:{
      ...mapState({
         'list': state => state.restaurant.restList,
         'tags': state => state.restaurant.tags,
      }),
      /* 判断是否为部门员工 */
      isEmployee (){
         if(_.get(getStorage('userInfo'),'role') === 'employee'){
            return true;
         }else{
            return false;
         }
      }
   },
   created () {
      this.setRestList();
      this.getTags();
      timer = setInterval(() =>{
         const date = new Date();
         /* 纽约时间 */
         const currentTime = moment.tz(date, 'America/New_York');
         /* 日期 */
         this.newYorkTime = moment.tz(date, 'America/New_York').format('YYYY-MM-DD HH:mm:ss ');
         /* 星期几 */
         this.newYorkWeek = '周' + [ '日', '一', '二', '三', '四', '五', '六' ][currentTime.day()];
      }, 1000);
   },
   beforeDestroy () {
      clearInterval(timer);
   },
   methods: {
      ...mapActions([
         'setRestList',
         'getTags',
         'changeClosed',
         'changeRestList',
      ]),
      // 控制弹框显示隐藏
      toggleModel (bool) {
         this.dialogFormVisible = bool;
      },
      /* 改变默认的页数 */
      handleCurrentChange (val) {
         this.currentPage = val;
      },
      /* 操作按钮 */
      handleEdit (row) {
         this.toggleModel(true);
         /* 深拷贝当前编辑项，不影响原数据 */
         this.restForm = JSON.parse(JSON.stringify(row));
         /* 操作框数据 */
         this.title = JSON.parse(JSON.stringify(row.name));
         this.name = JSON.parse(JSON.stringify(row.name));
         /* 营业时间 */
         this.getBankingHours(row.hours);
      },

      /* 切换中英文 */
      changeLang (val){
         this.lang = val;
      },
      /* 增加标签 */
      addTags (val){
         if(!_.includes(this.restForm.tags, val)){
            this.restForm.tags.push(val);
         }
      },
      /* 删除标签 */
      removeTags (tag) {
         this.restForm.tags.splice(this.restForm.tags.indexOf(tag), 1);
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
      changeBankingHour (val,index){
         this.bankingHour[index].time = val;
         this.newHours = _.map(this.restForm.hours,(v,index)=>{
            /* 开始时间 */
            const startTime = this.bankingHour[index].time[0].getHours() * 60 + this.bankingHour[index].time[0].getMinutes();
            v.start = _.get(this.restForm,'hours[index].start',startTime );
            /* 结束时间 */
            const endTime = this.bankingHour[index].time[1].getHours() * 60 + this.bankingHour[index].time[1].getMinutes();
            v.end = _.get(this.restForm,'hours[index].end',endTime );
            return v;
         });

      },

      /* 手动关闭 */
      closeRest (row){
         if(row.isClosed === false){
            this.changeClosed({ id: row._id, closed: null });
         }else{
            this.changeClosed({ id: row._id, closed: { closed: true } });
         }
      },

      /* 保存修改 */
      saveChanges (){
         const data = {
            name: this.name,
            tags: this.restForm.tags,
            hours: this.newHours
         };
         this.changeRestList({ id: this.restForm._id, msg: data });
         this.toggleModel(false);
      }
   },
};
</script>