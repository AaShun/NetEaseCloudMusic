const app = getApp()
import create from "../../utils/create"
import store from "../../store/index"
create.Page(store,{
  use: ["active"],

  /**
   * 页面的初始数据
   */
  data: {
    //搜索关键词
    value: "",
    //标签页跳转定位                                   
    // active: 0,
    //模糊搜索弹出框
    show: false,
    //搜索建议
    suggestion: []
  },
  //返回上一次来的地方
  goBack() {
    wx.navigateBack({})
  },


  //接受子组件传值
  // getAct(e) {
  //   console.log(typeof (e.detail), '父组件')
  //   this.setData({
  //     active: e.detail
  //   })
  //   console.log(this.data.active, "子传父")
  // },

  confirm(e) {
    console.log(e, 56)
    this.setData({
      value: e.detail.value
    })
  },

  //模糊搜索弹出层
  change(e) {
    console.log(this.store.data.active, 111)
    this.setData({
      show: true,
      // value: e.detail.value
    });
    app.globalData.fly.get(`/search/suggest?keywords=${e.detail.value}&type=mobile`).then(res => {
      this.setData({
        suggestion: res.data.result.allMatch
      })

      // this.setData({
      //   value: e.detail.value
      // })
      console.log(e.detail.value,555)

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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      value: options.value
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})