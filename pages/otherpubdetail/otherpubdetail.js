// pages/mypubdetail/mypubdetail.js
import {
  formatDate,
  formatTime,
} from '../../utils/util.js'
import wxValidate from '../../utils/wxValidate.js'

let app = getApp()
let host = getApp().globalData.host

Page({
  initValidate: function () {
    this.descriptionValidate = new wxValidate({
      description: {
        required: true,
        minlength: 5
      }
    }, {
      description: {
        required: '请输入响应描述',
        minlength: '响应描述至少为5个字符'
      }
    })
  },
  data: {
    picPrefix: host + '/media/',
    task: {},
    taskTypeNo2Name: app.globalData.taskTypeNo2Name,
    taskTypeArray: app.globalData.taskTypeArray,
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    taskState2Color: app.globalData.taskState2Color,
    enddate: '',
    replyid: '',
    endtime: '',
    source: '',
    acceptedNum: 0
  },

  onLoad: function (options) {
    console.log(options)
    let source = options.source
    var task = {}
    this.setData({
      source: source
    })
    if (source == 'myreply') {
      this.data.replyid = options.replyid
      task = app.globalData.tempReplyTask
    }
    if (source == 'index') {
      this.initValidate()
      task = app.globalData.tempCommunityTask
    }
    this.updateDataWithTask(task)
  },

  onShow: function () {
    this.sendRefreshRequest(false)
  },

  handleReplyTask: function() {
    let that = this
    wx.showModal({
      title: '响应确认',
      editable: true,
      confirmColor: '#6782F2',
      placeholderText: '请输入响应描述',
      success(res) {
        if (res.confirm) {
          let key = 'description'
          let e = {};
          e.detail = {};
          e.detail.value = {};
          e.detail.value[key] = res.content
          // check
          console.log(e.detail.value[key])
          if (!that.descriptionValidate.checkForm(e)) {
            const error = that.descriptionValidate.errorList[0];
            console.log(error)
            wx.showToast({
              title: `${error.msg}`,
              icon: 'none'
            })
            return false
          }
          // then
          let inputdata = {}
          inputdata[key] = res.content
          inputdata['taskid'] = that.data.task.taskid
          that.sendReplyTaskRequest(inputdata)
        }
      }
    })
  },

  updateDataWithTask: function (task) {
    this.setData({
      task: task,
      enddate: formatDate(task.endtime),
      endtime: formatTime(task.endtime)
    })
    if (this.data.source == 'index') {
      var acceptedNum = 0
      for (let item of task.reply) {
        if (item.state == 1) {
          acceptedNum += 1
        }
      }
      this.setData({
        acceptedNum: acceptedNum
      })
    }
    console.log(this.data)
  },

  sendReplyTaskRequest: function (inputData) {
    let that = this
    wx.request({
      url: host + '/task/reply/',
      data: inputData,
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
          that.sendRefreshRequest(false)
          wx.showToast({
            title: '响应成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '响应失败, 请下拉页面刷新后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '响应失败, 请下拉页面刷新后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  sendRefreshRequest: function (isPullDownRefresh) {
    var url = ''
    var data = {}
    if (this.data.source == 'index') {
      url = '/task/query/id/'
      data = {
        taskid: this.data.task.taskid
      }
    } else if (this.data.source == 'myreply') {
      url = '/task/reply/query/id/'
      data = {
        replyid: this.data.replyid
      }
    } else {
      return false
    }
    let that = this
    wx.request({
      url: host + url,
      data: data,
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
          if (that.data.source == 'index') {
            that.updateDataWithTask(data.data)
          } else {
            that.updateDataWithTask(data.data.task)
          }
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