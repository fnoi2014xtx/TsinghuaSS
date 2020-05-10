//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardInfo: {
      avater: "", //需要https图片路径
      qrCode: "", //需要https图片路径
      
    },
    name: "",
  },

  onLoad: function(options) {
    this.setData({name: app.globalData.userInfo.nickName})
    //console.log('@'+this.data.name)
    let time = 0
    switch(options.time){
      case "morning":
        time = 1
        break
      case "afternoon":
        time = 2
        break
      case "night":
        time = 3
        break
    }
    this.setData({
      cardInfo:{
        avater: `https://cdn.jsdelivr.net/gh/fnoi2014xtx/TsinghuaSS@${app.globalData.version}/static/${options.id}/${time}.png`, //需要https图片路径
        qrCode: `https://cdn.jsdelivr.net/gh/fnoi2014xtx/TsinghuaSS@${app.globalData.version}/static/QR.jpg`, //需要https图片路径
      }
      //id:options.id,
      //time:options.time,
    })
    this.getAvaterInfo()    
  },

  getAvaterInfo: function() {
    wx.showLoading({
      title: '获取背景图...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.cardInfo.avater, //头像图片路径
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath; //下载成功返回结果
          that.getQrCode(avaterSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function() {
              var avaterSrc = "";
              that.getQrCode(avaterSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 下载二维码图片
   */
  getQrCode: function(avaterSrc) {
    wx.showLoading({
      title: '获取二维码...',
      mask: true,
    });
    var that = this;

    wx.downloadFile({
      url: that.data.cardInfo.qrCode, //二维码路径
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.sharePosteCanvas(avaterSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function() {
              var codeSrc = "";
              that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 开始用canvas绘制分享海报
   * @param avaterSrc 下载的头像图片路径
   * @param codeSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function(avaterSrc, codeSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    var cardInfo = that.data.cardInfo; //需要绘制的数据集合
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function(rect) {
      var height = rect.height;
      var right = rect.right;
      var width = rect.width;
      var left = rect.left;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, width, height);

      //头像为正方形
      if (avaterSrc) {
        ctx.drawImage(avaterSrc, 0, 0, width, height);
      }

      
      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, 0, height-height/5, width / 5, height / 5)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.fillText("微信扫码或长按识别", left + 160, width + 150);
      }
      //ctx.setShadow(6,6,40,'#FFF')
      //姓名
      if (that.data.name) {
        ctx.beginPath();//开始一个新的路径
        ctx.setFontSize(10);//设置填充文本字体的大小
        ctx.setLineWidth(6);//设置线条的宽度
        ctx.setShadow(0,0,1,'rgba(0,0,0,1)');//设置阴影
        ctx.setStrokeStyle('rgba(255,255,255,0.8)');//设置线条的样式
        ctx.setFillStyle('rgba(255,255,255,0.8)');//设置填充的样式
        ctx.setTextAlign('right')
        ctx.setTextBaseline('bottom')
        ctx.fillText('@' + that.data.name, width-10, height-4);//设置填充文本fillText()第一个值为显示的文本，第二个值为文本的x坐标，第三个值为文本的y坐标
        ctx.stroke();//对当前路径进行描边
        ctx.closePath();//关闭当前路径
        
      }
    }).exec()

    setTimeout(function() {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  /**
   * 多行文字处理，每行显示数量
   * @param text 为传入的文本
   * @param num  为单行显示的字节长度
   */
  textByteLength(text, num) {
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },

  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) { 
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function(res) {
                  if (res.confirm) {}
                },
                fail: function(res) {}
              })
            },
            fail: function(err) {
              if(err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
　　　　　　　　　　wx.showModal({
　　　　　　　　　　　　title: '提示',
　　　　　　　　　　　　content: '需要您授权保存相册',
　　　　　　　　　　　　showCancel: false,
　　　　　　　　　　　　success: modalSuccess => {
　　　　　　　　　　　　　　wx.openSetting({
　　　　　　　　　　　　　　　　success(settingdata) {
　　　　　　　　　　　　　　　　　　if (settingdata.authSetting['scope.writePhotosAlbum']) {
　　　　　　　　　　　　　　　　　　　　console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
　　　　　　　　　　　　　　　　　　}else {
　　　　　　　　　　　　　　　　　　　　console.log('获取权限失败，给出不给权限就无法正常使用的提示')
　　　　　　　　　　　　　　　　　　}
　　　　　　　　　　　　　　　　}
　　　　　　　　　　　　　　})
　　　　　　　　　　　　}
　　　　　　　　　　})
    　　　　  }　　　　　　  
            }
          })
        }
      });
    }, 1000);
  },

})