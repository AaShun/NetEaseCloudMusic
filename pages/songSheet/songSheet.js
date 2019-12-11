const app = getApp()
import create from "../../utils/create"
import store from "../../store/index"
create.Page(store, {
  use: ["palySong"],

  /**
   * 页面的初始数据
   */
  data: {
    //装传递来的歌单id
    id: "",
    //拿到传来的专辑接受
    copywriter: "",
    //拿到歌单的歌曲
    tracks: {},
    //播放器的开关，点击一下就出现
    horn: -1,
    //点击需要播放的音乐
    // playSong: [],
    //播放音乐开关
    playing: true,
    //歌曲id
    songId: "",
    //歌曲播放地址
    musicSrc: "",
    //歌曲列表弹出层
    show: false,
    //歌曲列表
    songsList: [],
    //如果是VIP歌曲就不进入详情
    isVip: false
  },
  //拿到数据
  getTracks() {
    app.globalData.fly.get(`/playlist/detail?id=${this.data.id}`).then(res => {

      if (res.data.playlist.playCount / 100000000 > 1) {
        //保留一位小数
        res.data.playlist.changeCount = `${(res.data.playlist.playCount / 100000000).toFixed(1)}亿`
      } else {
        //不保留小数，取整
        res.data.playlist.changeCount = `${parseInt(res.data.playlist.playCount / 10000)}万`
      }

      if (res.data.playlist.subscribedCount / 100000000 > 1) {
        //保留一位小数
        res.data.playlist.collectCount = `${(res.data.playlist.subscribedCount / 100000000).toFixed(1)}亿`
      } else {
        //不保留小数，取整
        res.data.playlist.collectCount = `${(res.data.playlist.subscribedCount / 10000).toFixed(1)}万`
      }

      //将歌曲列表存到srorage,方便调用和修改
      wx.setStorageSync('songsList', res.data.playlist.tracks)

      this.setData({
        tracks: res.data.playlist,
        songsList: wx.getStorageSync('songsList')
      })

      // console.log(this.data.songsList, 1)
    }).catch(err => {
      console.log(err)
    })
  },
  //返回上一次来的地方
  goBack() {
    wx.navigateBack({})
  },

  //点击歌曲  调取歌曲详情
  getplaySong() {
    app.globalData.fly.get(`/song/detail?ids=${this.data.songId}`).then(res => {
      this.setData({
        playSong: res.data.songs
      })
      //把数据存到store里面
      this.store.data.playSong = this.data.playSong
      // console.log(this.store.data.playSong,7777)
    }).catch(err => {
      console.log(err)
    })
  },


  //拿到播放音乐的id
  getSongId() {

    app.globalData.fly.get(`/song/url?id=${this.data.songId}`).then(res => {

      let url = wx.getBackgroundAudioManager()
      url.src = res.data.data[0].url
      this.data.musicSrc = res.data.data[0].url
      url.title = this.data.tracks.name
      url.coverImgUrl = this.data.tracks.coverImgUrl

      this.setData({
        //拿到播放的回调函数
        playTime: wx.getBackgroundAudioManager(),
        //把播放的URL存起来
        musicSrc: res.data.data[0].url,
        isVip: true
      })

      wx.setStorageSync('musicSrc', res.data.data[0].url)

      // console.log(res, 456)

    }).catch(err => {
      wx.showToast({
        title: 'VIP歌曲',
        icon: 'none'
      })

      this.setData({
        playing: false,
        isVip: false
      })
    })
  },

  //点击播放及数字变图片
  changeImg(e) {

    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    // wx.setStorageSync('playSong', e.currentTarget.dataset.item)
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
  goPage(e) {
    if (this.data.isVip) {
      wx.navigateTo({
        url: '/pages/playbackPage/playbackPage',
      })
    }
  },

  //点击控制播放并更换图片
  changeControl(e) {
    // stop
    // console.log(e.currentTarget.dataset.playing)
    // wx.setStorageSync('playing', e.currentTarget.dataset.playing)
    //暂停
    if (!e.currentTarget.dataset.playing) {
      wx.pauseBackgroundAudio()

    } else {
      //播放
      wx.playBackgroundAudio({
        dataUrl: this.data.musicSrc,
        title: this.data.tracks.name,
        coverImgUrl: this.data.tracks.coverImgUrl
      })
    }
    this.setData({
      playing: e.currentTarget.dataset.playing
    })
  },

  //点击歌单列表显示弹出层
  songList(e) {
    this.setData({
      show: e.currentTarget.dataset.show
    })
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
      icon: "none"
    })
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

  //点击歌曲播放
  playNow(e) {
    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    // wx.setStorageSync('playSong', e.currentTarget.dataset.item)
    wx.setStorageSync('songId', e.currentTarget.dataset.id)
    this.setData({
      songId: wx.getStorageSync('songId'),
      horn: wx.getStorageSync('horn'),
      // playSong: wx.getStorageSync('playSong')
    })
    this.getplaySong()
    this.getSongId()
  },

  //异步操作关闭弹出层
  onClose() {
    this.setData({
      show: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    //接收id
    this.setData({
      id: options.id,
      copywriter: options.copywriter
    })
    this.getTracks()
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