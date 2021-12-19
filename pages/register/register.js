import wxValidate from '../../utils/wxValidate.js'

// pages/register/register.js
let host = getApp().globalData.host
let app = getApp()

Page({
  initValidate: function () {
    this.validate = new wxValidate({
      username: {
        required: true,
        minlength: 6
      },
      password: {
        required: true,
        minlength: 6,
        minDigitContain: 2,
        containLowerAndUpper: true
      },
      passwordRe: {
        required: true,
        equalTo: 'password'
      },
      realname: {
        required: true,
      },
      idnumber: {
        required: true,
      },
      phone: {
        required: true,
        tel: true
      },
      community: {
        required: true,
      }
    }, {
      username: {
        required: '请输入用户名称',
        minlength: '用户名称至少为6位字符'
      },
      password: {
        required: '请输入密码',
        minlength: '密码长度至少为6位',
        minDigitContain: '密码至少包含2个数字',
        containLowerAndUpper: '密码必须包含大小写'
      },
      passwordRe: {
        required: '请输入确认密码',
        equalTo: '确认密码输入不一致'
      },
      realname: {
        required: '请输入真实姓名',
      },
      idnumber: {
        required: '请输入证件号码',
      },
      phone: {
        required: '请输入手机号码',
        tel: '请输入11位手机号码'
      },
      community: {
        required: '请输入社区名称',
      }
    })

    this.validate.addMethod('minDigitContain', (value, param) => {
      var sum = 0
      var arr = value.split('')
      for (var i in arr) {
        var a = Number(arr[i]);
        if (a >= 0 && a <= 9) {
          sum++;
        }
      }
      if (sum >= param) return true
      else return false
    }, '')

    this.validate.addMethod('containLowerAndUpper', (value, param) => {
      if (!param) return true
      var hasUpper = false
      var hasLower = false
      var arr = value.split('')
      for (var i in arr) {
        var a = Number(arr[i]);
        if (!(a >= 0 && a <= 9)) {
          if (arr[i] == arr[i].toUpperCase()) {
            hasUpper = true
            console.log('has upper')
          }
          if (arr[i] == arr[i].toLowerCase()) {
            hasLower = true
            console.log('has lower')
          }
          if (hasLower && hasUpper) {
            break
          }
        }
      }
      return hasLower && hasUpper
    }, '')

    this.validateIdNum = new wxValidate({
      idnumber: {
        idcard: true
      }
    }, {
      idnumber: {
        idcard: '请输入18位居民身份证号',
      }
    })
  },

  data: {
    idtypeArray: app.globalData.idtypeName,
    region: ['北京市', '北京市', '海淀区'],
    idtype: 0
  },

  onLoad: function (options) {
    this.initValidate()
  },

  handleRegister: function (e) {
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
    if (this.data.idtype == 0 && !this.validateIdNum.checkForm(e)) {
      const error = this.validateIdNum.errorList[0];
      console.log(error)
      wx.showToast({
        title: `${error.msg}`,
        icon: 'none'
      })
      return false
    }

    // combine
    let inputData = e.detail.value
    let city = this.data.region[0] + ',' + this.data.region[1] + ',' + this.data.region[2]
    delete inputData['passwordRe']
    inputData['idtype'] = this.data.idtype
    inputData['city'] = city
    let that = this
    wx.getUserProfile({
      desc: '获取用户头像',
      success: (res) => {
        console.log(res)
        inputData['avatar'] = res.userInfo.avatarUrl
        that.sendRegisterRequset(inputData)
      },
      fail: (res) => {
        wx.showToast({
          title: '无法获取用户头像, 注册失败',
          icon: 'none'
        })
      }
    })
  },

  sendRegisterRequset: function (data) {
    console.log(data)
    let that = this
    wx.request({
      url: host + '/home/register/',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let data = res.data
        let code = data.status
        console.log(data)
        if (code == 200) {
          console.log(res)
          app.globalData.cookie = res.cookies[0]
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            complete() {
              that.registerSuccessBack(data.data)
            }
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '注册失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '注册失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  registerSuccessBack: function (data) {
    app.globalData.userInfo = data
    console.log(app.globalData.userInfo)
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 500)
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

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})