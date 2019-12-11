const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取电话号码
    phone: "",
    //获取密码
    password: "",
    //获取验证码
    code: "",
    //获取用户名
    username: "",
    //如果手机条件满足则进入注册按钮
    regFlag:false,
    //如果短信验证码条件满足则进入注册按钮
    msgFlag:false
  },

  //点击注册跳转注册页面
  goLogin() {
    wx: wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //确认 手机号获取
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

  //确认 密码获取
  passwordConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        password: e.detail,
      })
    } else {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    }
  },

  //确认 验证码获取
  codeConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        code: e.detail,
      })
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
  },

  //确认 获取用户名
  usernameConfirm(e) {
    if (e.detail !== "") {
      this.setData({
        username: e.detail,
      })
    } else {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
    }
  },

  //点击发送验证码
  sendCode() {
    app.globalData.fly.get(`/captcha/sent?phone=${this.data.phone}`).then(res => {
      wx.showToast({
        title: '发送成功',
      })
    }).catch(err => {
      wx.showToast({
        title: '发送失败',
        icon: "none"
      })
    })
  },

  //验证验证码
  checkCode() {
    //判断验证码是否为空
    if (this.data.code !== "") {
      app.globalData.fly.get(`/captcha/verify?phone=${this.data.phone}&captcha=${this.data.code}`).then(res => {
        this.setData({
          msgFlag:true
        })
        console.log(res)
      }).catch(err => {
        wx.showToast({
          title: '验证码错误',
          icon: "none"
        })
      })
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
    }
  },

  //验证手机是否注册过
  checkPhone(){
    if(this.data.phone !== ""){
      app.globalData.fly.get(`/cellphone/existence/check?phone=${this.data.phone}`).then(res=>{
         if(res.data.code !== 200){
            this.setData({
              regFlag: true
            })
         }else{
           wx.showToast({
             title: '号码已注册',
             icon: "none"
           })
         }
      }).catch(err => {
        console.log(err)
      })
    }
  },

  //点击立即注册
  nowRegister(){
    //调用手机号码验证
    this.checkPhone()
    //调用验证码验证
    this.checkCode()
    if(this.data.regFlag === true && this.data.msgFlag === true){
      app.globalData.fly.get(`/register/cellphone?phone=${this.data.phone}&password=${this.data.password}&captcha=${this.data.code}&nickname=${this.data.username}`).then(res => {
        wx.showToast({
          title: '注册成功',
        })
      }).catch(err => {
        wx.showToast({
          title: '注册失败',
          icon: "none"
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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