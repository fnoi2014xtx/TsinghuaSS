// pages/demo/demo.js
const util = require('./util.js')
const app = getApp()
const Rpx = require("../../components/simplemap/utils/convert").rpxToPx
const SimpleMap = require("../../components/simplemap/simplemap").SimpleMap
const Layer = require("../../components/simplemap/layers/Layer")
const Widget = require("../../components/simplemap/widgets/Widget")

const SERVER_URL = `https://cdn.jsdelivr.net/gh/fnoi2014xtx/TsinghuaSS@${app.globalData.version}/static/`


Page({

	marks: {},

	/**
	 * 页面的初始数据
	 */
	data: {
		top: "10%",
		results: [],
		time:"morning",
		showMap: true,
		marks:[],
		showModal:true,
	},

	ok:function () {
    this.setData({
      showModal:false
		})
  },
	onInput: function (e) {
		const value = e.detail.value
		if (value != "") {
			const results = util.searchWord(value, this.allMarks, (o) => { return o.tag })
			if (e.type == "confirm") {
				if (results.length > 0) {
					this.setData({
						results: [],
						showMap: true
					})
					this.marks[results[0].tag].click()
				} else {
					wx.showToast({
						title: "无搜索结果",
						icon: "none"
					})
				}
			} else {
				this.setData({
					results: results,
					showMap: results.length == 0
				})
			}
		}
		this.searchValue = value
		return value
	},
	onSearch: function(e) {
		if (this.data.showMap) {
			if (this.searchValue != null && this.searchValue != "") {
				const results = util.searchWord(this.searchValue, this.allMarks, (o) => { return o.tag })
				if (results.length > 0) {
					this.setData({
						results: results,
						showMap: false
					})
				}else {
					wx.showToast({
						title: "无搜索结果",
						icon: "none"
					})
				}
			}
		} else {
			this.setData({
				results: [],
				showMap: true,
				searchValue: ""
			})
		}
	},
	selectResult: function(e) {
		this.setData({
			showMap: true
		})
		const tag = e.target.dataset.tag
		if (tag in this.marks){
			// 强制触发点击回调
			this.marks[tag].click()
		}
	},

	onMapReady: function (res) {
		const map = res.map

		// 配置瓦片图图层
		const mapLayer = new Layer.TileMapLayer(map, Math.round(util.scale*600), Math.round(util.scale*600))
		mapLayer.addTileLevel(1.0, SERVER_URL + "map-{column}-{row}.jpg", 1500, 2026, 1500, 2026)
		map.setMap(mapLayer)

	
		const btnMorning = new Widget.ImageButton(map, map.width - Rpx(140), map.height - Rpx(336), "../../static/morning.png", Rpx(48), Rpx(48))
		btnMorning.setPadding(Rpx(15))
		
		const btnAfternoon = new Widget.ImageButton(map, map.width - Rpx(140), map.height - Rpx(336), "../../static/afternoon2.png", Rpx(48), Rpx(48))
		btnAfternoon.setPadding(Rpx(15))
		
		const btnEvening = new Widget.ImageButton(map, map.width - Rpx(140), map.height - Rpx(336), "../../static/night2.png", Rpx(48), Rpx(48))
		btnEvening.setPadding(Rpx(15))
		
		
		const that = this
		
		btnMorning.setClickCallback(widget => {
			btnMorning.setIcon("../../static/morning.png")
			btnAfternoon.setIcon("../../static/afternoon2.png")
			btnEvening.setIcon("../../static/night2.png")
			that.setData({
				time:"morning"
			})
		})
		btnAfternoon.setClickCallback(widget => {
			btnMorning.setIcon("../../static/morning2.png")
			btnAfternoon.setIcon("../../static/afternoon.png")
			btnEvening.setIcon("../../static/night2.png")
			that.setData({
				time:"afternoon"
			})
		})
		btnEvening.setClickCallback(widget => {
			btnMorning.setIcon("../../static/morning2.png")
			btnAfternoon.setIcon("../../static/afternoon2.png")
			btnEvening.setIcon("../../static/night.png")
			that.setData({
				time:"night"
			})
		})
		const btnGroup2 = new Widget.ButtonGroup(map, map.width - Rpx(140), Rpx(167))
		btnGroup2.setVerticalAlign("middle")
		btnGroup2.addButton(btnMorning)
		btnGroup2.addButton(btnAfternoon)
		btnGroup2.addButton(btnEvening)
		map.addWidget(btnGroup2)

		// 配置并添加文字Logo
		const text = new Widget.Text(map, 10, map.height - 10, "清华小地图")
		text.setTextColor("#5D138A")
		text.setTextBaseline("bottom")
		text.setTextAlign("left")
		map.addWidget(text)

		// 配置并添加指北针图标
		const image = new Widget.Image(map, "../../static/cute_north.png", 16, 16, 25, 63)
		map.addWidget(image)

		// 在线获取地图标记列表并添加Mark图层到地图
		
		that.allMarks = util.locations
		
		const marks = []
		const bans = util.bans
		const clearClick = () => {
			for (const mark of marks) {
				mark.mark.setIcon("../../static/transparent.png",mark.w,mark.h)
				mark.mark.setOffset(mark.offsetX,mark.offsetY)
			}
		}
		for (const m of that.allMarks) {
			const mark = new Layer.MarkLayer(map, null, m.x, m.y)
			mark.setVisibleZoom(null, null)
			mark.setIcon("../../static/transparent.png",m.w,m.h)
			mark.setOffset(m.offsetX,m.offsetY)
			mark.setClickCallback(e => {
				clearClick()
				e.target.setTextSize(14)
				e.target.setIcon("../../static/position.png", 24, 32)
				e.target.setOffset(-12, -32)
				map.setLocation(e.target.x, e.target.y)
				map.setZoom(e.target.getShowZoom())
				setTimeout(function(){
					clearClick()
					if(bans[m.id]!=that.data.time){
						if(app.globalData.userInfo){
							wx.navigateTo({url: `../poster/poster?id=${m.id}&&time=${that.data.time}`,})
						} else {
							wx.navigateTo({url: `../auth/auth?id=${m.id}&&time=${that.data.time}`,}
							)
						}
					}
				},500)
				
			})
			map.addLayer(mark)
			marks.push({
				mark:mark,
				offsetX:m.offsetX,
				offsetY:m.offsetY,
				w:m.w,
				h:m.h
			})
			that.marks[m.tag] = mark
		}
		mapLayer.setClickCallback(e => {
			clearClick()
		})
		map.setLocation(Math.round(wx.getSystemInfoSync().windowWidth/2), Math.round(600*util.scale-wx.getSystemInfoSync().windowHeight/2))
		this.setData({
			showModal:true
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const mapOptions = {
			minZoom: 1, // 最小缩放倍数
			maxZoom: 1, // 最大缩放倍数
			slide: true // 开启惯性滑动
		}
		const map = new SimpleMap(this, "map", mapOptions)
		// 设置地图canvas准备完毕回调
		map.setOnReadyCallback(this.onMapReady)
		this.map = map
	},

	onShow: function(){
		// 在页面显示时调用show方法，开始绘制地图。
		this.map.show()
	},
	onHide: function () {
		// 在页面显示时调用hide方法，停止绘制地图以节省资源。
		this.map.hide()
	},
	onUnload: function () {
		// 在页面被回收时调用stop方法，彻底结束掉地图绘制。
		this.map.stop()
	}
})