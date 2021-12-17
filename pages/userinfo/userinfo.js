// pages/userinfo/userinfo.js
import wxValidate from '../../utils/wxValidate.js'

let app = getApp()
let host = app.globalData.host

Page({
  initValidate: function() {
    this.phoneValidate = new wxValidate({
        phone: {
          required: true,
          tel: true
        }
      }, {
        phone: {
          required: '请输入手机号码',
          tel: '请输入11位手机号码'
        }
    })
    this.descriptionValidate = new wxValidate({
      description: {
        required: true
      }
    }, {
      description: {
        required: '请输入用户简介'
      }
  })
  },
  /**
   * Page initial data
   */
  data: {
    userInfo: null,
    idtypeNo2Name: app.globalData.idtypeNo2Name,
    userLevel2Name: app.globalData.userLevel2Name,
    ismine: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.initValidate()
    console.log(options)
    let ismine = (options.ismine == 'true')
    let userdata = ismine ? app.globalData.userInfo : app.globalData.otherUserInfo
    this.setData({
      userInfo: userdata,
      ismine: ismine
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  handleEditPhone: function() {
    console.log('handleEditPhone')
    let that = this
    wx.showModal({
      title: '手机号码修改',
      editable: true,
      confirmColor: '#6782F2',
      placeholderText: '请输入手机号码',
      success (res) {
        if (res.confirm) {
          let e = {}; e.detail = {}; e.detail.value = {};
          e.detail.value.phone = res.content
          // check
          console.log(e.detail.value.phone)
          if (!that.phoneValidate.checkForm(e)) {
            const error = that.phoneValidate.errorList[0];
            console.log(error)
            wx.showToast({
              title: `${error.msg}`,
              icon: 'none'
            })
            return false
          }
          // then
          that.sendUserEditRequest({phone: e.detail.value.phone}, 'phone')
        }
      }
    })
  },

  handleEditDescription: function() {
    console.log('handleEditDescription')
    let that = this
    wx.showModal({
      title: '用户简介更改',
      editable: true,
      confirmColor: '#6782F2',
      placeholderText: '简单介绍一下自己吧',
      success (res) {
        if (res.confirm) {
          let e = {}; e.detail = {}; e.detail.value = {};
          e.detail.value.description = res.content
          // check
          console.log(e.detail.value.description)
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
          that.sendUserEditRequest({description: e.detail.value.description}, 'description')
        }
      }
    })
  },

  sendUserEditRequest: function(inputData, key) {
    let that = this
    wx.request({
      url: host + '/home/updateinfo/',
      data: inputData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success (res) {
        let code = res.data.status
        let data = res.data
        if (code == 200) {
          console.log(res)
          app.globalData.userInfo[key] = inputData[key]
          that.setData({
            userInfo: app.globalData.userInfo
          })
          wx.showToast({
            title: '信息修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '修改信息失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail (res) {
        wx.showToast({
          title: res.msg == null ? '修改信息失败, 请稍后重试' : res.msg,
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
    if (this.data.ismine) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  }
})