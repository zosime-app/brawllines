import React, {useState} from 'react';
import {View, Platform} from 'react-native';
import admob, {
  MaxAdContentRating,
  TestIds,
  BannerAd,
  BannerAdSize,
} from '@react-native-firebase/admob';

export const AddBanner = () => {
  const [isShowBanner, setShowBanner] = useState(false);
  const [isError, setError] = useState(false);

  if (isError) {
    return null;
  }

  admob()
    .setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.G,

      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: true,

      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,
    })
    .then(() => {
      // Request config successfully set!
      setShowBanner(true);
    });

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
    ? global.admobBannerIos
    : global.admobBannerAos;

  if (isShowBanner) {
    return (
      <View style={{backgroundColor: '#FFFFFF'}}>
        <View style={{height: 4}} />
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log('광고불러오기 성공');
          }}
          onAdFailedToLoad={() => {
            console.log('광고불러오기 실패');
            setError(true);
          }}
        />
      </View>
    );
  } else {
    return null;
  }
};
