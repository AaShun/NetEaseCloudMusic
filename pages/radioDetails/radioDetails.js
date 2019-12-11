var WxParse = require('../../lib/wxParse/wxParse.js');
let time = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //拿详情数据的id
    id: "",
    //那节目的id
    programId: "",
    //拿到radio的数据
    radioList: {},
    //拿到节目列表总数
    count: 0,
    //节目列表默认条数
    limit: 40,
    //列表默认页数
    offset: 0,
    //列表默认排序方式
    asc: false,
    //播放器的开关，点击一下就出现
    horn: -1,
    //详情节目弹出层默认为true
    radio: true,
    //详情节目变化
    active: 0,
    //排序开关(默认为降序)
    top: 2,
    //下方播放栏
    show: false,
    //下方播放列表对象
    playSong: {},
    //播放音乐开关
    playing: true,
    //歌曲列表
    songsList: [],
    //歌曲id
    songId: ""
  },
  //拿到电台详情
  getList() {
    app.globalData.fly.get(`/dj/detail?rid=${this.data.id}`).then(res => {

      this.setData({
        radioList: res.data.djRadio
      })
      WxParse.wxParse('article', 'md', this.data.radioList.desc, this, 5);
    }).catch(err => {
      console.log(err)
    })
  },

  //拿到节目列表
  getProgram() {
    app.globalData.fly.get(`/dj/program?rid=${this.data.id}&limit=${this.data.limit}&offset=${this.data.offset}&asc=${this.data.asc}`).then(res => {


      res.data.programs.map(item => {
        //转换发布时间
        item.createTime = time.formatTimeThree(item.createTime, 'M-D')
        //转换播放次数
        if (item.listenerCount / 10000 > 1) {
          item.listenerCount = `${Math.floor(item.listenerCount / 10000)}万`
        } else {
          item.listenerCount = item.listenerCount
        }

        //转换歌曲长度
        let min = parseInt(item.duration / 1000 / 60)
        let second = parseInt(item.duration / 1000 % 60)
        if (min < 10) {
          min = `0${min}`
        }
        if (second < 10) {
          second = `0${second}`
        }

        item.duration = `${min}:${second}`

      })

      if(res.data.count){
        this.setData({
          count: res.data.count,
          songsList: this.data.songsList.concat(res.data.programs)
        })
      }

      // console.log(this.data.songsList, 456)
    })
  },

  //点击控制播放并更换图片
  changeControl(e) {
    this.setData({
      playing: e.currentTarget.dataset.playing
    })
  },


  //点击排序切换排序模式
  topDown(e) {
    this.setData({
      top: e.currentTarget.dataset.top
    })

    //默认为倒叙
    if (e.currentTarget.dataset.top === 2) {

      this.setData({
        asc: false,
        songsList: []
      })
      this.getProgram()

    } else {
      //点击后变为正序
      this.setData({
        asc: true,
        songsList: []
      })
      this.getProgram()
    }

    console.log(this.data.songsList, 999)


  },

  //返回上一次来的地方
  goBack() {
    wx.navigateBack({})
  },

  //点击播放及数字变图片
  changeImg(e) {

    wx.setStorageSync('horn', e.currentTarget.dataset.horn)
    wx.setStorageSync('playSong', e.currentTarget.dataset.item)
    wx.setStorageSync('playing', this.data.playing)
    this.setData({
      horn: wx.getStorageSync('horn'),
      playSong: wx.getStorageSync('playSong')
    })
  },


  //滑到底部
  lower() {

    this.setData({
      offset: this.data.offset + this.data.limit
    })


      this.getProgram()



  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...'
    })
    //拿到传来的值
    this.setData({
      id: options.id,
      programId: options.program
    })

    this.getList()
    this.getProgram()
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