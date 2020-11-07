<template>
  <div>
    <el-container class="admin">
      <!-- aside -->
      <el-aside
        :style="{width: isCollapse ? '64px': '200px' }"
        class="aside"
      >
        <!-- aside header -->
        <el-header
          :style="{height: '120px'}"
          class="aside-logo"
        >
          <img
            src="@/assets/logo.png"
            alt=""
          >
        </el-header>
        <!-- aside main -->
        <el-main
          :style="{padding: '0px'}"
          class="aside-main"
        >
          <!-- 导航ul -->
          <el-menu
            default-active="/admin/restaurant"
            active-text-color="#fff"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            router
          >
            <!-- 导航li -->
            <el-menu-item
              index="/admin/restaurant"
            >
              <i class="el-icon-pie-chart"></i>
              <span slot="title">餐馆</span>
            </el-menu-item>
            <el-menu-item
              index="/admin/menu"
            >
              <i class="el-icon-monitor"></i>
              <span slot="title">菜单</span>
            </el-menu-item>
            <el-menu-item
              index="/admin/order"
            >
              <i class="el-icon-monitor"></i>
              <span slot="title">订单</span>
            </el-menu-item>
          </el-menu>
        </el-main>
        <!-- aside 收缩 -->
        <el-radio-group
          v-model="isCollapse"
          class="aside-collapse"
          :style="{width: isCollapse ? '64px': '200px' }"
        >
          <el-radio-button
            v-show="!isCollapse"
            :label="true"
            :style="{width: '200px' }"
            @click="isCollapse === false"
          >
            <i class="el-icon-arrow-left"></i>
          </el-radio-button>
          <el-radio-button
            v-show="isCollapse"
            :label="false"
            :style="{width: '64px' }"
            @click="isCollapse === true"
          >
            <i class="el-icon-arrow-right"></i>
          </el-radio-button>
        </el-radio-group>
      </el-aside>
      <!-- 中间内容 -->
      <el-container>
        <!-- header -->
        <el-header></el-header>
        <!-- main -->
        <el-main>
          <!-- routeName -->
          <el-breadcrumb
            separator="/"
          >
            <el-breadcrumb-item>
              Admin
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <span>{{ routeName }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>

          <!-- router-view -->
          <router-view />
        </el-main>

        <!-- footer -->
        <el-footer class="admin-footer">
          DELIVERY ADMIN ©2020 Created by RX
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import './admin.scss';
export default {
   name: 'Admin',
   data () {
      return {
         isCollapse: false,
      };
   },
   computed: {
      routeName () {
         return this.$route.name;
      }
   },

};
</script>

