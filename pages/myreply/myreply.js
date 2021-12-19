// pages/myreply/myreply.js
import wxValidate from '../../utils/wxValidate.js'

let app = getApp()
let host = getApp().globalData.host

Page({

  initValidate: function () {
    this.descriptionValidate = new wxValidate({
      description: {
        required: true,
        minlength: 5
      }
    }, {
      description: {
        required: '请输入响应描述',
        minlength: '响应描述至少为5个字符'
      }
    })
  },

  /**
   * Page initial data
   */
  data: {
    myreplys: null,
    picPrefix: host + '/media/',
    firstShow: true,
    replyState2Name: app.globalData.replyState2Name,
    replyState2Color: app.globalData.replyState2Color,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.initValidate()
    this.sendQueryMyReplyRequest(false)
  },

  onShow: function () {
    if (!this.data.firstShow) {
      this.sendQueryMyReplyRequest(false)
    }
    this.data.firstShow = false
  },

  updateMyReplys: function (data, isRefresh) {
    // calculate generated state
    for (let reply of data) {
      if (reply.task.state == 2 && reply.state == 1) {
        reply.state = 98 // 任务完成且被接受
      } else if (reply.task.state == 4) {
        reply.state = 99 // 任务取消
      } else if (reply.task.state == 3) {
        reply.state = 100 // 任务到期
      }
    }
    data.sort((a, b) => {
      return a.state - b.state
    })
    if (data.length == 0) {
      wx.showToast({
        title: '暂无响应条目',
        icon: 'error'
      })
    }
    this.setData({
      myreplys: data
    })
    console.log(data)
    if (isRefresh) {
      let title = data.length == 0 ? '暂无响应条目' : '数据刷新成功'
      let icon = data.length == 0 ? 'error' : 'success'
      wx.showToast({
        title: title,
        icon: icon
      })
    }
  },

  handleShowReplyTaskInfo: function(e) {
    console.log('touch list[' + e.currentTarget.dataset.index + ']')
    let index = e.currentTarget.dataset.index
    let reply = this.data.myreplys[index]
    console.log(reply)
    let task = reply.task
    app.globalData.tempReplyTask = task
    wx.navigateTo({
      url: '/pages/otherpubdetail/otherpubdetail?source=myreply&replyid=' + reply.replyid,
    })
  },

  handleEditReplyDescription: function(e) {
    console.log('touch list[' + e.currentTarget.dataset.index + ']')
    let index = e.currentTarget.dataset.index
    let replyid = this.data.myreplys[index].replyid
    let key = 'description'
    let that = this
    wx.showModal({
      title: '修改响应描述',
      editable: true,
      confirmColor: '#6782F2',
      placeholderText: '请输入响应描述',
      success(res) {
        if (res.confirm) {
          let e = {};
          e.detail = {};
          e.detail.value = {};
          e.detail.value[key] = res.content
          // check
          console.log(e.detail.value[key])
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
          let inputdata = {}
          inputdata[key] = res.content
          inputdata['replyid'] = replyid
          console.log(inputdata)
          that.sendEditReplyDescriptionRequest(inputdata)
        }
      }
    })
  },


  handleCancelReply: function(e) {
    console.log('touch list[' + e.currentTarget.dataset.index + ']')
    let index = e.currentTarget.dataset.index
    let replyid = this.data.myreplys[index].replyid
    let that = this
    wx.showModal({
      title: '取消确认',
      content: '确认取消该响应?',
      confirmColor: '#6782F2',
      success(res) {
        if (res.confirm) {
          let inputdata = {}
          inputdata['replyid'] = replyid
          console.log(inputdata)
          that.sendCancelReplyRequest(inputdata)
        }
      }
    })
  },

  sendCancelReplyRequest: function(inputData) {
    let that = this
    wx.request({
      url: host + '/task/reply/cancel/',
      data: inputData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let data = res.data
        let code = data.status
        if (code == 200) {
          that.sendQueryMyReplyRequest(false)
          wx.showToast({
            title: '响应取消成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '响应取消失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '响应取消失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  sendQueryMyReplyRequest: function (isRefresh) {
    let that = this
    wx.request({
      url: host + '/task/reply/query/mine/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let data = res.data
        let code = data.status
        if (code == 200) {
          that.updateMyReplys(data.data, isRefresh)
        } else {
          wx.showToast({
            title: data.msg == null ? '加载失败, 请尝试下拉页面刷新' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '加载失败, 请尝试下拉页面刷新',
          icon: 'none'
        })
      },
      complete(res) {
        wx.stopPullDownRefresh()
      }
    })
  },

  sendEditReplyDescriptionRequest: function (inputData) {
    let that = this
    wx.request({
      url: host + '/task/reply/update/',
      data: inputData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let data = res.data
        let code = data.status
        if (code == 200) {
          that.sendQueryMyReplyRequest(false)
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
      fail(res) {
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
    this.sendQueryMyReplyRequest(true)
  }
})