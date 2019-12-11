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
    //拿到用户数据
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
      app.globalData.fly.get(`/search?keywords=${this.properties.value}&type=1002&limit=${this.data.limit}&offset=${this.data.offset}`).then(res => {
        this.setData({
          keysList: res.data.result.userprofiles.concat(this.data.keysList)
        })
        // console.log(this.data.keysList, 456)
      }).catch(err => {
        console.log(err)
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
