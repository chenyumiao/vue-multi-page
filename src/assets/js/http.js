/**
 * Created by chenyumiao on 2018/4/16.
 */
import axios from 'axios'
import qs from 'qs'

let axiosIns = axios.create({});
/*axiosIns.defaults.baseURL = baseURL*/
axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
axiosIns.defaults.transformRequest = [function (data) {
  //数据序列化
  return qs.stringify(data);
}
];
axiosIns.defaults.validateStatus = function (status) {
  return true;
};
axiosIns.interceptors.request.use(config=> {
  //配置config
  config.headers.Accept = 'application/json';
  return config;
},err => {
  return Promise.reject(err)
});
axiosIns.interceptors.response.use(response =>{
  let data = response.data;
  let status = response.status;
  if (status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
},err => {
  return Promise.reject(err,response.data)
});

let axiosMethod = ['get', 'post'];
let http = {};
axiosMethod.forEach((method)=> {
  //数组取值的两种方式
  http[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
      axiosIns[method](uri, data, config).then((response)=> {
          resolve(response);
      }).catch((response)=> {
        reject(response)
      })
    })
  }
});

export default http
