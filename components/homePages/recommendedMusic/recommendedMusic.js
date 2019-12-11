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
    resultLsit: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLsit() {
      app.globalData.fly.get('/personalized/djprogram').then(res => {
        this.setData({
          resultLsit: res.data.result
        })

        // console.log(this.data.resultLsit, 22)
      }).catch(err => {
        console.log(err)
      })
    },
    goRadio(e){
      wx.navigateTo({
        url: `/pages/radioDetails/radioDetails?id=${e.currentTarget.dataset.id}&program=${e.currentTarget.dataset.program} `,
      })
    }
  },
  ready() {
    this.getLsit()
  }
})