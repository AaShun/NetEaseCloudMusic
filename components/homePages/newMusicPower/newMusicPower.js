const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //全部新歌
    newSong: [],
    //拿到播放id
    songId: "",
    //需要播放的歌的信息
    tracks: {}

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //得到歌曲列表
    getLsit() {
      app.globalData.fly.get('/personalized/newsong').then(res => {

        this.setData({
          newSong: res.data.result.slice(0, 6)
        })

        // console.log(this.data.newSong,456)
      }).catch(err => {
        console.log(err)
      })
    },

    //拿到播放音乐的id
    // getSongId() {

    //   app.globalData.fly.get(`/song/url?id=${this.data.songId}`).then(res => {

    //     let url = wx.getBackgroundAudioManager()
    //     url.src = res.data.data[0].url
    //     this.data.musicSrc = res.data.data[0].url
    //     url.title = this.data.tracks.name
    //     url.coverImgUrl = this.data.tracks.song.album.blurPicUrl


    //     this.setData({
    //       //拿到播放的回调函数
    //       playTime: wx.getBackgroundAudioManager(),
    //       //把播放的URL存起来
    //       musicSrc: res.data.data[0].url
    //     })

    //     wx.setStorageSync('musicSrc', res.data.data[0].url)

    //   }).catch(err => {
    //     wx.showToast({
    //       title: '播放失败',
    //       icon: 'none'
    //     })
    //   })
    // },

    //点击图片跳转并播放点击歌曲
    goPage(e) {
      console.log(e)
      //保存播放歌曲id
      wx.setStorageSync('songId', e.currentTarget.dataset.id)
       //保存播放列表
      wx.setStorageSync('songsList', this.data.newSong)

      this.setData({
        songId: wx.getStorageSync('songId')
      })
     
      // 跳转
      wx.navigateTo({
        url: '/pages/playbackPage/playbackPage',
      })
    }
  },


  ready() {
    this.getLsit()
  }
})