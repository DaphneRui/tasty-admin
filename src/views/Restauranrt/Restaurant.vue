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
            :disabled="$permission()"
            type="primary"
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
            :disabled="$permission()"
            :active-value="true"
            :inactive-value="false"
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
    <Dialog
      :rest-form="restForm"
      :tags="tags"
      :visable="dialogFormVisible"
      @closeDialog="toggleModel"
    />
  </div>
</template>

<script>
import './restaurant.scss';
import { mapActions,mapState } from 'vuex';
import _ from 'lodash';
import Dialog from '@/components/Dialog/Dialog';

export default {
   name: 'Restaurant',
   components: {
      Dialog
   },
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
         restForm:{}
      };
   },
   computed:{
      ...mapState({
         'list': state => state.restaurant.restList,
         'tags': state => state.restaurant.tags,
      }),
   },
   created () {
      this.setRestList();
      this.getTags();

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

         /* 深拷贝当前编辑项，不影响原数据 */
         this.restForm = _.cloneDeep(row);
         this.toggleModel(true);

      },

      /* 手动关闭 */
      closeRest (row){
         if(row.isClosed === false){
            this.changeClosed({ id: row._id, closed: null });
         }else{
            this.changeClosed({ id: row._id, closed: { closed: true } });
         }
      },

   },
};
</script>