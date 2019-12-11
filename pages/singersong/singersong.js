const app = getApp()
let time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //接收点击传来的歌手ID
    id: "",
    //装歌手歌曲
    list: [],
    //装专辑列表
    albumList: [],
    //装视频列表
    radioList: [],
    //标签切换
    active: 0,
    //节目列表默认条数
    limit: 40,
    //列表默认页数
    offset: 0

  },
  //拿到歌曲数据
  getList() {
    app.globalData.fly.get(`/artists?id=${this.data.id}`).then(res => {
      this.setData({
        list: res.data
      })
      // console.log(this.data.list, 1)
    }).catch(err => {
      console.log(err)
    })

  },

  //点击歌曲跳转播放
  goPage(e) {
    //保存播放歌曲id
    wx.setStorageSync('songId', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/playbackPage/playbackPage',
    })

    this.setData({
      songId: wx.getStorageSync('songId')
    })
  },

  //点击专辑跳转专辑详情
  goalbum(e){
    wx.navigateTo({
      url: `/pages/dishDetail/dishDetail?id=${e.currentTarget.dataset.id}`,
    })
  },


  //拿到专辑列表
  getAlbum() {
    app.globalData.fly.get(`/artist/album?id=${this.data.id}&limit=${this.data.limit}&offset=${this.data.offset}`).then(res => {
      // console.log(res.data.hotAlbums, 456)
      this.setData({
        albumList: res.data.hotAlbums.concat(this.data.albumList)
      })

      //把时间转换成需要的格式
      this.data.albumList.map(item => {
        item.publishTime = time.formatTimeTwo(item.publishTime, 'Y.M.D')
      })

      this.setData({
        albumList: res.data.hotAlbums.concat(this.data.albumList)
      })
    }).catch(err => {
      console.log(err)
    })

  },

  //拿到视频列表
  getRadio() {
    app.globalData.fly.get(`/artist/mv?id=${this.data.id}&limit=${this.data.limit}&offset=${this.data.offset}`).then(res => {
      // console.log(res.data.mvs, 45)
      this.setData({
        radioList: res.data.mvs
      })

      this.data.radioList.map(item => {
        //转换播放次数
        if (item.playCount / 10000 > 1) {
          item.playCount = `${Math.floor(item.playCount / 10000)}万`
        } else {
          item.playCount = item.playCount
        }
      })

      this.setData({
        radioList: res.data.mvs
      })


    }).catch(err => {
      console.log(err)
    })
  },





  //拉倒底再加载
  lower() {

    this.setData({
      offset: this.data.offset + this.data.limit
    })

    this.getAlbum()
  },

  //返回上一次来的地方
  goBack() {
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    //存歌手id
    this.setData({
      id: options.id
    })

    this.getList()
    this.getAlbum()
    this.getRadio()
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