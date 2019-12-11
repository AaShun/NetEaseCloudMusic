const app = getApp()
let time = require('../../../utils/util.js')
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
    "value"(value) {
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
    //发布时间
    publishTime: "",
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
      console.log(this.properties.value)
      app.globalData.fly.get(`/search?keywords=${keywords}&type=1014&limit=${limit}&offset=${offset}`).then(res => {
        console.log(res,456)
        this.setData({
          keysList: res.data.result.videos.concat(this.data.keysList)
        })
        //把时间转换成需要的格式
        this.data.keysList.map(item => {
          if (item.playTime / 10000 > 1) {
            item.playTime = `${Math.floor(item.playTime / 10000)}万`
          } else {
            item.playTime = item.playTime
          }


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
        //再把数据重新赋值
        this.setData({
          keysList: this.data.keysList
        })

        // console.log(this.data.keysList, 456)
      }).catch(err => {
        console.log(err)
      })
    },


    //点击跳转到专辑详情
    goPage(e) {
      wx.navigateTo({
        url: `/pages/dishDetail/dishDetail?id=${e.currentTarget.dataset.id}`,
      })
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