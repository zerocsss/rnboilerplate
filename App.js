/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {
  ALIAS_TYPE,
  NOTIFICATION_PLAY,
  start,
  getTags,
  addTags,
  removeTags,
  setAlias,
  addAlias,
  removeAlias,
  setAdvanced,
  addListener,
} from '@react-native-hero/umeng-push';

import Navigation from './src/navigation';

const config = {
  isTab: true
}

const App = () => {

  useEffect(() => {
    // 注册获取 device token
    addListener('register', function (data) {
      data.deviceToken;
      // 如果 app 未启动状态下，点击推送打开 app，会有两个新字段
      // 点击的推送
      data.notification;
      // 推送的自定义参数
      // 字符 d、p 为友盟保留字段，不能作为自定义参数的 key，value 只能是字符串类型，
      // 字符总和不能超过 1000 个字符
      data.custom;
    });

    // 远程推送
    addListener('remoteNotification', function (data) {
      // 如果点击了推送，data.clicked 是 true
      data.clicked;
      // 如果推送送达并展示了，data.presented 是 true
      data.presented;

      // 推送详情，如标题、内容
      data.notification;
      // 推送的自定义参数
      // 字符 d、p 为友盟保留字段，不能作为自定义参数的 key，value 只能是字符串类型，
      // 字符总和不能超过 1000 个字符
      data.custom;
    });

    // 启动
    start()
    return () => {
      
    };
  }, []);

  return <Navigation config={config}></Navigation>
};

export default App;
