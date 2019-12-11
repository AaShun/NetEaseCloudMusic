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
    programs: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLsit() {
      app.globalData.fly.get('/program/recommend').then(res => {
        
        this.setData({
          programs: res.data.programs.slice(0, 6)
        })
       
      }).catch(err => {
        console.log(err)
      })
    }
  },
  ready() {
    this.getLsit()
  }
})
