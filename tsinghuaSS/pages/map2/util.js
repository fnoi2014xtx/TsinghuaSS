const scale = 1.5
const r = Math.round
const locations = [
	{"tag": "桃李园", "x": r(scale*160), "y": r(scale*70), "w":r(scale*80),"h":r(scale*50),"offsetX":r(scale*-40),"offsetY":r(scale*-40),"id":1}, 
	{"tag": "紫荆操场", "x": r(scale*286), "y": r(scale*110), "w":r(scale*40),"h":r(scale*85),"offsetX":r(scale*-20),"offsetY":r(scale*-40),"id":2},
	{"tag": "紫荆公寓", "x": r(scale*270), "y": r(scale*50), "w":r(scale*135),"h":r(scale*40),"offsetX":r(scale*-65),"offsetY":r(scale*-35),"id":3},
	{"tag": "C楼", "x": r(scale*240), "y": r(scale*120), "w":r(scale*40),"h":r(scale*75),"offsetX":r(scale*-25),"offsetY":r(scale*-45),"id":4},
	{"tag": "学堂路", "x": r(scale*210), "y": r(scale*270), "w":r(scale*20),"h":r(scale*155),"offsetX":r(scale*-10),"offsetY":r(scale*-85),"id":5},
	{"tag": "大礼堂", "x": r(scale*110), "y": r(scale*400), "w":r(scale*120),"h":r(scale*70),"offsetX":r(scale*-60),"offsetY":r(scale*-40),"id":6},
	{"tag": "文图", "x": r(scale*250), "y": r(scale*370), "w":r(scale*115),"h":r(scale*35),"offsetX":r(scale*-50),"offsetY":r(scale*-25),"id":7},
	{"tag": "六教", "x": r(scale*280), "y": r(scale*450), "w":r(scale*115),"h":r(scale*45),"offsetX":r(scale*-50),"offsetY":r(scale*-35),"id":8},
	{"tag": "东主楼", "x": r(scale*380), "y": r(scale*510), "w":r(scale*115),"h":r(scale*50),"offsetX":r(scale*-60),"offsetY":r(scale*-40),"id":9},
	{"tag": "综体", "x": r(scale*385), "y": r(scale*400), "w":r(scale*115),"h":r(scale*50),"offsetX":r(scale*-63),"offsetY":r(scale*-38),"id":10},
]

const bans = {
	5:'afternoon',
	6:'morning',
	10:'afternoon'
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const searchWord = (word, array, filter, limit) => {
	const weights = []
	for (const item of array) {
		const content = filter == null ? item : filter(item)
		if (content != null){
			let weight = 0
			let lastIndex = -1
			for (const char of word) {
				const index = content.indexOf(char)
				if (index != -1) {
					if (index > lastIndex) {
						weight += 1
					} else {
						weight += 0.5
					}
				}
				lastIndex = index
			}
			if (weight > 0){
				weights.push({
					item: item,
					weight: weight
				})
			}
		}
	}
	weights.sort((a, b) => {
		return b.weight - a.weight
	})
	const result = []
	for (const sorted of weights){
		result.push(sorted.item)
	}
	return typeof (limit) == "number" ? result.slice(0, limit) : result
}

module.exports = {
  formatTime: formatTime,
	searchWord: searchWord,
	locations: locations,
	scale: scale,
	bans:bans
}