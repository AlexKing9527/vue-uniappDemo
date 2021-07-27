import Vue from 'vue'

const BASE_URL = 'http://192.168.116.87:9006/msht-api';

if (process.env.NODE_ENV === 'development') {

  // #ifdef H5
  Vue.prototype.apiUrl = '';
  // #endif

  // #ifndef H5
  Vue.prototype.apiUrl = BASE_URL;
  // #endif

} else {
  Vue.prototype.apiUrl = BASE_URL;
}

function setDefaultObj(options) {

  // default show loading icon
  if (options.loading === undefined) {
    options.loading = true;
  }

  // default method is get
  if (!options.method) options.method = 'GET'

  // send formdata 发送文件不能写
  if (options.formData && !options.datafilePath) {
    options.header = {
      ...options.header,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  // deault data
  if (!options.data) options.data = {}

  // token data
  if (!options.data.token) {
    // options.data.token = uni.getStorageSync('token') || '';
  }

  // params
  if (options.params && Object.prototype.toString.call(options.params) === '[object Object]') {
    const paramsString = _jsonToSerialize(options.params);
    const s = options.url.indexOf('?') <= 0 ? '?' : '&';
    options.url += s + paramsString;
  }
}

Vue.prototype.request = function(options) {
  let _res, _rej;
  let _promise = new Promise((res, rej) => {
    _res = res;
    _rej = rej;
  });

  setDefaultObj(options);
  if (options.loading) {
    uni.showLoading({
      title: '加载中'
    });
  }

  let url = options.url;
  if (!options.url.match(/^https?:\/\//)) {
    url = _join(this.apiUrl, options.url);
  }

  if (options.filePath) {
    // 传文件
    // https://www.kancloud.cn/guobaoguo/uni-app/821793
    const uploadTask = uni.uploadFile({
      url: url,
      filePath: options.filePath,
      name: options.name,
      formData: options.data,
      header: options.header,
      success: res => {
        if (options.loading) uni.hideLoading();
        const data = JSON.parse(res.data);
        if (typeof options.success == "function")
          options.success(data);
        _res(data);
      },
      fail: res => {
        if (options.loading) uni.hideLoading();
        const data = { ...res,
          data: JSON.parse(res.data)
        };
        if (typeof options.fail == "function") options.fail(data);
        _rej(data);
      }
    });
  } else {
    uni.request({
      url: url,
      data: options.data,
      method: options.method,
      header: options.header,
      success: res => {
        if (options.loading) uni.hideLoading();
        if (typeof options.success == "function") options.success(res.data);
        _res(res.data);
      },
      fail: res => {
        if (options.loading) uni.hideLoading();
        if (typeof options.fail == "function") options.fail(res);
        _rej(res)
      }
    });
  }
  return _promise;
}

Vue.prototype.postHttp = function(options) {
  return this.request({
    ...options,
    method: 'POST',
    formData: options.formData === false || options.filePath ? false : true,
  });
}


function _join(a_url, b_url) {
  return a_url.replace(/\/+$/, "") + "/" + b_url.replace(/^\/+/, "")
}

function _jsonToSerialize(o) {
  let s = '';
  for (let k in o) {
    let v = o[k];
    let vTag = Object.prototype.toString.call(v);
    if (vTag === '[object Array]') {
      for (let i of v) {
        s += `${k}=${encodeURIComponent(i)}&`
      }
    } else if (vTag === '[object Object]') {
      s += `${k}=${encodeURIComponent(JSON.stringify(v))}&`
    } else {
      s += `${k}=${encodeURIComponent(v)}&`
    }
  }
  return s.replace(/&$/, '');
}

export default {
  BASE_URL: BASE_URL,
  apiUrl: Vue.prototype.apiUrl,
  request: Vue.prototype.request.bind(Vue.prototype),
  postHttp: Vue.prototype.postHttp.bind(Vue.prototype),
}