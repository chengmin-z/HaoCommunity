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
    cookie: 'sessionid=4se02xzzn4t8mbhbrywhsg5uvpjwsut3; expires=Mon 27 Dec 2021 09:35:29 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax'
  }
})