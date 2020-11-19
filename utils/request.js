const util = require('./util.js');
// 封装post请求
const fetch = (url = '', data = {}, needToken = false, method, loading = true, header = {}) => {
	method = method ? method : 'POST'
	var promise = new Promise((resolve, reject) => {
		if (loading) wx.showLoading({
			title: '加载中'
		});
		if (util.isEmpty(header['content-type'])) {
			header['content-type'] = 'application/x-www-form-urlencoded';
		}
		header['authorization'] = wx.getStorageSync(storage.token);
		//网络请求
		wx.request({
			url: url,
			data: data,
			method: method,
			header: {
				...header
			},
			success: function(res) { // 服务器返回数据
				console.log(`${url}响应`, res.data);
				if (res.statusCode == 200 && res.data.success) {
					if (needToken) app.globalData.isLogin = true;
					resolve(res.data)
				} else if (res.data.code == 403 || res.data.code == 401) { //token失效
					app.globalData.isLogin = false;
					wx.removeStorageSync(storage.token);
					wx.removeStorageSync(storage.user)
					tokenInvalid();
				} else { // 返回错误提示信息
					reject(res.data)
				}
			},
			fail: function(e) {
				util.showModal('', '网络繁忙，请稍后再试');
				reject(e)
			},
			complete: () => {
				if (loading) wx.hideLoading()
			}
		})
	});
	return promise;
}

const request = async function() {
	let [err, res] = await uni.request({
		url: requestUrl,
		dataType: 'text',
		data: {
			noncestr: Date.now()
		}
	});
	if (err) {
		uni.showModal({
			content: err.errMsg,
			showCancel: false
		});
	} else {
		uni.showToast({
			title: '请求成功',
			icon: 'success',
			mask: true,
			duration: duration
		});
		this.res = '请求结果 : ' + JSON.stringify(res);
	}
	this.loading = false;
}

let tokenInvalid = () => {
	wx.showToast({
		title: '会话过期，请重新登录',
		icon: 'none'
	})
	wx.removeStorageSync(storage.user);
	wx.removeStorageSync(storage.token);
	wx.navigateTo({
		url: '/pages/login/select/select?type=tokenInvalid',
	})
}

const upload = function(url = '', data = {}, filePath) {
	wx.showLoading({
		title: '加载中'
	});
	console.log("fordata", {
		...data
	})
	var promise = new Promise((resolve, reject) => {
		wx.uploadFile({
			url: url,
			filePath: filePath,
			name: 'file',
			formData: {
				...data
			},
			header: {
				"content-type": "multipart/form-data"
			},
			success(res) {
				if (res.statusCode == 200 && res.data.success) {
					app.globalData.isLogin = true;
					resolve(res.data)
				} else if (res.data.code == 403 || res.data.code == 401) { //token失效
					app.globalData.isLogin = false;
					tokenInvalid();
				} else { // 返回错误提示信息
					reject(res.data)
				}
			},
			fail(e) {
				util.showModal('', '网络繁忙，请稍后再试');
				reject(e)
			},
			complete() {
				wx.hideLoading()
			}
		})
	})

}

module.exports = {
	request,
	fetch,
	upload
}
