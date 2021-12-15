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
    taskTypeNo2Name: app.globalData.taskType2No, // 变量名称不标准
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    color: '#000',
    taskState2Color: { 0: '#6C87F5', 1: '#6C87F5', 2: '#96A5E5', 3: '#999999', 4: '#999999'}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.sendQueryMyPubRequest(false)
  },

  handleShowPubDetail: function(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let taskstate = this.data.mypubs[index].state
    if (taskstate == 3 || taskstate == 4) {
      wx.showToast({
        title: '任务已' + (taskstate == 3 ? '过期' : '取消'),
        icon: 'error'
      })
      return false
    }
    // todo
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
          data.data.sort((a, b) => {return a.state - b.state});
          that.setData({
            mypubs: data.data
          })
          console.log(data.data)
          if (isRefresh) {
            wx.showToast({
              title: '数据刷新成功',
              icon: 'succes'
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