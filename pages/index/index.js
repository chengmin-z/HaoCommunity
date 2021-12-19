// pages/index/index.js
let app = getApp()
let host = getApp().globalData.host

Page({
  data: {
    userInfo: {},
    tasks: null,
    firstShow: true,
    picPrefix: host + '/media/',
    taskTypeNo2Name: app.globalData.taskTypeNo2Name,
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    taskState2Color: app.globalData.taskState2Color,
    taskTypeArray: app.globalData.taskMatchTypeArray,
    taskmatchtype: 0,
    taskmatchname: '',
    showTasks: null
  },

  onLoad: function (options) {
    this.setData({
      taskmatchtype: this.data.taskTypeArray.length - 1
    })
    this.sendGetCurrentUserRequest()
    this.sendCommunityTaskRequest(false)
    console.log(this.data)
  },

  bindTaskTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      taskmatchtype: e.detail.value
    })
    this.filterShowTask(false)
  },

  bindTaskNameInput: function(e) {
    let value = e.detail.value
    this.data.taskmatchname = value
    this.filterShowTask(false)
  },

  filterShowTask: function(isRefresh) {
    if (this.data.tasks == null) return false
    let taskmatchtype = this.data.taskmatchtype
    if (taskmatchtype == this.data.taskTypeArray.length - 2) {
      taskmatchtype = 1000
    }
    var showTasks = []
    for (let task of this.data.tasks) {
      if (task.title.indexOf(this.data.taskmatchname) != -1) {
        if (taskmatchtype == this.data.taskTypeArray.length - 1) {
          showTasks.push(task)
        } else if (task.tasktype == taskmatchtype) {
          showTasks.push(task)
        }
      }  
    }
    if (!isRefresh) {
      wx.showToast({
        title: '共筛选出' + showTasks.length + '条任务',
        icon: 'none'
      })
    }
    this.setData({
      showTasks: showTasks
    })
  },

  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (!this.data.firstShow) {
      this.sendCommunityTaskRequest(false)
    }
    this.data.firstShow = false
  },

  handleShowTaskInfo: function(e) {
    console.log('touch list[' + e.currentTarget.dataset.index + ']')
    let index = e.currentTarget.dataset.index
    let task = this.data.tasks[index]
    console.log(task)
    app.globalData.tempCommunityTask = task
    wx.navigateTo({
      url: '/pages/otherpubdetail/otherpubdetail?source=index',
    })
  },

  sendGetCurrentUserRequest: function () {
    let that = this
    app.reloadSession((userInfo) => {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  sendCommunityTaskRequest: function(isRefresh) {
    let that = this
    wx.request({
      url: host + '/task/query/community/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success (res) {
        console.log(res)
        let data = res.data
        let code = data.status
        if (code == 200) {
          data.data.sort((a, b) => {return a.state - b.state})
          if (data.data.length == 0) {
            wx.showToast({
              title: '社区暂无任务',
              icon: 'error'
            })
          }
          that.setData({
            tasks: data.data
          })
          that.filterShowTask(true)
          console.log(data.data)
          if (isRefresh) {
            let title = data.data.length == 0 ? '社区暂无任务' : '数据刷新成功'
            let icon = data.data.length == 0 ? 'error' : 'success'
            wx.showToast({
              title: title,
              icon: icon
            })
          }
        } else {
          wx.showToast({
            title: data.msg == null ? '加载失败, 请尝试下拉页面刷新' : data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: '加载失败, 请尝试下拉页面刷新',
          icon: 'none'
        })
      },
      complete (res) {
        wx.stopPullDownRefresh()
      }
    })
  },

  onPullDownRefresh: function () {
    this.sendCommunityTaskRequest(true)
  }
})