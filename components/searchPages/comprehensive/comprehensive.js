const app = getApp()
let time = require('../../../utils/util.js')
import create from "../../../utils/create"
import store from "../../../store/index"
create.Component(store,{
  use: ["active"],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String
    }
  },
  observers:{
    "value"(value){
      if (value !==""){
        this.getList(value, 1018)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    //全部数据
    list:{},
    
  },
  // ready() {
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  //   this.getList(this.properties.value, 1018)
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    //拿综合数据
    getList(keywords, type){
      app.globalData.fly.get(`/search?keywords=${keywords}&type=${type}`).then(res=>{
          // console.log(res.data.result,999)
          //关闭加载中
          wx.hideLoading()


          this.setData({
            list: res.data.result
          })

          //把时间转换成需要的格式
          this.data.list.album.albums.map(item => {
            item.publishTime = time.formatTimeTwo(item.publishTime, 'Y.M.D')
          })
          //视频播放量转换
          this.data.list.video.videos.map(item => {
            if (item.playTime / 10000 > 1) {
              item.playTime = `${Math.floor(item.playTime / 10000)}万`
            } else {
              item.playTime = item.playTime
            }
          })
          //转换播放时间
          this.data.list.video.videos.map(item => {
            let min = parseInt(item.durationms / 1000 / 60)
            let second = parseInt(item.durationms / 1000 % 60)
            if (min < 10) {
              min = `0${min}`
            }
            if (second < 10) {
              second = `0${second}`
            }

            item.durationms = `${min}:${second}`
          })

          this.setData({
            list: this.data.list
          })



        })
      },



    //标签页跳转
    bindCode (e) {
      this.store.data.active = e.currentTarget.dataset.active
      console.log(this.store.data.active,111)
      // console.log(e.currentTarget.dataset.active, "子组件")

      // this.triggerEvent('getActive', e.currentTarget.dataset.active)
    },

  },
})
