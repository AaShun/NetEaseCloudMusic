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
    //默认搜索关键词
    placeholder: "",
    //搜索下方图
    image: {},
    //点击取消
    show: false,
    //获取热搜列表
    hotList: [],
    //搜索框内容
    value: "",
    //历史记录
    historyWors: [],
    //搜索框有内容记录开关
    show: false,
    //搜索建议
    suggestion: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击取消时
    cancel() {
      this.triggerEvent('cel', {
        aaa: this.data.show,
        show: false
      })
    },
    //跳转歌手页面
    goSinger() {
      wx.switchTab({
        url: '/pages/singer/singer',
      })
    },


    //拿到默认的热搜词
    getPlaceholder() {
      app.globalData.fly.get('/search/default').then(res => {
        this.setData({
          placeholder: res.data.data.realkeyword
        })

      }).catch(err => {
        console.log(err)
      })
    },

    //当input框输入内容，弹出弹出层
    change(e) {
      this.setData({
        show: true,
        value: e.detail.value
      });
      app.globalData.fly.get(`/search/suggest?keywords=${this.data.value}&type=mobile`).then(res => {
        this.setData({
          suggestion: res.data.result.allMatch
        })

        // console.log(res, 123)
        // console.log(this.data.suggestion, 456)


      }).catch(err => {
        console.log(err)
      })
    },

    //点击弹出框内容给value
    suggestion(e) {
      this.setData({
        value: e.currentTarget.dataset.value,
        show: false
      })
    },
    //异步操作关闭弹出层
    onClose() {
      // console.log(23)
      this.setData({
        show: false
      });
    },

    //搜索下方图
    getImg() {
      app.globalData.fly.get('/banner').then(res => {
        let arr = Math.ceil(Math.random() * res.data.banners.length - 1)
        this.setData({
          image: res.data.banners[arr]
        })

      }).catch(err => {
        console.log(err)
      })
    },

    //热搜列表
    getHot() {
      app.globalData.fly.get('/search/hot/detail').then(res => {

        this.setData({
          hotList: res.data.data
        })

        // console.log(this.data.hotList,456456)

      }).catch(err => {
        console.log(err)
      })
    },

    //点击热搜关键词  把点击名称给value
    hotClick(e) {
      this.setData({
        value: e.currentTarget.dataset.value,
      })
      wx.navigateTo({
        url: `/pages/searchDetail/searchDetail?value=${this.data.value}`,
      })
    },

    //输入关键词后确认
    confirm(e) {
      if (e.detail.value !== "") {
        this.setData({
          value: e.detail.value
        })

        wx.navigateTo({
          url: `/pages/searchDetail/searchDetail?value=${this.data.value}`,
        })
      } else {
        this.setData({
          value: this.data.placeholder
        })
        wx.navigateTo({
          url: `/pages/searchDetail/searchDetail?value=${this.data.value}`,
        })
      }

      //如果数组里面没有搜索的关键词（.trim()去掉两端的空格）
      if (this.data.historyWors.indexOf(this.data.value.trim()) < 0) {
        //如果搜索词部位空
        if (this.data.value.trim() !== "") {
          if (this.data.historyWors.length < 6) {
            //当历史搜索的长度小于6，把搜索内容加进新数组
            this.data.historyWors.unshift(this.data.value)
            this.setData({
              historyWors: this.data.historyWors
            })
          } else {
            //当历史记录大于6 ，就把末尾的删掉，追加新的
            this.data.historyWors.pop()
            this.data.historyWors.unshift(this.data.value)
            this.setData({
              historyWors: this.data.historyWors
            })
          }
          wx.setStorageSync('historyWors', this.data.historyWors)
        }
      }
    },

    //点击历史搜索把值给到input框的value
    histoyClick(e) {
      this.setData({
        value: e.currentTarget.dataset.historyvalue
      })
      wx.navigateTo({
        url: `/pages/searchDetail/searchDetail?value=${this.data.value}`,
      })
    },
    //点击清空历史记录
    historyDel() {
      this.setData({
        historyWors: []
      })
      wx.setStorageSync('historyWors', this.data.historyWors)
    },


  },

  ready() {
    this.getPlaceholder()
    this.getImg()
    this.getHot()

    //判断Storage里面是否有数据
    if (wx.getStorageSync('historyWors') !== "") {
      this.setData({
        historyWors: wx.getStorageSync('historyWors')
      })
    }
  }


})