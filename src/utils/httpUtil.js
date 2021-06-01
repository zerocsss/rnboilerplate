import axios from 'axios';
import qs from 'querystring';
import { Platform } from 'react-native';
import Toast from 'react-native-root-toast';
import { getAppMetaData } from 'react-native-get-channel';
import { getVersion } from 'react-native-device-info';
// import CookieManager from '@react-native-community/cookies';
import { storeData, getData } from './AsyncStorage';
import { api, shop_api } from 'config';

axios.defaults.timeout = 50000
axios.interceptors.request.use(
  async config => {
    // 在发送请求之前做些什么
    const { url } = config;
    // console.log('--=-===', config)
    if (url.indexOf('sign_in') < 0) {
      let token = await getData('rrs_token');
      // 商城接口鉴权token
      // delete config.headers["X-Spree-Order-Token"]
      if (url.indexOf('ohio-store-dev') > -1) {
        token = await getData('store_token');
      }
      let channel = Platform.OS === 'android' ? await getAppMetaData('UMENG_CHANNEL') : 'ios_release'; //ios_fir ios_beta
      config.headers.common.Authorization = token;
      config.headers.common.version = getVersion();
      config.headers.common.app_name = 'whs';
      config.headers.common.appchannel = channel;

      if (url.indexOf('buyNow') > -1) {
        let orderToken = await getData('orderToken');
        config.headers.common["X-Spree-Order-Token"] = orderToken;
      }
      // CookieManager.get('changs').then(res => {
      //   console.log('http cookie =>', res);
      //   config.headers.common.Authorization = res.name.value;
      // });
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    console.log(error)
    if (error.code === 'ECONNABORTED') {
      Toast.show('我会瘦：似乎出了点问题~', {
        containerStyle: {
          backgroundColor: "#fff"
        },
        textStyle: {
          fontSize: 12
        },
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        textColor: '#333',
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      // axios.request(originalRequest) // 重新发起请求
      // let currentErrs = await getData('errRequest') || []
      // if (currentErrs.length !== 0 ) {
      //   currentErrs = JSON.parse(currentErrs)
      // }
      // currentErrs.push(originalRequest)
      // storeData('errRequest', JSON.stringify(currentErrs))
    }
    // 对请求错误做些什么
    switch (error.response.status) {
      case 200:
        storeData('lock_user', false);
        break;
      case 422:
        Toast.show(Object.values(error.response.data)[0], {
          containerStyle: {
            width: 200,
          },
          duration: Toast.durations.SHORT,
          position: 0,
          shadow: false,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        break;
      case 400:
        // Toast.show(Object.values(error.response.data)[0], {
        //   containerStyle: {
        //     width: 200,
        //   },
        //   duration: Toast.durations.SHORT,
        //   position: 0,
        //   shadow: false,
        //   animation: true,
        //   hideOnPress: true,
        //   delay: 0,
        // });
        break;
      case 401:
        if (error.response.data.error === 'Your account is locked.') {
          storeData('lock_user', true);
        }
        break;
      case 1002:
        const retryOriginalRequest = new Promise((resolve) => {
          // addSubscriber(() => {
          //   resolve(request(url, options))
          // })
        });
        return retryOriginalRequest;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

let host = api;

export default class httpUtil {


  static get(url, params, isShop) {
    return new Promise(async (resolve, reject) => {
      try {
        let query = await qs.stringify(params);
        let res = null;
        if (isShop) {host = shop_api} else { host = api }
        if (!params) {
          res = await axios.get(host + url);
        } else {
          res = await axios.get(host + url + '?' + query);
        }
        resolve(res);
      } catch (error) {
        const errorMsg = `请求报错路径: ${url} \n请求报错信息: ${error}`;
        console.log(errorMsg);
        reject(error);
      }
    });
  }

  static post(url, params, isShop) {
    return new Promise(async (resolve, reject) => {
      try {
        if (isShop) {host = shop_api} else { host = api }
        let res = await axios.post(host + url, params);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  static put(url, params, isShop) {
    return new Promise(async (resolve, reject) => {
      try {
        if (isShop) {host = shop_api} else { host = api }
        let res = await axios.put(host + url, params);
        resolve(res);
      } catch (error) {
        // const errorMsg = `请求报错路径: ${url} \n请求报错信息: ${error}`;
        // console.log(errorMsg);
        reject(error);
      }
    });
  }

  static delete(url, params, isShop) {
    return new Promise(async (resolve, reject) => {
      try {
        if (isShop) {host = shop_api} else { host = api }
        let res = await axios.delete(host + url, {
          params: params, paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'brackets' })
          }
        });
        resolve(res);
      } catch (error) {
        // const errorMsg = `请求报错路径: ${url} \n请求报错信息: ${error}`;
        // console.log(errorMsg);
        reject(error);
      }
    });
  }

  static patch(url, params, isShop) {
    return new Promise(async (resolve, reject) => {
      try {
        if (isShop) {host = shop_api} else { host = api }
        let res = await axios.patch(host + url, params);
        resolve(res);
      } catch (error) {
        // const errorMsg = `请求报错路径: ${url} \n请求报错信息: ${error}`;
        // console.log(errorMsg);
        reject(error);
      }
    });
  }
}
