// pages/register/register.js
let host = getApp().globalData.host

Page({

  /**
   * Page initial data
   */
  data: {
    idtypeArray: ['居民身份证', '护照', '港澳居民来往内地通行证', '台湾居民来往大陆通行证', '外国人永久居留身份证'],
    region: ['北京市', '北京市', '海淀区'],
    idtype: 0
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

  handleRegister: function(e) {
    console.log(e.detail.value)
    let inputData = e.detail.value
    // check
    // combine
    let city = this.data.region[0] + ',' + this.data.region[1] + ',' + this.data.region[2]
    delete inputData['passwordRe']
    inputData['idtype'] = this.data.idtype
    inputData['city'] = city
    let that = this
    wx.getUserInfo({
      lang: 'HAO 社区想获取您的头像信息',
      withCredentials: true,
      success: (res) => {
        console.log(res)
        inputData['avatar'] = res.userInfo.avatarUrl
        that.sendRegisterRequset(inputData)
      },
      fail: (res) => {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      },
      complete: (res) => {},
    })
  },

  sendRegisterRequset: function(data) {
    console.log(data)
    wx.request({
      url: host + '/home/register/',
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
            title: '注册成功',
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
          title: '注册失败, 请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  bindIdTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      idtype: e.detail.value
    })
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})