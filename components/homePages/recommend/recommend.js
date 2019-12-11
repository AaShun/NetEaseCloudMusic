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
    resultLsit:[]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拿到歌单数据
   getLsit(){
     app.globalData.fly.get('/personalized?limit=6').then(res=>{
        
       res.data.result.map(item=>{
         if (item.playCount / 100000000 >1){
          //保留一位小数
           item.changeCount = `${(item.playCount / 100000000).toFixed(1)}亿`
         }else{
           //不保留小数，取整
           item.changeCount = `${parseInt(item.playCount / 10000)}万`
         }
       })
       this.setData({
         resultLsit: res.data.result
       })
     }).catch(err => {
       console.log(err)
     })
   },

   //跳转到歌单详情并传递id
    goSheet(e){
      wx:wx.navigateTo({
        url: `/pages/songSheet/songSheet?id=${e.currentTarget.dataset.id}&copywriter=${e.currentTarget.dataset.copywriter}`,
      })
    }

  },
  ready(){
    this.getLsit()
  }
})
