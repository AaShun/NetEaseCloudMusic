const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //歌手数据
    singer: [{
        type: '入驻歌手',
        cat: 5001
      },
      {
        type: '华语男歌手',
        cat: 1001
      },
      {
        type: '华语女歌手',
        cat: 1002
      },
      {
        type: '华语组合/乐队',
        cat: 1003
      },
      {
        type: '欧美男歌手',
        cat: 2001
      },
      {
        type: '欧美女歌手',
        cat: 2002
      },
      {
        type: '欧美组合/乐队',
        cat: 2003
      },
      {
        type: '日本男歌手',
        cat: 2001
      },
      {
        type: '日本女歌手',
        cat: 6002
      },
      {
        type: '日本组合/乐队',
        cat: 6003
      },
      {
        type: '韩国男歌手',
        cat: 7001
      },
      {
        type: '韩国女歌手',
        cat: 7002
      },
      {
        type: '韩国组合/乐队',
        cat: 7003
      },
      {
        type: '其他男歌手',
        cat: 4001
      },
      {
        type: '其他女歌手',
        cat: 4002
      },
      {
        type: '其他组合/乐队',
        cat: 4003
      },
    ],
    //字母
    letter: ["热", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    //装判断点击cat
    num: 5001,
    //拿到歌手详细信息
    singerDetails: [],
    //拿到点击的字母
    small: "热",
    //默认拿到的条数
    limit: 30,
    //默认页数
    offset: 0
  },
  //拿到歌手数据
  getSingers() {
    app.globalData.fly.get(`/artist/list?cat=${this.data.num}&limit=${this.data.limit}&offset=${this.data.offset}`).then(res => {
      this.setData({
        singerDetails: this.data.singerDetails.concat(res.data.artists)
      })
    }).catch(err => {
      console.log(err)
    })
  },

  //点击改变cat值
  singerCilic(e) {
    this.setData({
      num: e.currentTarget.dataset.cat,
      singerDetails:[]
    })
    this.getSingers()
  },

  //点击字母
  letterCilic(e) {
    this.setData({
      small: e.currentTarget.dataset.small,
      singerDetails: []
    })
    if (this.data.small !== "热") {

      app.globalData.fly.get(`/artist/list?cat=${this.data.num}&initial=${this.data.small}&limit=${this.data.limit}&offset=${this.data.offset}`).then(res => {
        this.setData({
          singerDetails: res.data.artists
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.getSingers()
    }
  },
  //点击歌手跳转页面并传递歌手ID
  goSong(e) {
    wx.navigateTo({
      url: `/pages/singersong/singersong?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
    })
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
    this.getSingers()
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
    this.setData({
      offset: this.data.offset + 1
    })
    this.getSingers()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})