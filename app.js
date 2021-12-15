// app.js
App({
  onLaunch() {
    this.reloadSession()
  },
  checkLogin: function() {
    if (this.globalData.userInfo) {
      return true
    }
    wx.showModal({
      title: '用户未登录',
      content: '是否重新登录',
      confirmColor: '#6782F2',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    return false
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
    cookie: 'sessionid=29vyltb5yyys5bpcn96dnti7qawu4sk1; expires=Wed 29 Dec 2021 05:06:32 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax',
    idtypeName: ['居民身份证', '护照', '港澳居民来往内地通行证', '台湾居民来往大陆通行证', '外国人永久居留身份证'],
    idtypeNo2Name: {0:'居民身份证', 1:'护照', 2:'港澳居民来往内地通行证', 3:'台湾居民来往大陆通行证', 4:'外国人永久居留身份证'},
    userLevel2Name: {0:'普通用户', 1:'VIP会员'}
  }
})