// pages/register/register.js
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
    let data = {
      username: inputData.username,
      password: inputData.password,
      realname: inputData.realname,
      idnumber: inputData.idnumber,
      phone: inputData.phone,
      description: inputData.description,
      community: inputData.community,
      idtype: this.data.idtype,
      city: city,
    }
    console.log(data)
    wx.request({
      url: 'http://8.141.51.178:8000/home/register/',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        console.log(res.data)
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
      idType: e.detail.value
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