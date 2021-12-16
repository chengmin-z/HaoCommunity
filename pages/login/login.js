// pages/login/login.js
import wxValidate from '../../utils/wxValidate.js'

let host = getApp().globalData.host
let app = getApp()

Page({
  initValidate: function () {
    this.validate = new wxValidate({
      username: {
        required: true,
        minlength: 5
      },
      password: {
        required: true
      }
    }, {
      username: {
        required: '请输入用户名称',
        minlength: '用户名称至少为6位字符'
      },
      password: {
        required: '请输入密码'
      }
    })
  },

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.initValidate()
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

  handleLogin: function (e) {
    console.log(e.detail.value)
    // check
    if (!this.validate.checkForm(e)) {
      const error = this.validate.errorList[0];
      console.log(error)
      wx.showToast({
        title: `${error.msg}`,
        icon: 'none'
      })
      return false
    }
    let inputData = e.detail.value
    this.sendLoginRequset(inputData)
  },

  sendLoginRequset: function (data) {
    let that = this
    console.log(data)
    wx.request({
      url: host + '/home/login/',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        let data = res.data
        let code = data.status
        app.globalData.cookie = res.cookies[0]
        console.log(app.globalData.cookie)
        if (code == 200) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            complete() {
              that.loginSuccessBack(data.data)
            }
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '登录失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '登录失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  loginSuccessBack: function (data) {
    app.globalData.userInfo = data
    console.log(app.globalData.userInfo)
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 500)
  }
})