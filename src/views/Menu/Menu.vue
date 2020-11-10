<template>
  <div class="menu">
    <!-- 搜索框 -->
    <el-select
      v-model="name"
      filterable
      placeholder="请选择"
      :filter-method="nameFilter"
      class="menu-select"
      @change="getFood"
      @focus="renderRest"
    >
      <el-option
        v-for="item in matchName"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <!-- 表格 -->
    <el-table
      :data="list"
      :style="{width: '100%',margin: '50px 0 16px 0'}"
      max-height="420"
    >
      <!-- 菜品 -->
      <el-table-column
        label="菜品"
        width="auto"
      >
        <template
          slot="header"
        >
          <!-- 搜索菜价格 -->
          <div class="search">
            <span>菜品</span>
            <input
              ref="search"
              v-model="keyword"
              class="searchInput"
              placeholder="请输入关键字搜索"
              @keyup.enter="foodFilter"
            />
          </div>
        </template>

        <template slot-scope="scope">
          <span>{{ scope.row.name[`${'zh-CN'}`] }}</span>
        </template>
      </el-table-column>

      <!-- 价格 -->
      <el-table-column
        label="价格"
        width="auto"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.price | formatPrice }}
          </span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column
        label="状态"
        width="auto"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            :disabled="isEmployee === true ? true : false"
            @change="changeAvailable(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="count !== 0"
      background
      :style="{textAlign: 'right'}"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="PageSize"
      layout=" prev, pager, next, sizes"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import './menu.scss';
import { mapState,mapActions } from 'vuex';
import pinyin from 'pinyin-match';
import { setStorage,getStorage } from '@/common/utils';
import _ from 'lodash';

export default {
   name: 'Menu',
   filters:{
      formatPrice (value){
         value = (value / 100).toFixed(2);
         return '$' + value;
      }
   },
   data () {
      return {
         name: '',
         matchName: [],
         // 默认显示第几页
         currentPage:1,
         // 个数选择器
         pageSizes:[ 10,20,30,40 ],
         // 默认每页显示的条数
         PageSize:10,
         keyword: ''
      };
   },
   computed:{
      ...mapState({
         'restName': state => state.restaurant.restName,
         'list': state => state.menu.menuList.list,
         'count': state => state.menu.menuList.count,
      }),
      restNameCopy () {
         return this.restName;
      },
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
      this.getRestName();
   },
   methods: {
      ...mapActions([
         'getRestName',
         'getMenu',
         'setAvailable'
      ]),
      /* 渲染restName */
      renderRest (){
         this.matchName = this.restName;
      },
      /* restName模糊搜索 */
      nameFilter (val) {
         if (val) {
            let result = [];//声明一个空数组保存搜索内容
            this.restName.forEach(e => {//循环判断内容和拼音首字母,中文是否匹配
               let match = pinyin.match(e.name, val);
               if (match) {
                  result.push(e);
               }else if(!!~e.name.indexOf(val) || !!~e.name.toUpperCase().indexOf(val.toUpperCase())){
                  result.push(e);
               }
            });
            this.matchName = result; //返回匹配的数组
         } else {
            this.matchName = this.restName; //未输入返回原数组
         }
      },

      /* 请求菜品数据 */
      requestData (){
         this.getMenu({
            id:getStorage('restaurantId'),
            page:this.currentPage,
            limit:this.PageSize,
            keyword:this.keyword });
      },

      /* 每页显示的条数 */
      handleSizeChange (val) {
         this.PageSize = val;
         this.currentPage = 1;
         this.requestData();
      },

      /* 显示第几页 */
      handleCurrentChange (val) {
         this.currentPage = val;
         this.requestData();
      },

      /* 获取对应菜品 */
      getFood (val){
         const id = val;
         setStorage('restaurantId',id);
         this.requestData();
         /* 获取Dom,清空input */
         this.$refs.search.value = '';
      },

      /* 改变available */
      changeAvailable (row){
         if(row.available === false){
            this.setAvailable({
               id: row._id,
               msg:{ available: false },
               foodMsg:{
                  id:getStorage('restaurantId'),
                  page:this.currentPage,
                  limit:this.PageSize,
                  keyword:this.keyword
               }
            });
         }else{
            this.setAvailable({
               id: row._id,
               msg:{ available: true },
               foodMsg:{
                  id:getStorage('restaurantId'),
                  page:this.currentPage,
                  limit:this.PageSize,
                  keyword:this.keyword
               }
            });
         }
      },

      /* foodName模糊搜索 */
      foodFilter () {
         this.requestData();
         this.keyword = '';
      },
   },

};
</script>