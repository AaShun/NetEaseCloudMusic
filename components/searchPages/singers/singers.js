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
      app.globalData.fly.get(`/search?keywords=${keywords}&type=100&limit=${limit}&offset=${offset}`).then(res => {

        this.setData({
          keysList: res.data.result.artists.concat(this.data.keysList)
        })
      }).catch(err => {
        console.log(err)
      })
    },

    //点击歌手跳转页面并传递歌手ID
    goSong(e) {
      wx.navigateTo({
        url: `/pages/singersong/singersong?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`,
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
