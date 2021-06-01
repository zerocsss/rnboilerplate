package com.rnboilerplate;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.github.reactnativehero.umengpush.RNTUmengPushModule;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    PackageManager packageManager = this.getPackageManager();
        try {
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(this.getPackageName(), PackageManager.GET_META_DATA);
            // 初始化友盟基础库
            // 第三个参数表示是否显示调试信息
            RNTUmengPushModule.init(this, applicationInfo.metaData, true);
            // RNTUmengAnalyticsModule.init(this, applicationInfo.metaData, false);
            // RNTUmengAnalyticsModule.analytics(this);
            // 初始化友盟推送
            // 第二个参数填 AndroidManifest.xml 中 package 的值
            // 第三个参数表示 app 在前台时是否展现通知
            RNTUmengPushModule.push(this, "xxxx", true);
            // 初始化厂商通道，按需调用
            // RNTUmengPushModule.huawei(this, applicationInfo.metaData);
            // RNTUmengPushModule.xiaomi(this, applicationInfo.metaData);
            // RNTUmengPushModule.oppo(this, applicationInfo.metaData);
            // RNTUmengPushModule.vivo(this, applicationInfo.metaData);
            // RNTUmengPushModule.meizu(this, applicationInfo.metaData);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.rnboilerplate.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
