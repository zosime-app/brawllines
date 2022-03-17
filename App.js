/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useEffect} from 'react';
import {Animated, Easing, Image, View, Text, SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Provider, useDispatch, useSelector} from 'react-redux';
// Screens
import {
  List,
  Detail,
  Bookmark,
  Settings,
  Animations,
  Games,
  FlappyCrow,
  FlappyBrawler,
} from './screens';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {store} from './store/store';

import {COLORS, FONTS} from './constants';
import {
  appLoadComplete,
  onLoadBrawlLines,
  onLoadSettingsList,
  onLoadLocalLines,
  onLoadLocalSettings,
} from './store/action';
import {AddBanner} from './components/AdMob';
import AsyncStorage from '@react-native-async-storage/async-storage';

//npm audit fix --force//
// $ cd android
// $ ./gradlew bundleRelease
// $ react-native run-android --variant=release
// $ react-native run-android --variant=debug

//cd android && ./gradlew bundleRelease
//cd android && ./gradlew assembleRelease

//캐시삭제(yarn)
// watchman watch-del-all &&
// rm -rf $TMPDIR/react-native-packager-cache-* &&
// rm -rf $TMPDIR/metro-bundler-cache-* &&
// rm -rf node_modules/ &&
// yarn cache clean &&
// yarn install &&
// yarn start -- --reset-cache



const Stack = createStackNavigator();
//리스트스크린
const ListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={List}
        options={({navigation}) => ({
          title: 'Brawlers',
          headerLeft: () => (
            <Ionicons
              name={'md-menu'}
              size={32}
              style={{marginLeft: 20}}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={({navigation}) => ({
          title: 'Voice lines',
          headerLeft: () => (
            <Ionicons
              name={'md-arrow-back'}
              size={24}
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
//북마크 스크린
const BookmarkStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bookmark"
        component={Bookmark}
        options={({navigation}) => ({
          title: 'Bookmark',
          headerLeft: () => (
            <Ionicons
              name={'md-menu'}
              size={34}
              style={{marginLeft: 20}}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
//세팅 스크린
const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={Settings}
        options={({navigation}) => ({
          title: 'Settings',
          headerLeft: () => (
            <Ionicons
              name={'md-menu'}
              size={34}
              style={{marginLeft: 20}}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
//애니메이션 스크린
const AnimationsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Animations"
        component={Animations}
        options={({navigation}) => ({
          title: 'Animations',
          headerLeft: () => (
            <Ionicons
              name={'md-menu'}
              size={34}
              style={{marginLeft: 20}}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

//애니메이션 스크린
const GamesStack = () => {
  return (
    <Stack.Navigator initialRouteName="Games">
      <Stack.Screen
        name="Games"
        component={Games}
        options={({navigation}) => ({
          title: 'Games',
          headerLeft: () => (
            <Ionicons
              name={'md-menu'}
              size={34}
              style={{marginLeft: 20}}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="FlappyCrow"
        component={FlappyCrow}
        options={({navigation}) => ({
          title: 'Flappy Crow',
          headerLeft: () => (
            <Ionicons
              name={'md-arrow-back'}
              size={24}
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="FlappyBrawler"
        component={FlappyBrawler}
        options={({navigation}) => ({
          title: 'Flappy Brawler',
          headerLeft: () => (
            <Ionicons
              name={'md-arrow-back'}
              size={24}
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const SetContainer = () => {
  const isLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();
  const temp = Math.random();
  useEffect(() => {
    //==============================================
    //설정 정보
    //global.path + '/brawllines/setting.json'
    //global.path + '/brawllines/brawler.json'
    //==============================================
    fetch(`${global.path}/brawllines/setting.json?${temp}`)
      .then((response) => response.json())
      .then((json) => {
        // console.log("###setting.json 호출완료")
        dispatch(onLoadSettingsList(json));
      })
      .catch((error) => console.log(error))
      .finally(
        () =>
          //==============================================
          //대사 정보, 로컬 정보
          //==============================================
          fetch(`${global.path}/brawllines/brawler.json?${temp}`)
            .then((response) => response.json())
            .then((json) => {
              // console.log("###brawler.json 호출완료")
              dispatch(onLoadBrawlLines(json));
            })
            .catch((error) => console.error(error))
            .finally(() =>
              AsyncStorage.getItem('settings').then((value) => {
                let opt = JSON.parse(value);
                if (!opt) {
                  opt = {
                    isPlayMusic: true,
                    playMusicNum: 1,
                    translateNum: 0,
                    language: 'off',
                  };
                }
                dispatch(onLoadLocalSettings(opt));

                AsyncStorage.getItem('localList').then((value) => {
                  const localList = JSON.parse(value);
                  dispatch(onLoadLocalLines(localList));
                  dispatch(appLoadComplete());
                });
              }),
            ),
        //==============================================
      );
  }, []);

  return isLoading ? (
    <RenderLoading />
  ) : (
    <View style={{width: '100%', height: '100%'}}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Brawlers">
          <Drawer.Screen name="Brawlers" component={ListStack} />
          <Drawer.Screen name="Bookmark" component={BookmarkStack} />
          <Drawer.Screen name="Games" component={GamesStack} />
          <Drawer.Screen name="Animations" component={AnimationsStack} />
          <Drawer.Screen name="Settings" component={SettingsStack} />
        </Drawer.Navigator>
      </NavigationContainer>
      <AddBanner />
    </View>
  );
};

const RenderLoading = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    {iterations: -1},
  ).start(() => console.log('LOOP'));
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View>
        <Animated.Image
          source={require('./assets/images/LoadingStar.png')}
          resizeMode="contain"
          style={{width: 350, height: 350, transform: [{rotate: spin}]}}
        />
        <Image
          source={require('./assets/images/LoadingSimbol.png')}
          resizeMode="contain"
          style={{width: 350, height: 350, position: 'absolute'}}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={{color: COLORS.black, ...FONTS.largeTitle}}>
          BRAWL LINES
        </Text>
        <Text style={{color: COLORS.black, ...FONTS.h1}}>
          Brawl Stars voice lines
        </Text>
      </View>
    </View>
  );
};

const App = () => {
  // return (
  //   <Provider store={store}>
  //     <SetContainer />
  //   </Provider>
  // );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Provider store={store}>
        <SetContainer />
      </Provider>
    </SafeAreaView>
  );
};

export default App;
