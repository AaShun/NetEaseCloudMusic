const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断登录和未登录
    flag: false,
    //判断签到
    sign: false,
    //装调取用户详情的id
    id: "",
    //装用户信息
    user: {},
    //装用户详细信息
    usermsg: {},
    //获取动态信息
    dynamic: 0,
    //获取用户关注信息
    follow: [],
    //获取用户粉丝数量
    fans: []
  },
  //未登录状态，跳转登录页面
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //退出登录
  getOut() {
    wx.setStorageSync('user', '')
    this.setData({
      flag: false
    })
  },

  //判断签到
  signUp(e) {
    console.log(e)
    this.setData({
      sign:true
    })
  },

  //编辑资料
  goEdit() {
    wx.navigateTo({
      url: '/pages/editMine/editMine',
    })
  },

  //调取用户详情信息
  getUser() {
    app.globalData.fly.get(`/user/detail?uid=${this.data.user.account.id}`).then(res => {
      this.setData({
        usermsg: res.data
      })
    })
  },

  //获取用户动态信息
  getDynamic() {
    app.globalData.fly.get(`/user/event?uid=${this.data.user.account.id}`).then(res => {
      this.setData({
        dynamic: res.data.size
      })
    })
  },

  //获取用户关注信息
  getFollow() {
    app.globalData.fly.get(`/user/follows?uid=${this.data.user.account.id}`).then(res => {
      this.setData({
        follow: res.data.follow
      })
    })
  },

  //获取用户粉丝数量
  getFans() {
    app.globalData.fly.get(`/user/followeds?uid=${this.data.user.account.id}`).then(res => {
      this.setData({
        fans: res.data.followeds
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx: wx.showLoading({
      title: '加载中...',
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx: wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断是否登录
    if (wx.getStorageSync('user').code) {
      this.setData({
        user: wx.getStorageSync('user'),
        flag: true
      })
      this.getUser(),
        this.getDynamic(),
        this.getFollow(),
        this.getFans()

    } else {
      this.setData({
        flag: false
      })
    }
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