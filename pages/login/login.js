const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //切换手机登录或邮箱登录
    flag: true,
    //手机登录输入框获取手机号
    phone: "",
    //手机登录输入框获取密码
    password: "",
    //邮箱登录输入框获取邮箱
    email: ""
  },

  //点击注册跳转注册页面
  goRegister() {
    wx: wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  //点击手机登录或邮箱登录
  chooseLog(e) {
    this.setData({
      flag: e.currentTarget.dataset.flag
    })
  },

  //点击右边的×清空phone或者email
  clickIcon() {
    this.setData({
      phone: '',
      email: ''
    })
  },
  //点击右边的×清空密码
  clickPass() {
    this.setData({
      password: ''
    })
  },

  //输入框电话号码确定
  phoneConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        phone: e.detail,
      })
    } else {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    }

  },
  //输入框密码拿值
  passwordConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        password: e.detail
      })
    } else {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    }
  },

  //手机登录 点击登录
  goLogin() {
    //判断电话号码和密码是否为空
    if (this.data.phone !== "" && this.data.password !== "") {
      //拿用户数据
      app.globalData.fly.get(`/login/cellphone?phone=${this.data.phone}&password=${this.data.password}`).then(res => {
        //判断status是否为200，（200是登录成功）
        if (res.status === 200) {
          //弹窗（登录成功）
          wx.showToast({
            title: '登录成功'
          })
          //把得到的用户信息存到storage里面
          wx.setStorageSync('user', res.data)
          //登录过后跳转到我的
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '请确认输入信息',
          icon: "none"
        })
      })

    } else {
      wx.showToast({
        title: '请确认输入信息',
        icon: "none"
      })
    }
  },

  //输入框邮箱确定
  emailConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        email: e.detail,
      })
    } else {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      })
    }
  },

  //邮箱登录 点击登录
  emailLogin() {
    //判断电话号码和密码是否为空
    if (this.data.email !== "" && this.data.password !== "") {
      //拿用户数据
      app.globalData.fly.get(`/login?email=${this.data.email}&password=${this.data.password}`).then(res => {
        //判断status是否为200，（200是登录成功）
        if (res.status === 200) {
          //弹窗（登录成功）
          wx.showToast({
            title: '登录成功'
          })
          //把得到的用户信息存到storage里面
          wx.setStorageSync('user', res.data)

          //登录过后跳转到我的
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '请确认输入信息',
          icon: "none"
        })
      })

    } else {
      wx.showToast({
        title: '请确认输入信息',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})