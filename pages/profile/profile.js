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
    // refresh data
    let that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        username: app.globalData.userInfo.realname,
        avatar: app.globalData.userInfo.avatar
      })
    } else {
      this.sendGetCurrentUserRequest()
    }
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        username: app.globalData.userInfo.realname,
        avatar: app.globalData.userInfo.avatar
      })
    }
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
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
    })
  },

  handleShowMyPubPage: function() {
    if(!app.checkLogin()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/mypub/mypub',
    })
  },

  handleShowMyReplyPage: function() {
    if(!app.checkLogin()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/myreply/myreply',
    })
  },

  handleEditPassword: function() {
    if(!app.checkLogin()) {
      return false
    }
    wx.navigateTo({
      url: '/pages/editpass/editpass',
    })
  },

  sendGetCurrentUserRequest: function() {
    let that = this
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
        if (code == 200) {
          app.globalData.userInfo = data.data
          that.setData({
            userInfo: data.data,
            username: data.data.realname,
            avatar: data.data.avatar
          })
        }
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
          title: res.msg == null ? '登出失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  }


})