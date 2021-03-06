// pages/publish/publish.js
import {formatDate, formatTime, formatOneMonthLimit} from '../../utils/util.js'
import wxValidate from '../../utils/wxValidate.js'

let host = getApp().globalData.host
let app = getApp()

Page({
  initValidate: function() {
    this.validate = new wxValidate({
       title: {
          required: true,
          minlength: 2
        },
        description: {
          required: true,
          minlength: 5
        },
        neednum: {
          required: true,
          range: [1, 100]
        }
      }, {
        title: {
          required: '请输入任务名称',
          minlength: '任务名称至少为2个字符'
        },
        description: {
          required: '请输入任务描述',
          minlength: '任务描述至少为5个字符'
        },
        neednum: {
          required: '请输入所需人数',
          range: '所需人数为1-100的整数'
        }
    })
  },
  /**
   * Page initial data
   */
  data: {
    taskTypeArray: app.globalData.taskTypeArray,
    taskTypeNo2Name: app.globalData.taskTypeNo2Name,
    tasktype: 0,
    enddate: '',
    endtime: '',
    imgPath: null,
    startDateLimit: '',
    endDateLimit: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.initValidate()
    let now = new Date()
    this.setData({
      enddate: formatDate(now),
      startDateLimit: formatDate(now),
      endDateLimit: formatOneMonthLimit(now),
      endtime: '23:59'
    })
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  handlePublish: function(e) {
    if(!app.checkLogin()) {
      return false
    }
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
    let taskTypeNo = this.data.tasktype == this.data.taskTypeArray.length - 1 ? 1000 : this.data.tasktype
    inputData['tasktype'] = taskTypeNo
    inputData['endtime'] = this.data.enddate + ' ' + this.data.endtime
    console.log(inputData)
    this.sendPubTaskRequest(inputData)
  },

  sendPubTaskRequest: function(inputData) {
    wx.showLoading({
      title: '正在创建任务',
    })
    if (this.data.imgPath) {
      wx.uploadFile({
        filePath: this.data.imgPath,
        name: 'image',
        formData: inputData,
        url: host + '/task/publish/',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': app.globalData.cookie
        },
        success (res) {
          wx.hideLoading()
          console.log(res)
          let data = JSON.parse(res.data)
          let code = data.status
          console.log(data)
          if (code == 200) {
            wx.showToast({
              title: '发布任务成功, 请在我的中查看',
              duration: 2000,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: data.msg == null ? '发布任务失败, 请稍后重试' : data.msg,
              duration: 2000,
              icon: 'none'
            })
          }
        },
        fail (res) {
          wx.hideLoading()
          console.log(res)
          wx.showToast({
            title: res.msg == null ? '发布任务失败, 请稍后重试' : res.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    } else {
      wx.request({
        data: inputData,
        url: host + '/task/publish/',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': app.globalData.cookie
        },
        success (res) {
          wx.hideLoading()
          console.log(res)
          let data = res.data
          let code = data.status
          console.log(data)
          if (code == 200) {
            wx.showToast({
              title: '发布任务成功, 请在我的中查看',
              duration: 2000,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: data.msg == null ? '发布任务失败, 请稍后重试' : data.msg,
              duration: 2000,
              icon: 'none'
            })
          }
        },
        fail (res) {
          wx.hideLoading()
          console.log(res)
          wx.showToast({
            title: res.msg == null ? '发布任务失败, 请稍后重试' : res.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
    
  },

  chooseImage: function() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          imgPath: tempFilePaths[0]
        })
      }
    })
  },

  bindTaskTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      tasktype: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endtime: e.detail.value
    })
  }
})