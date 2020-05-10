const app = getApp()

Page({
  data: {
    inputValue:""
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onLoad:function(options){
    this.setData({
      time:options.time,
      id:options.id,
    })
  },
  onClick: function (){
    //console.log(this.data.inputValue)
    app.globalData.userInfo = {
      nickName: this.data.inputValue
    }
    wx.redirectTo({url: `../poster/poster?id=${this.data.id}&&time=${this.data.time}`,})
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    if(app.globalData.userInfo!=null){
      wx.redirectTo({url: `../poster/poster?id=${this.data.id}&&time=${this.data.time}`,})
    }
  }
})
