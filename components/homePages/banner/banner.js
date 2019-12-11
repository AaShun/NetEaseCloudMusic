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
    banners: [],
    indicatorDots: true,//导航点
    autoplay: true,
    circular: true, //衔接滑动
    interval: 5000,
    duration: 1000
  },
  /**
   * 组件的方法列表
   */
  methods: {
   getBanners(){
     app.globalData.fly.get('/banner').then(res=>{
       this.setData({
         banners: res.data.banners
       })
     }).catch(err => {
       console.log(err)
     })
   }
  },

ready(){
  this.getBanners()
}

})
