// pages/mypub/mypub.js

let app = getApp()
let host = getApp().globalData.host

Page({

  /**
   * Page initial data
   */
  data: {
    mypubs: null,
    picPrefix: host + '/media/',
    taskTypeNo2Name: app.globalData.taskTypeNo2Name, // 变量名称不标准
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    taskState2Color: app.globalData.taskState2Color,
    firstShow: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.sendQueryMyPubRequest(false)
  },

  onShow: function (options) {
    if (!this.data.firstShow) {
      this.sendQueryMyPubRequest(false)
    }
    this.data.firstShow = false
  },

  handleShowPubDetail: function(e) {
    console.log('touch list[' + e.currentTarget.dataset.index + ']')
    let index = e.currentTarget.dataset.index
    let task = this.data.mypubs[index]
    let taskstate = task.state
    if (taskstate == 3 || taskstate == 4) {
      wx.showToast({
        title: '任务已' + (taskstate == 3 ? '过期' : '取消'),
        icon: 'error'
      })
      return false
    }
    app.globalData.tempTask = task
    console.log(app.globalData.tempTask)
    wx.navigateTo({
      url: '/pages/mypubdetail/mypubdetail',
    })
  },

  sendQueryMyPubRequest: function(isRefresh) {
    let that = this
    wx.request({
      url: host + '/task/query/mine/',
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
              title: '暂无发布的任务',
              icon: 'error'
            })
          }
          that.setData({
            mypubs: data.data
          })
          console.log(data.data)
          if (isRefresh) {
            let title = data.data.length == 0 ? '暂无发布的任务' : '数据刷新成功'
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
    this.sendQueryMyPubRequest(true)
  }
})