/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import entities from '../components/flappycrow/entities';
import Physics from '../components/flappycrow/physics';
import {SIZES} from '../constants';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

let jumpSnd = new Sound(require('../assets/sounds/ll_atk_01.mp3'));
let deadSnd = new Sound(require('../assets/sounds/ll_die_01.mp3'));

const stopJump = () => {
  // jumpSnd.release();
  // deadSnd.release();
  // if (this.sound) {
  //   this.sound.release();
  // }
};

const playDead = () => {
  stopJump();
  deadSnd.play();
};
const playJump = () => {
  stopJump();
  jumpSnd.play();
};

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? global.admobIntIos
  : global.admobIntAos;

//const adUnitId = 'ca-app-pub-5724904727720223/7089313102';

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

let adCount = 3;
let bestPoints = 0;

const getBestPoint = () => {
  AsyncStorage.getItem('flappyCrow_point').then((value) => {
    var point = parseInt(value);
    if (point > 0) {
      bestPoints = point;
    }
  });
};
const setBestPoint = () => {
  AsyncStorage.setItem('flappyCrow_point', String(bestPoints));
};

const FlappyCrow = ({navigation}) => {
  getBestPoint();
  stopJump();
  //const [adCount, setAdCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const eventListener = interstitialAd.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
      }
    });
    interstitialAd.load();
    return () => {
      eventListener();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <Image
        source={require('../assets/images/flappyCrowBg.png')}
        resizeMode="cover"
        style={{
          opacity: 0.9,
          width: SIZES.width,
          height: SIZES.height,
          position: 'absolute',
        }}
      />
      <GameEngine
        ref={(ref) => {
          setGameEngine(ref);
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={(e) => {
          switch (e.type) {
            case 'touch':
              playJump();
              break;
            case 'game_over':
              if (currentPoints > bestPoints) {
                bestPoints = currentPoints;
                setBestPoint();
              }
              playDead();
              setRunning(false);
              setGameOver(true);
              gameEngine.stop();
              break;
            case 'new_point':
              setCurrentPoints(currentPoints + 1);
              break;
          }
        }}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      />
      <Text
        style={{
          position: 'absolute',
          width: '80%',
          fontSize: SIZES.tempSize * 50,
          fontWeight: 'bold',
          margin: SIZES.tempSize * 30,
          textAlign: 'center',
        }}>
        {currentPoints}
      </Text>
      {!running ? (
        !gameOver ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'black',
                paddingHorizontal: SIZES.tempSize * 30,
                paddingVertical: SIZES.tempSize * 10,
              }}
              onPress={() => {
                interstitialAd.load();
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: SIZES.tempSize * 30,
                }}>
                START GAME
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              //opacity: 0.2,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'black',
                paddingHorizontal: SIZES.tempSize * 30,
                paddingVertical: SIZES.tempSize * 10,
                alignItems: 'center',
              }}
              onPress={() => {
                if (loaded) {
                  adCount++;
                  if (adCount < 5) {
                    setGameOver(false);
                  } else {
                    adCount = 0;
                    interstitialAd.show();
                    setGameOver(false);
                  }
                } else {
                  setGameOver(false);
                }
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: SIZES.tempSize * 30,
                  marginBottom: 20,
                }}>
                GAME OVER
              </Text>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: SIZES.tempSize * 20}}>
                  Score
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: SIZES.tempSize * 30,
                  }}>
                  {currentPoints}
                </Text>
              </View>
              <View style={{marginTop: 10, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: SIZES.tempSize * 20}}>
                  Best
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: SIZES.tempSize * 30,
                  }}>
                  {bestPoints}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      ) : null}
    </View>
  );
};

export default FlappyCrow;
