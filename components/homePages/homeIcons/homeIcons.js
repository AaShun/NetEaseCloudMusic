// components/homePages/hoemIcons/hoemIcons.js
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
    icons: [{
        img: "../../../icons/home-recommend.png",
        words: "每日推荐",
        path: "/pages/daySongs/daySongs"
      },
      {
        img: "../../../icons/song-sheet.png",
        words: "歌单"
      },
      {
        img: "../../../icons/home-ranking-list.png",
        words: "排行榜"
      },
      {
        img: "../../../icons/home-radio-station.png",
        words: "电台"
      },
      {
        img: "../../../icons/home-live-broadcast.png",
        words: "直播"
      }

    ],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    iconClick(e){
      console.log(e)
      wx.navigateTo({
        url: `${e.currentTarget.dataset.path}`,
      })
    }
  }
})