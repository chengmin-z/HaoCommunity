// pages/profile/profile.js
let app = getApp()
let host = getApp().globalData.host

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: app.globalData.userInfo,
    username: '暂未登录',
    avatar: '/images/person.crop.circle.png'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  onShow: function() {
    // refresh data
    if (app.globalData.userInfo) {
      let userinfo = app.globalData.userInfo
      this.setData({
        userInfo: userinfo,
        username: userinfo.realname,
        avatar: userinfo.avatar
      })
    } else {
      this.setData({
        username: '暂未登录',
        avatar: '/images/person.crop.circle.png',
        userInfo: null
      })
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  handleRegister: function() {
    console.log('Register Button Tap')
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  handleLogin: function() {
    console.log('Login Button Tap')
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  handleLogout: function() {
    let that = this
    wx.showModal({
      title: '登出确认',
      content: '是否确认登出',
      confirmColor: '#6782F2',
      success (res) {
        if (res.confirm) {
          that.sendLogoutRequset()
        }
      }
    })
  },

  handleEditUserInfo: function() {
    wx.request({
      url: host + '/home/queryinfo/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success (res) {
        console.log(res)
        let data = res.data
        let code = data.status
      },
      fail (res) {
        console.log('reload session failed')
      }
    })
  },

  sendLogoutRequset: function() {
    let that = this
    wx.request({
      url: host + '/home/logout/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success (res) {
        console.log(res)
        let data = res.data
        let code = data.status
        console.log(data)
        if (code == 200) {
          app.globalData.userInfo = null
          app.globalData.cookie = null
          that.setData({
            username: '暂未登录',
            avatar: '/images/person.crop.circle.png',
            userInfo: null
          })
          wx.showToast({
            title: '登出成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '登出失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: '登出失败, 请稍后重试',
          icon: 'none'
        })
      }
    })
  }


})