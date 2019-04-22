import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/login.vue'),
      meta: {
        requireAuth: false,
        title: '登录'
      }
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue'),
      meta: {
        requireAuth: false,
        title: '登录'
      }
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('./views/mainView.vue'),
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/classroom',
          name: 'classroom',
          component: () => import('./views/classroom.vue'),
          meta: {
            requireAuth: true,
            title: '教室管理'
          }
        },
        {
          path: '/week',
          name: 'week',
          component: () => import('./views/week.vue'),
          meta: {
            requireAuth: true,
            title: '课周管理'
          }
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: () => import('./views/schedule.vue'),
          meta: {
            requireAuth: true,
            title: '课程表'
          }
        },
        {
          path: '/grade',
          name: 'grade',
          component: () => import('./views/grade.vue'),
          meta: {
            requireAuth: true,
            title: '年级管理'
          }
        },
        {
          path: '/class',
          name: 'class',
          component: () => import('./views/class.vue'),
          meta: {
            requireAuth: true,
            title: '班级管理'
          }
        },
        {
          path: '/major',
          name: 'major',
          component: () => import('./views/major.vue'),
          meta: {
            requireAuth: true,
            title: '专业管理'
          }
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('./views/user.vue'),
          meta: {
            requireAuth: true,
            title: '用户管理'
          }
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('./views/admin.vue'),
          meta: {
            requireAuth: true,
            title: '管理员管理'
          }
        },
        {
          path: '/course',
          name: 'course',
          component: () => import('./views/course.vue'),
          meta: {
            requireAuth: true,
            title: '课程管理'
          }
        },
        {
          path: '/courseClassify',
          name: 'courseClassify',
          component: () => import('./views/courseClassify.vue'),
          meta: {
            requireAuth: true,
            title: '课程分类管理'
          }
        },
        {
          path: '/attendance',
          name: 'attendance',
          component: () => import('./views/attendance.vue'),
          meta: {
            requireAuth: true,
            title: '考勤管理'
          }
        },
        {
          path: '/notice',
          name: 'notice',
          component: () => import('./views/notice.vue'),
          meta: {
            requireAuth: true,
            title: '通知管理'
          }
        },
        {
          path: '/achievement',
          name: 'achievement',
          component: () => import('./views/achievement.vue'),
          meta: {
            requireAuth: true,
            title: '成绩管理'
          }
        },
        {
          path: '/lessonTime',
          name: 'lessonTime',
          component: () => import('./views/lessonTime.vue'),
          meta: {
            requireAuth: true,
            title: '课时管理'
          }
        }
      ]
    }
  ]
})
