// pages/login/login.js
let host = getApp().globalData.host

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  handleLogin: function(e) {
    console.log(e.detail.value)
    let inputData = e.detail.value
    this.sendLoginRequset(inputData)
  },

  sendLoginRequset: function(data) {
    console.log(data)
    wx.request({
      url: host + '/home/login/',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        let data = res.data
        let code = data.status
        if (code == 200) {
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: '登录失败, 请稍后重试',
          icon: 'none'
        })
      }
    })
  }
})