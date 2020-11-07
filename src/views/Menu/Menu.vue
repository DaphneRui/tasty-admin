<template>
  <div class="menu">
    <!-- 搜索框 -->
    <el-select
      v-model="value"
      filterable
      @change="getRestName"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <!-- 表格 -->
    <!-- <el-table
      :data="tableData"
      :style="{width: '100%',marginTop: '50px'}"
    > -->
    <!-- <el-table-column
        label="菜品"
        width="auto"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column> -->
    <!-- <i class="el-icon-price-tag"></i> -->
    <!-- <el-table-column
        label="价格"
        width="auto"
      >
        <template slot-scope="scope">
          <el-popover
            trigger="hover"
            placement="top"
          >
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div
              slot="reference"
              class="name-wrapper"
            >
              <el-tag size="medium">
                {{ scope.row.name }}
              </el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="auto"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row"
          >
          </el-switch>
        </template>
      </el-table-column> -->
    <!-- </el-table> -->
  </div>
</template>

<script>
import './menu.scss';
import { mapState,mapActions } from 'vuex';
import _ from 'lodash';
export default {
   name: 'Menu',
   data () {
      return {
         options: [ {
            value: '选项1',
            label: '黄金糕'
         }, {
            value: '选项2',
            label: '双皮奶'
         }, {
            value: '选项3',
            label: '蚵仔煎'
         }, {
            value: '选项4',
            label: '龙须面'
         }, {
            value: '选项5',
            label: '北京烤鸭'
         } ],
         value: '',
         tableData: [ {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
         }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
         }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
         }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
         } ]
      };
   },
   computed:{
      ...mapState({
         'list': state => state.restaurant.restList,
      }),
   },
   created () {
      this.setRestList();

   },
   methods: {
      ...mapActions([
         'setRestList',
      ]),

      /* 获取所有restaurant，获取其中所有的中文名 */
      getRestName (){
         _.forEach(this.list,(item)=>{
            console.log(item.name[`${'zh-CN}'}`]);
         });
      },
      handleEdit (index, row) {
         console.log(index, row);
      },
      handleDelete (index, row) {
         console.log(index, row);
      }
   }
};
</script>