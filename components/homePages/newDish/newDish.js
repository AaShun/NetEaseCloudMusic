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
    //新碟的数据
    resultLsit: [],
    //改变新歌新碟的开关
    flag: true,
    //拿到新歌
    newSong: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拿新碟
    getLsit() {
      app.globalData.fly.get('/album/newest').then(res => {
        this.setData({
          resultLsit: res.data.albums.slice(0, 6)
        })
      }).catch(err => {
        console.log(err)
      })
    },

    //点击新碟进入新碟详情
    goSheet(e) {
      wx: wx.navigateTo({
        url: `/pages/dishDetail/dishDetail?id=${e.currentTarget.dataset.id}`
      })
    },

    //新歌
    getNew() {
      app.globalData.fly.get('/top/song').then(res => {
        this.setData({
          newSong: res.data.data.slice(0, 6)
        })
      }).catch(err => {
        console.log(err)
      })
    },



    //点击新歌进入播放
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
    },


    //切换新歌新碟
    changeSong(e) {

      this.setData({
        flag: e.currentTarget.dataset.flag
      })

      console.log(this.data.flag)
    }
  },
  ready() {
    this.getLsit(),
      this.getNew()
  }
})