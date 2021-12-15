// pages/editpass/editpass.js
import wxValidate from '../../utils/wxValidate.js'

let host = getApp().globalData.host
let app = getApp()

Page({
  initValidate: function() {
    this.validate = new wxValidate({
        oldPwd: {
          required: true,
        },
        newPwd: {
          required: true,
          minlength: 6
        },
        newPwdRe: {
          required: true,
          equalTo: 'newPwd'
        }
      }, {
        oldPwd: {
          required: '请输入原密码',
        },
        newPwd: {
          required: '请输入新密码',
          minlength: '密码长度至少为6位'
        },
        newPwdRe: {
          required: '请输入确认密码',
          equalTo: '确认密码输入不一致'
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

  handleEditPassword: function(e) {
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
    delete inputData['newPwdRe']
    this.sendEditPasswordRequest(inputData)
  },

  sendEditPasswordRequest: function (inputData) {
    console.log(inputData)
    let that = this
    wx.request({
      url: host + '/home/changepwd/',
      data: inputData,
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
          let logindata = {
            password: inputData.newPwd,
            username: app.globalData.userInfo.username
          }
          that.sendLoginRequset(logindata)
          wx.showToast({
            title: '修改密码成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '修改密码失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: res.msg == null ? '修改密码失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  sendLoginRequset: function(inputData) {
    let that = this
    console.log(inputData)
    wx.request({
      url: host + '/home/login/',
      data: inputData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        console.log(res)
        let data = res.data
        let code = data.status
        app.globalData.cookie = res.cookies[0]
        console.log(app.globalData.cookie)
        if (code == 200) {
        } else {
          wx.showToast({
            title: data.msg == null ? '登录失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: res.msg == null ? '登录失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})