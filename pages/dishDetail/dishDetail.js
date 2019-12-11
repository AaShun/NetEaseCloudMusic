let time = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //装传递来的歌单id
    id: "",
    //拿到歌单的歌曲
    songs: {},
    //专辑动态信息
    msg: {},
    //播放器的开关，点击一下就出现
    horn: -1,
    //点击需要播放的音乐
    playSong: {},
    //播放音乐开关
    playing: true,
    //歌曲id
    songId: "",
    //歌曲播放地址
    musicSrc: "",
    //专辑详情卡开关
    inform:false,
    //歌单列表弹出层
    show:false,
    //弹出的歌曲列表
    songsList: []
  },
   
  //点击歌曲  调取歌曲详情
  getplaySong() {
    app.globalData.fly.get(`/song/detail?ids=${this.data.songId}`).then(res => {
      this.setData({
        playSong: res.data.songs[0]
      })
      console.log(res, 123)
      console.log(this.data.playSong,456)
    }).catch(err => {
      console.log(err)
    })
  },

  //获取专辑歌曲信息
  getSongs() {
    app.globalData.fly.get(`/album?id=${this.data.id}`).then(res => {
      this.setData({
        songs: res.data,
        publishTime: time.formatTimeTwo(res.data.album.publishTime, 'Y.M.D'),
        songsList: res.data.songs
      })
      wx.setStorageSync('songsList', this.data.songsList)
    }).catch(err => {
      console.log(err)
    })
  },
  //获取专辑动态信息
  getMsg() {
    app.globalData.fly.get(`/album/detail/dynamic?id=${this.data.id}`).then(res => {
      this.setData({
        msg: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  //专辑详情介绍开关
  information(e){
    this.setData({ inform: e.currentTarget.dataset.inform });
  },

  //异步操作关闭弹出层
  onClose() {
    this.setData({ 
      inform: false,
      show: false
       });
  },

  //点击头部返回
  goBack() {
    wx.navigateBack({})
  },

  //拿到播放音乐的id
  getSongId() {

    app.globalData.fly.get(`/song/url?id=${this.data.songId}`).then(res => {

      let url = wx.getBackgroundAudioManager()
      url.src = res.data.data[0].url
      this.data.musicSrc = res.data.data[0].url
      url.title = this.data.songs.album.name
      url.coverImgUrl = this.data.songs.picUrl


      this.setData({
        //拿到播放的回调函数
        playTime: wx.getBackgroundAudioManager(),
        //把播放的URL存起来
        musicSrc: res.data.data[0].url
      })

      wx.setStorageSync('musicSrc', res.data.data[0].url)

    }).catch(err => {
      wx.showToast({
        title: 'VIP歌曲',
        icon: 'none'
      })
    })
  },

  //点击播放及数字变图片
  changeImg(e) {

    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    wx.setStorageSync('songId', e.currentTarget.dataset.id)
    wx.setStorageSync('playing', this.data.playing)
    this.setData({
      horn: wx.getStorageSync('horn'),
      // playSong: wx.getStorageSync('playSong'),
      songId: wx.getStorageSync('songId')
    })
    this.getplaySong()
    this.getSongId()
  },

  //点击下方播放栏
  goPage() {
    wx.navigateTo({
      url: '/pages/playbackPage/playbackPage',
    })
  },

  //点击歌单列表显示弹出层
  songList(e) {
    this.setData({
      show: e.currentTarget.dataset.show
    })
  },

  //点击控制播放并更换图片
  changeControl(e) {
    // stop
    // console.log(e.currentTarget.dataset.playing)
    wx.setStorageSync('playing', e.currentTarget.dataset.playing)
    //暂停
    if (!e.currentTarget.dataset.playing) {
      wx.pauseBackgroundAudio()
       
    } else {
      //播放
      wx.playBackgroundAudio({
        dataUrl: this.data.musicSrc,
        title: this.data.songs.album.name,
        coverImgUrl: this.data.songs.picUrl
      })
    }
    this.setData({
      playing: e.currentTarget.dataset.playing
    })
    this.getplaySong()
  },

  //点击删除按钮，删除全部歌曲
  allSong() {
    wx.setStorageSync('songsList', "")
    this.setData({
      songsList: wx.getStorageSync('songsList'),
      //关闭播放开关
      playing: false,
      //关闭播放弹出层
      horn: -1
    })
    wx.setStorageSync('horn', this.data.horn)
    wx.showToast({
      title: '暂无歌曲播放',
      icon:"none"
    })
  },

  //点击歌曲播放
  playNow(e) {
    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    wx.setStorageSync('songId', e.currentTarget.dataset.id)
    this.setData({
      songId: wx.getStorageSync('songId'),
      horn: wx.getStorageSync('horn'),
      // playSong: wx.getStorageSync('playSong')
    })
    this.getplaySong()
    this.getSongId()
  },

  //点击×删除当前点击歌曲
  delSongs(e) {
    //删除当前点击的歌曲
    this.data.songsList.splice(e.currentTarget.dataset.songid, 1)
    //把删除后的新数组存回Storage
    wx.setStorageSync('songsList', this.data.songsList)
    this.setData({
      songsList: wx.getStorageSync('songsList')
    })
    //如果删完了停止播放
    if (this.data.songsList.length < 1) {
      this.setData({
        playing: false
      })
      wx.showToast({
        title: '暂无歌曲播放',
        icon: "none"
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //接收id
    this.setData({
      id: options.id
    })
   
    this.getSongs()
    this.getMsg()
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