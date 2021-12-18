// pages/mypubdetail/mypubdetail.js
import {
  formatDate,
  formatTime,
} from '../../utils/util.js'

let app = getApp()
let host = getApp().globalData.host

Page({

  data: {
    picPrefix: host + '/media/',
    task: app.globalData.tempReplyTask,
    taskTypeNo2Name: app.globalData.taskTypeNo2Name,
    taskTypeArray: app.globalData.taskTypeArray,
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    taskState2Color: app.globalData.taskState2Color,
    enddate: '',
    replyid: '',
    endtime: '',
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      replyid: options.replyid
    })
    let task = app.globalData.tempReplyTask
    this.updateDataWithTask(task)
  },

  onShow: function () {
    this.sendRefreshRequest(false)
  },

  updateDataWithTask: function (task) {
    this.setData({
      task: task,
      enddate: formatDate(task.endtime),
      endtime: formatTime(task.endtime)
    })
    console.log(this.data)
  },

  sendRefreshRequest: function (isPullDownRefresh) {
    let that = this
    wx.request({
      url: host + '/task/reply/query/id/',
      data: {replyid: this.data.replyid},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let code = res.data.status
        let data = res.data
        if (code == 200) {
          that.updateDataWithTask(data.data.task)
          if (isPullDownRefresh) {
            wx.showToast({
              title: '数据刷新成功',
              icon: 'success',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: data.msg == null ? '刷新失败, 请尝试下拉页面刷新' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '刷新失败, 请尝试下拉页面刷新' : res.msg,
          icon: 'none'
        })
      },
      complete(res) {
        wx.stopPullDownRefresh()
      }
    })
  },

  onPullDownRefresh: function () {
    this.sendRefreshRequest(true)
  }
})