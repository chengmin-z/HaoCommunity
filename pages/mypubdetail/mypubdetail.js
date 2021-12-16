// pages/mypubdetail/mypubdetail.js
import {
  formatDate,
  formatTime,
  formatOneMonthLimit
} from '../../utils/util.js'
import wxValidate from '../../utils/wxValidate.js'

let app = getApp()
let host = getApp().globalData.host

Page({
  initValidate: function () {
    this.titleValidate = new wxValidate({
      title: {
        required: true,
        minlength: 2
      }
    }, {
      title: {
        required: '请输入任务名称',
        minlength: '任务名称至少为2个字符'
      }
    })
    this.descriptionValidate = new wxValidate({
      description: {
        required: true,
        minlength: 5
      }
    }, {
      description: {
        required: '请输入任务描述',
        minlength: '任务描述至少为5个字符'
      }
    })
    this.neednumValidate = new wxValidate({
      neednum: {
        required: true,
        range: [1, 100]
      }
    }, {
      neednum: {
        required: '请输入所需人数',
        range: '所需人数为1-100的整数'
      }
    })
    this.validateDict = {
      title: this.titleValidate,
      description: this.descriptionValidate,
      neednum: this.neednumValidate
    }
  },

  data: {
    picPrefix: host + '/media/',
    task: app.globalData.tempTask,
    taskTypeNo2Name: app.globalData.taskTypeNo2Name,
    taskTypeArray: app.globalData.taskTypeArray,
    taskStateNo2Name: app.globalData.taskStateNo2Name,
    taskState2Color: app.globalData.taskState2Color,
    enddate: '',
    endtime: '',
    startDateLimit: '',
    endDateLimit: '',
    acceptedNum: 0,
    canEdit: null
  },

  onLoad: function (options) {
    this.initValidate()
    let task = app.globalData.tempTask
    this.updateDataWithTask(task)
    this.checkCanEdit()
  },

  onShow: function () {
    this.sendRefreshRequest(false)
  },

  updateDataWithTask: function(task) {
    let now = new Date()
    var acceptedNum = 0
    for (let item of task.reply) {
      if (item.state == 1) {
        acceptedNum += 1
      }
    }
    this.setData({
      task: task,
      acceptedNum: acceptedNum,
      enddate: formatDate(task.endtime),
      endtime: formatTime(task.endtime),
      startDateLimit: formatDate(now),
      endDateLimit: formatOneMonthLimit(now),
    })
    console.log(this.data)
  },

  sendRefreshRequest: function(isPullDownRefresh) {
    let that = this
    var sendData = {}
    sendData['taskid'] = this.data.task.taskid
    wx.request({
      url: host + '/task/query/id/',
      data: sendData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let code = res.data.status
        let data = res.data
        if (code == 200) {
          that.updateDataWithTask(data.data)
          if (isPullDownRefresh) {
            wx.showToast({
              title: '数据刷新成功',
              icon: 'success',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: data.msg == null ? '加载失败, 请尝试下拉页面刷新' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '加载失败, 请尝试下拉页面刷新' : res.msg,
          icon: 'none'
        })
      },
      complete (res) {
        wx.stopPullDownRefresh()
      }
    })
  },

  checkCanEdit: function () {
    if (this.data.canEdit != null) {
      if (!this.data.canEdit) {
        wx.showToast({
          title: '有未处理或已接受响应, 无法更改基本信息',
          icon: 'none'
        })
      }
      return this.data.canEdit
    }
    var canEdit = true
    for (let item of this.data.task.reply) {
      if (item.state == 0 || item.state == 1) {
        canEdit = false;
        break;
      }
    }
    this.setData({
      canEdit: canEdit
    })
    return canEdit
  },

  handleCancelTask: function () {
    let that = this
    if (!this.checkCanEdit()) {
      return false
    }
    var sendData = {}
    sendData['taskid'] = this.data.task.taskid
    console.log(sendData)
    wx.request({
      url: host + '/task/cancel/',
      data: sendData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let code = res.data.status
        let data = res.data
        if (code == 200) {
          wx.showToast({
            title: '任务取消成功',
            icon: 'success',
            success: (res) => {
              setTimeout(() => {
                 wx.navigateBack({
                  delta: 1,
                })
              }, 500)  
            }
          })
        } else {
          wx.showToast({
            title: data.msg == null ? '任务取消失败, 请稍后重试' : data.msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.msg == null ? '任务取消失败, 请稍后重试' : res.msg,
          icon: 'none'
        })
      }
    })
  },

  handleEditTitle: function (params) {
    this.editInfo('title', '修改任务名称', '请输入任务名称')
  },

  handleEditDescription: function (params) {
    this.editInfo('description', '修改任务描述', '请输入任务描述')
  },

  handleEditNeednum: function (params) {
    this.editInfo('neednum', '修改所需人数', '请输入所需人数')
  },

  editInfo: function (key, modalTitle, placeholderText) {
    if (!this.checkCanEdit()) {
      return false
    }
    let that = this
    wx.showModal({
      title: modalTitle,
      editable: true,
      confirmColor: '#6782F2',
      placeholderText: placeholderText,
      success(res) {
        if (res.confirm) {
          let e = {};
          e.detail = {};
          e.detail.value = {};
          e.detail.value[key] = res.content
          // check
          console.log(e.detail.value[key])
          if (!that.validateDict[key].checkForm(e)) {
            const error = that.validateDict[key].errorList[0];
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
          that.sendUpdateTaskInfoRequest(inputdata)
        }
      }
    })
  },

  sendUpdateTaskInfoRequest: function (inputData) {
    let that = this
    var sendData = inputData
    sendData['taskid'] = this.data.task.taskid
    console.log(sendData)
    wx.request({
      url: host + '/task/update/',
      data: sendData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let code = res.data.status
        let data = res.data
        if (code == 200) {
          that.updateDataWithTask(data.data)
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

  sendUpdateTaskImageRequest: function (picPath) {
    let that = this
    let sendData = {}
    sendData['taskid'] = this.data.task.taskid
    console.log(sendData)
    wx.uploadFile({
      filePath: picPath,
      name: 'image',
      formData: sendData,
      url: host + '/task/update/',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': app.globalData.cookie
      },
      success(res) {
        console.log(res)
        let data = JSON.parse(res.data)
        let code = data.status
        if (code == 200) {
          console.log(data.data)
          that.updateDataWithTask(data.data)
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
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  editPickerInfo: function(modalContent, key, value) {
    let that = this
    wx.showModal({
      title: '修改确认',
      content: modalContent,
      confirmColor: '#6782F2',
      success(res) {
        if (res.confirm) {
          let inputdata = {}
          inputdata[key] = value
          wx.showLoading({
            title: '正在上传图片',
          })
          that.sendUpdateTaskInfoRequest(inputdata)
        }
      }
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value = e.detail.value + ' ' + this.data.endtime
    this.editPickerInfo('确认修改到期日期?', 'endtime', value)
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value = this.data.enddate + ' ' + e.detail.value
    this.editPickerInfo('确认修改到期时间?', 'endtime', value)
  },

  bindTaskTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value = e.detail.value
    if (e.detail.value == this.data.taskTypeArray.length - 1) {
      value = 1000
    }
    this.editPickerInfo('确认修改任务类型?', 'tasktype', value)
  },

  changeImage: function() {
    let that = this
    if (!this.checkCanEdit()) {
      return false
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        let imgPath = tempFilePaths[0]
        console.log(imgPath)
        wx.showModal({
          title: '修改确认',
          content: '确认修改图片描述?',
          confirmColor: '#6782F2',
          success(res) {
            if (res.confirm) {
              console.log('确认修改图片')
              that.sendUpdateTaskImageRequest(imgPath)
            }
          }
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.sendRefreshRequest(true)
  }
})