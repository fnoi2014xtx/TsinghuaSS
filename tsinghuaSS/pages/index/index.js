//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  onClick: function (){
    /*if(app.globalData.userInfo!=null){*/
      wx.redirectTo({
        url: '../../pages/map2/map2',
      })
    /*}else {
      wx.redirectTo({
        url: '../../pages/auth/auth',
      })
      console.log("no auth")
    }*/
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    if(app.globalData.userInfo!=null){
      wx.redirectTo({
      url: '../../pages/map2/map2',
    })
  }
  }
})
