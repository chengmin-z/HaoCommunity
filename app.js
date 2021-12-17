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
    otherUserInfo: null,
    cookie: 'sessionid=idwwyji7o2n2sj9c7nzv99n19lupvtx7; expires=Thu 30 Dec 2021 15:46:18 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax',
    idtypeName: ['居民身份证', '护照', '港澳居民来往内地通行证', '台湾居民来往大陆通行证', '外国人永久居留身份证'],
    idtypeNo2Name: {0:'居民身份证', 1:'护照', 2:'港澳居民来往内地通行证', 3:'台湾居民来往大陆通行证', 4:'外国人永久居留身份证'},
    userLevel2Name: {0:'普通用户', 1:'VIP会员'},
    taskTypeArray: ['小时工', '搬重物', '上下班搭车', '社区服务志愿者', '其他'],
    taskTypeNo2Name: {0: '小时工', 1: '搬重物', 2: '上下班搭车', 3: '社区服务志愿者', 1000: '其他'},
    taskStateNo2Name: {0: '进行中', 1: '进行中', 2: '已完成', 3: '已过期', 4: '已取消'},
    tempTask: null,
    taskState2Color: { 0: '#6C87F5', 1: '#6C87F5', 2: '#96A5E5', 3: '#999999', 4: '#999999'},
    replyState2Name: { 0: '待接受', 1: '已接受', 2: '已拒绝', 3: '已取消' },
    replyState2Color: { 0: '#999999',1: '#96A5E5', 2: '#999999', 3: '#999999'},
  }
})