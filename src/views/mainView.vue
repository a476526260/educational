<template>
  <div class="view">
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          :default-active="$route.path"
          :default-openeds="menuOpened"
          unique-opened
          background-color="#333"
          text-color="#fff"
          active-text-color="rgb(64, 158, 255)"
          :collapse="isCollapse"
          collapse-transition>
          <template v-for="(subMenu,index) in menu">
            <el-submenu v-if="subMenu.children&&subMenu.children.length>0" :index="String(subMenu.id)" :key="index">
              <template slot="title">
                <i class="iconfont" :class="subMenu.icon"></i>
                <span>{{subMenu.name}}</span>
              </template>
              <el-menu-item v-for="(menuItem,number) in subMenu.children" :key="number" :index="menuItem.path">
                <i class="iconfont" :class="menuItem.icon"></i>{{menuItem.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="subMenu.path" :key="index">
              <i class="iconfont" :class="subMenu.icon"></i>
              <span slot="title">{{subMenu.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="login-out">
            <el-button type="text" @click="loginOut">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <keep-alive>
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'mainView',
  data() {
    return {
      isCollapse: false,
      menuOpened: [1],
      menu: [
        {
          id: '1',
          path: '/schedule',
          name: '课程表管理',
          icon: 'icon-schedule'
        },
        {
          id: '2',
          path: '',
          name: '参数管理',
          icon: 'icon-data',
          children: [
            {
              id: '2-1',
              path: '/classroom',
              name: '教室设置',
              icon: 'icon-classroom'
            },
            {
              id: '2-2',
              path: '/week',
              name: '学周设置',
              icon: 'icon-week'
            },
            {
              id: '2-3',
              path: '/grade',
              name: '年级设置',
              icon: 'icon-class'
            },
            {
              id: '2-4',
              path: '/class',
              name: '班级设置',
              icon: 'icon-grade'
            },
            {
              id: '2-5',
              path: '/major',
              name: '专业设置',
              icon: 'icon-classroom'
            },
            {
              id: '2-6',
              path: '/attendance',
              name: '考勤设置',
              icon: 'icon-list'
            },
            {
              id: '2-7',
              path: '/achievement',
              name: '成绩设置',
              icon: 'icon-schedule'
            },
            {
              id: '2-8',
              path: '/lessonTime',
              name: '上课时间设置',
              icon: 'icon-schedule'
            }
          ]
        },
        {
          id: '5',
          path: '',
          name: '课程管理',
          icon: 'icon-course',
          children: [
            {
              id: '5-1',
              path: '/course',
              name: '课程设置',
              icon: 'icon-list',
            },
            {
              id: '5-2',
              path: '/courseClassify',
              name: '课程分类',
              icon: 'icon-classify',
            }
          ]
        },
        {
          id: '3',
          path: '/user',
          name: '用户管理',
          icon: 'icon-manage'
        },
        {
          id: '4',
          path: '/notice',
          name: '通知管理',
          icon: 'icon-classify'
        },
        {
          id: '5',
          path: '/admin',
          name: '管理员',
          icon: 'icon-admin'
        }
      ],
      query: null
    }
  },
  mounted() {
    this.query = { user: this.$route.query.name };
  },
  methods: {
    loginOut() {
      this.$confirm('是否确认退出登录？', '确认退出', {
        distinguishCancelAndClose: true,
        confirmButtonText: '退出',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss_mixin/mixins";
.view{
  @include full;
  overflow: hidden;
  .el-container{
    height: 100%;
    .el-aside{
      background: #333;
      .el-menu{
        border-right: none;
        .iconfont {
          margin-right: 5px;
          color: #fff;
        }
      }
    }
    .el-main{
      display: flex;
      flex-direction: column;
    }
    .el-header{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #333;
    }
  }
}
</style>
