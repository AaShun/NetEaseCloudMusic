const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String
    }
  },
  observers: {
    "value" (value) {
      if (value !== "") {
        this.getDetail(value, this.data.limit, this.data.offset)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //搜索详情数据
    keysList: [],
    //歌曲播放地址
    musicSrc: "",
    //点击歌曲信息
    playSong: {},
    //播放状态
    playing: true,
    //节目列表默认条数
    limit: 40,
    //列表默认页数
    offset: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击搜索后，拿详情搜索数据
    getDetail(keywords, limit, offset) {
      app.globalData.fly.get(`/search?keywords=${keywords}&limit=${limit}&offset=${offset}`).then(res => {

        this.setData({
          keysList: res.data.result.songs.concat(this.data.keysList)
        })
        // console.log(res, 1)
        // console.log(this.data.keysList, 2)

      }).catch(err => {
        console.log(err)
      })
    },


    //点击歌曲  调取歌曲详情
    getplaySong() {
      app.globalData.fly.get(`/song/detail?ids=${this.data.songId}`).then(res => {
        this.setData({
          playSong: res.data.songs[0]
        })
        // console.log(res, 123)
        // console.log(this.data.playSong, 456)
      }).catch(err => {
        console.log(err)
      })
    },

    //拿到播放音乐的id
    getSongId() {

      app.globalData.fly.get(`/song/url?id=${this.data.songId}`).then(res => {
        // console.log(res, 456)
        let url = wx.getBackgroundAudioManager()
        url.src = res.data.data[0].url
        this.data.musicSrc = res.data.data[0].url
        url.title = this.data.playSong.name
        url.coverImgUrl = this.data.playSong.picUrl

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

        this.setData({
          playing: false,
          // isVip: false
        })
      })
    },

    //点击播放
    changeImg(e) {
      wx.setStorageSync('horn', e.currentTarget.dataset.horn)
      wx.setStorageSync('songId', e.currentTarget.dataset.id)
      wx.setStorageSync('playing', this.data.playing)
      wx.setStorageSync('songsList', this.data.keysList)
      this.setData({
        // playSong: wx.getStorageSync('playSong'),
        songId: wx.getStorageSync('songId')
      })

      wx.navigateTo({
        url: '/pages/playbackPage/playbackPage',
      })

      console.log(e.currentTarget.dataset.item)
      this.getplaySong()
      this.getSongId()
    },

    //拉倒底再加载
    lower() {

      this.setData({
        offset: this.data.offset + this.data.limit
      })

      this.getDetail(this.properties.value, this.data.limit, this.data.offset)
    },


  },
  // ready() {
  //   this.getDetail(this.properties.value, this.data.limit, this.data.offset)
  // }
})