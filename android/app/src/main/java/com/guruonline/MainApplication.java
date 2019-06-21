package com.guruonline;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.rnziparchive.RNZipArchivePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.tanguyantoine.react.MusicControl;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.eko.RNBackgroundDownloaderPackage;
import com.futurepress.staticserver.FPStaticServerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new RNZipArchivePackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNSoundPackage(),
            new ReactNativeRestartPackage(),
            new OrientationPackage(),
            new MusicControl(),
            new RNFSPackage(),
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFetchBlobPackage(),
            new RNBackgroundDownloaderPackage(),
            new FPStaticServerPackage()
      );
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
  }
}
