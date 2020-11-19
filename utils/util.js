function showModal(title, content, confirmText='确认', cancelText='取消', showCancel=false) {
	if (showCancel) {
		uni.showModal({
			title: title,
			content: content,
			confirmText: confirmText,
			cancelText: cancelText
		})
	} else {
		uni.showModal({
			title: title,
			content: content,
			showCancel: false,
			confirmText: confirmText
		})
	}
}

function showToast(title) {
	uni.showToast({
		title: title,
		duration: 2000
	})
}

function showLoading() {
	uni.showToast({
		title: "加载中",
		icon: "loading"
	})
}