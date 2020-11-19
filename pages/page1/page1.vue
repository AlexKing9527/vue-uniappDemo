<template>
	<view>
		<view class="uni-btn-v uni-common-mt">
			<button type="primary" @click="sendRequest">发起请求（Callback）</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
			sendRequest() {
				this.api.text1()
			}
		}
	}
</script>

<style lang="less">

</style>
