const app = getApp()
var WxParse = require('../../lib/wxParse/wxParse.js');
import create from "../../utils/create"
import store from "../../store/index"
create.Page(store, {
  use: ["palySong"],

  /**
   * 页面的初始数据
   */
  data: {
    //拿到点击传来的歌曲id
    songId: "",
    //拿到正在播放歌曲的信息
    // playSong: {},
    //选择喜欢高亮
    like: false,
    //歌曲播放方式
    playingMode: [{
        pid: 0,
        url: '../../icons/playback-page-circel.png'
      },
      {
        pid: 1,
        url: '../../icons/playback-page-anyone.png'
      },
      {
        pid: 2,
        url: '../../icons/playback-page-one.png'
      },
      {
        pid: 3,
        url: '../../icons/playback-page-pengpeng.png'
      }
    ],
    //默认播放模式
    pid: 0,
    //歌曲播放开关
    startStop: true,
    //滑块播放进度条
    currentValue: 0,
    //歌曲播放id
    musicSrc: "",
    //播放时长的数据
    playTime: {},
    //总时长
    duration: "",
    //已播放时长
    currentTime: "",
    //歌曲列表弹出层
    show: false,
    //喇叭开关
    horn: -1,
    //弹出的歌曲列表
    songsList: [],
    //歌词切换
    lyric: false,
    //歌词列表
    lyricList: {}
  },
  //切换歌词
  goLyric(e) {
    console.log(e)
    this.setData({
      lyric: e.currentTarget.dataset.lyric
    })
  },

  //拿到滑块的值
  onDrag(e) {
    // console.log(e)
    let jump = e.detail
    const backgroundAudio = wx.getBackgroundAudioManager()

    let jumpTime = jump / 100 * backgroundAudio.duration
    backgroundAudio.seek(jumpTime)

  },

  //返回上一次来的地方
  goBack() {
    wx.navigateBack({})
  },

  //点击选择喜欢
  cilckLike(e) {
    this.setData({
      like: e.currentTarget.dataset.like
    })
  },

  //点击歌曲播放模式改变
  cahngeMode(e) {
    if (e.currentTarget.dataset.pid < 3) {
      this.setData({
        pid: this.data.pid + 1
      })
      //等于1时。随机播放
      if (this.data.pid === 1) {
        let index = Math.floor(Math.random() * (this.data.songsList.length - 1))
        // console.log(index, 444)
        this.setData({
          songId: this.data.songsList[index].id
        })
        this.getplaySong()
      }

    } else {
      this.setData({
        pid: 0
      })
    }
  },


  //点击歌曲  调取歌曲详情
  getplaySong() {
    app.globalData.fly.get(`/song/detail?ids=${this.data.songId}`).then(res => {
      this.setData({
        playSong: res.data.songs[0]
      })
      console.log(this.data.playSong, 555)

      //把数据存到store里面
      this.store.data.playSong = this.data.playSong


      console.log(this.store.data.playSong, 7777)

      //播放时长的数据
      let url = wx.getBackgroundAudioManager()
      url.src = this.data.musicSrc
      url.title = this.data.playSong.name
      url.coverImgUrl = this.data.playSong.al.picUrl
      //把播放时间装起来
      this.setData({
        playTime: url
      })

      //正在播放的时间
      this.data.playTime.onTimeUpdate(() => {

        // console.log(this.data.playTime.currentTime, 444)

        let min = Math.floor(this.data.playTime.currentTime / 60)
        let second = (this.data.playTime.currentTime % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }

        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }

        this.setData({
          currentTime: `${min}:${second}`,
          currentValue: Math.floor(this.data.playTime.currentTime / this.data.playTime.duration * 100)
        })

        // console.log(this.data.playTime.duration, 555)


      })

      //判断总时间是否大于0 如果不 就是VIP歌曲
      if (this.data.playTime.duration > 0) {
        let min = parseInt(this.data.playTime.duration / 60)
        let second = (this.data.playTime.duration % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }
        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }
        this.setData({
          //总的分钟数
          duration: `${min}:${second}`
        })
        console.log(this.data.duration,66666)

      } else {
        // wx.showToast({
        //   title: '歌曲需VIP',
        //   icons: "none"
        // })
        this.setData({
          startStop: false
        })
      }

    }).catch(err => {
      console.log(err)
    })
  },

  //播放歌曲 //播放时长的数据
  // getTime() {
  //   console.log(this.data.playSong, 456)

  // },

  //获取歌词
  getLyric() {
    app.globalData.fly.get(`/lyric?id=${this.data.songId}`).then(res => {
      this.setData({
        lyricList: res.data
      })

      // console.log(res, 11111)
      // console.log(this.data.lyricList, 22222)
      WxParse.wxParse('article', 'md', this.data.lyricList.lrc.lyric, this, 5);
    }).catch(err => {
      console.log(err)
    })
  },


  //歌曲播放开关
  songStart(e) {
    wx.setStorageSync('playing', e.currentTarget.dataset.startstop)
    this.setData({
      startStop: wx.getStorageSync('playing')
    })
    //暂停
    if (!e.currentTarget.dataset.startstop) {
      wx.pauseBackgroundAudio()
    } else {
      //播放
      wx.playBackgroundAudio({
        dataUrl: this.data.musicSrc,
        title: this.data.playSong.name,
        coverImgUrl: this.data.playSong.al.picUrl
      })
    }

    this.setData({
      startstop: e.currentTarget.dataset.startstop
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
      songsList: wx.getStorageSync('songsList')
    })
  },

  //点击×删除当前点击歌曲
  delSongs(e) {
    //删除当前点击的歌曲
    this.data.songsList.splice(e.currentTarget.dataset.songid, 1)
    //把删除后的新数组存回Storage
    wx.setStorageSync('songsList', this.data.songsList)
    this.setData({
      songsList: wx.getStorageSync('songsList'),
      startStop: false
    })
    wx.showToast({
      title: '暂无歌曲播放',
      icons: "none"
    })
  },

  //异步操作关闭弹出层
  onClose() {
    this.setData({
      show: false
    });
  },

  //点击歌曲播放
  playNow(e) {
    // console.log(111)
    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    wx.setStorageSync('songId', e.currentTarget.dataset.id)
    this.setData({
      songId: wx.getStorageSync('songId'),
      horn: wx.getStorageSync('horn'),
    })

    this.getSongId()
    // this.getTime()
    this.getplaySong()

    if (this.data.songsList.length < 1) {
      // console.log(222)
      this.setData({
        playing: false
      })
      wx.showToast({
        title: '暂无歌曲播放',
        icons: "none"
      })
    }
  },

  // 拿到播放音乐的id 并进行播放音乐
  getSongId() {

    app.globalData.fly.get(`/song/url?id=${this.data.songId}`).then(res => {

      let url = wx.getBackgroundAudioManager()
      url.src = res.data.data[0].url
      this.data.musicSrc = res.data.data[0].url
      url.title = this.data.playSong.name
      url.coverImgUrl = this.data.playSong.al.picUrl

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

  // 点击上一曲
  lastSong() {
    //如果歌曲不是歌曲列表的第一首
    if (this.data.horn > 0) {

      this.setData({
        //修改歌曲位置
        horn: this.data.horn - 1,
        //拿到点击改变后的歌曲信息
        playSong: this.data.songsList[this.data.horn - 1],
        //歌曲播放id
        songId: this.data.songsList[this.data.horn - 1].id
      })
      wx.setStorageSync('playSong', this.data.playSong)
      wx.setStorageSync('horn', this.data.horn)

      //把数据存到store里面
      this.store.data.playSong = this.data.playSong
      console.log(this.store.data.playSong, 7777)

      //调用播放
      this.getSongId()
      // this.getplaySong()


      //播放时长的数据
      let url = wx.getBackgroundAudioManager()
      url.src = this.data.musicSrc
      url.title = this.data.playSong.name
      url.coverImgUrl = this.data.playSong.al.picUrl
      //把播放时间装起来
      this.setData({
        playTime: url
      })

      //正在播放的时间
      this.data.playTime.onTimeUpdate(() => {

        // console.log(this.data.playTime.currentTime, 444)

        let min = Math.floor(this.data.playTime.currentTime / 60)
        let second = (this.data.playTime.currentTime % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }

        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }

        this.setData({
          currentTime: `${min}:${second}`,
          currentValue: Math.floor(this.data.playTime.currentTime / this.data.playTime.duration * 100)
        })

        // console.log(this.data.playTime.duration, 555)


      })

      //判断总时间是否大于0 如果不 就是VIP歌曲
      if (this.data.playTime.duration > 0) {
        let min = parseInt(this.data.playTime.duration / 60)
        let second = (this.data.playTime.duration % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }
        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }
        this.setData({
          //总的分钟数
          duration: `${min}:${second}`
        })
        console.log(this.data.duration, 66666)

      } else {
        // wx.showToast({
        //   title: '歌曲需VIP',
        //   icons: "none"
        // })
        this.setData({
          startStop: false
        })
      }


    } else {
      //如果歌曲不是歌曲列表的第一首，则播放最后一首
      wx.setStorageSync('playSong', this.data.songsList[this.data.songsList.length - 1])
      this.setData({
        //拿到点击改变后的歌曲信息
        playSong: wx.getStorageSync('playSong'),
        //歌曲播放id
        songId: this.data.songsList[this.data.songsList.length - 1].id


      })
      wx.setStorageSync('horn', this.data.songsList.length - 1)
      //调用播放
      this.getSongId()
    }
  },

  // 点击下一曲
  nextSong() {
    //如果歌曲不是歌曲列表的第一首
    if (this.data.horn < this.data.songsList.length - 1) {

      this.setData({
        //修改歌曲位置
        horn: this.data.horn + 1,
        //拿到点击改变后的歌曲信息
        playSong: this.data.songsList[this.data.horn + 1],
        //歌曲播放id
        songId: this.data.songsList[this.data.horn + 1].id
      })
      wx.setStorageSync('playSong', this.data.playSong)
      wx.setStorageSync('horn', this.data.horn)
      //调用播放
      this.getSongId()


      //把数据存到store里面
      this.store.data.playSong = this.data.playSong
      console.log(this.store.data.playSong, 7777)

      //播放时长的数据
      let url = wx.getBackgroundAudioManager()
      url.src = this.data.musicSrc
      url.title = this.data.playSong.name
      url.coverImgUrl = this.data.playSong.al.picUrl
      //把播放时间装起来
      this.setData({
        playTime: url
      })

      //正在播放的时间
      this.data.playTime.onTimeUpdate(() => {

        // console.log(this.data.playTime.currentTime, 444)

        let min = Math.floor(this.data.playTime.currentTime / 60)
        let second = (this.data.playTime.currentTime % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }

        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }

        this.setData({
          currentTime: `${min}:${second}`,
          currentValue: Math.floor(this.data.playTime.currentTime / this.data.playTime.duration * 100)
        })

        // console.log(this.data.playTime.duration, 555)


      })

      //判断总时间是否大于0 如果不 就是VIP歌曲
      if (this.data.playTime.duration > 0) {
        let min = parseInt(this.data.playTime.duration / 60)
        let second = (this.data.playTime.duration % 60).toFixed(0)
        //如果分钟长度小于2  就在前面加一个0
        if (min < 10) {
          min = `0${min}`
        }
        //如果秒长度小于2  就在前面加一个0
        if (second.length < 2) {
          second = `0${second}`
        }
        this.setData({
          //总的分钟数
          duration: `${min}:${second}`
        })
        // console.log(this.data.duration, 66666)

      } else {
        // wx.showToast({
        //   title: '歌曲需VIP',
        //   icons: "none"
        // })
        this.setData({
          startStop: false
        })
      }


    } else {

      //如果歌曲不是歌曲列表的最后一首，则播放第一首
      wx.setStorageSync('playSong', this.data.songsList[0])
      this.setData({
        horn: 0,
        //拿到点击改变后的歌曲信息
        playSong: wx.getStorageSync('playSong'),
        //歌曲播放id
        songId: this.data.songsList[0].id
      })
      wx.setStorageSync('horn', this.data.horn)
      //调用播放
      this.getSongId()


    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      songId: wx.getStorageSync('songId'),
      startStop: wx.getStorageSync('playing'),
      musicSrc: wx.getStorageSync('musicSrc'),
      songsList: wx.getStorageSync('songsList'),
      horn: wx.getStorageSync('horn')
    })

    this.getplaySong()
    this.getLyric()

    // console.log(this.data.songId, 456)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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