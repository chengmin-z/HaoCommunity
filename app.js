// app.js
App({
  onLaunch() {
    this.reloadSession()
  },
  reloadSession: function() {
    let that = this
    wx.request({
      url: this.globalData.host + '/home/queryinfo/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': this.globalData.cookie
      },
      success (res) {
        console.log(res)
        let data = res.data
        let code = data.status
        if (code == 200) {
          that.globalData.userInfo = data.data
        }
      },
      fail (res) {
        console.log('reload session failed')
      }
    })
  },
  globalData: {
    host: 'https://8.141.51.178',
    userInfo: null,
    cookie: 'sessionid=e8ou2xsc48n5vs5nerb8ciss90yd8b02; expires=Tue 28 Dec 2021 09:18:24 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax'
  }
})