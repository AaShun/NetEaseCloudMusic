let time = require('../../utils/util.js');
const app = getApp()
import areaList from "../../lib/city/city.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //拿到用户信息
    user: {},
    //用户名
    nickname: "",
    //性别
    gender: '',
    //性别选择开关
    chooseGender: false,
    //需要传递性别id
    gid: '',
    //更改性别
    changeGender: [{
        gid: 0,
        sex: '保密'
      },
      {
        gid: 1,
        sex: '男'
      },
      {
        gid: 2,
        sex: '女'
      }
    ],

    //生日
    birthday: "",
    //时间戳生日
    birth: "",
    //点击生日弹出生日选择
    show: false,
    //城市
    city: "",
    //城市编号
    cityCode: "",
    //省份
    province: "",
    //省份编号
    provinceCode: "",
    //城市列表
    areaList: {},
    //点击城市选择弹窗
    choosecit: false,
    //个性签名
    signature: "",
    //日期
    currentDate: new Date().getTime(),
    minDate: new Date(new Date() - 36500 * 24 * 3600 * 1000).getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },

  //选择性别
  showGender(e) {
    this.setData({
      chooseGender: true
    })
  },

  //选择性别
  chooseSex(e) {
    this.setData({
      gender: e.currentTarget.dataset.sex,
      gid: e.currentTarget.dataset.gid,
      chooseGender: false
    })
  },

  //点击生日弹出日期选择的开关
  showPopup(e) {
    this.setData({
      show: e.currentTarget.dataset.show
    })
  },
  //异步操作关闭弹出层
  onClose() {
    this.setData({
      //生日弹出层
      show: false,
      //城市弹出层
      choosecit: false,
      //性别弹出层
      chooseGender: false
    })
  },
  //日期选择
  onInput(event) {
    this.setData({
      currentDate: event.detail
    })
  },
  //日期框点击取消
  cancel() {
    this.setData({
      //日期框
      show: false,
      //地址框
      choosecit: false
    });
  },

  //日期框点击确定
  confirm(e) {
    this.setData({
      //生日
      birthday: time.formatTimeTwo(e.detail, 'Y-M-D'),
      //时间戳
      birth: e.detail,
      //日期开关
      show: false
    });
  },


  //城市弹出层
  chooseCity(e) {
    this.setData({
      choosecit: e.currentTarget.dataset.choosecit
    })
  },

  //城市省份组合
  getHome() {
    this.setData({
      city: this.data.areaList.city_list[this.data.cityCode],
      province: this.data.areaList.province_list[this.data.provinceCode]
    })
  },

  //城市确认
  confirmCity(e) {
    this.setData({
      city: e.detail.values[0].name,
      cityCode: e.detail.values[0].code,
      province: e.detail.values[1].name,
      provinceCode: e.detail.values[1].code,
      //地址框关闭
      choosecit: false
    })
  },


  // 输入框点击确定拿到用户名
  nicknameEdit(e) {
    this.setData({
      nickname: e.detail
    })
  },

  //输入框点击确定拿到签名
  signatureEdit(e) {
    this.setData({
      signature: e.detail
    })
  },

  //点击确认提交
  checkMsg() {
    app.globalData.fly.get(`/user/update?gender=${this.data.gid}&signature=${this.data.signature}&city=${this.data.cityCode}&nickname=${this.data.nickname}&birthday=${this.data.birth}&province=${this.data.provinceCode}`).then(res => {
      wx.showToast({
        title: '修改成功'
      })
    }).catch(err => {
      wx.showToast({
        title: '修改成功',
        icon: "none"
      })
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user: wx.getStorageSync('user'),
      areaList: areaList
    })

    this.setData({
      //拿到昵称
      nickname: this.data.user.profile.nickname,
      //拿到生日
      birthday: time.formatTimeTwo(this.data.user.profile.birthday, 'Y-M-D'),
      //生日时间戳
      birth: this.data.user.profile.birthday,
      //拿到城市
      cityCode: this.data.user.profile.city,
      //拿到省份
      provinceCode: this.data.user.profile.province,
      //拿个性签名
      signature: this.data.user.profile.signature,

    })

    //拿到性别
    if (this.data.user.profile.gender === 2) {
      this.setData({
        gender: '女',
        gid: 2

      })
    } else if (this.data.user.profile.gender === 1) {
      this.setData({
        gender: '男',
        gid: 1
      })
    } else {
      this.setData({
        gender: '保密',
        gid: 0
      })
    }

    this.getHome()

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