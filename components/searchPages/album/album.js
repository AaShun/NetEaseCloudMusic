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
    "value" (value) {
      if (value !== "") {
        this.getDetail(value, 10, this.data.limit, this.data.offset)
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
    getDetail(keywords, type, limit, offset) {
      console.log(this.properties.value)
      app.globalData.fly.get(`/search?keywords=${keywords}&type=${type}&limit=${limit}&offset=${offset}`).then(res => {



        this.setData({
          keysList: res.data.result.albums.concat(this.data.keysList)
        })
        //把时间转换成需要的格式
        this.data.keysList.map(item => {
          item.publishTime = time.formatTimeTwo(item.publishTime, 'Y.M.D')
        })
        //再把数据重新赋值
        this.setData({
          keysList: this.data.keysList
        })
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

      this.getDetail()
    },
  },
  // ready() {
  //   this.getDetail(this.properties.value, 10, this.data.limit, this.data.offset)
  // }
})