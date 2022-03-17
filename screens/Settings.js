import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SIZES} from '../constants';
import {setTranslate, setMusic} from '../store/action';
import Rate, {AndroidMarket} from 'react-native-rate';

const Settings = ({navigation, route}) => {
  const dispatch = useDispatch();
  const settingsList = useSelector((state) => state.settingsList);
  const musicList = settingsList.music;
  const translateList = settingsList.translate;
  const localOptions = useSelector((state) => state.options);

  // console.log('settingList-music', settingsList.music);
  // console.log('settingList-translate', settingsList.translate);
  // console.log('Settings> localOptions', localOptions);

  function RenderMusic() {
    //const [musicNum, setMusicNum] = useState(0);

    return (
      <View style={styles.viewRender}>
        <Text style={styles.textTitle}>MUSIC</Text>
        <View style={styles.viewContainer}>
          {Object.values(musicList).map((item, key) => (
            <TouchableOpacity
              key={key}
              style={
                localOptions.playMusicNum == item.id
                  ? styles.viewBtnOn
                  : styles.viewBtn
              }
              onPress={(event) => {
                console.log('path', item.path);
                dispatch(setMusic(key, item.path));
              }}>
              <Text style={styles.textBtn}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
  function RenderTranslate() {
    //const [translateNum, setTranslateNum] = useState(0);

    return (
      <View style={styles.viewRender}>
        <View style={{alignItems: 'flex-end', flexDirection:'row'}}>
          <Text style={styles.textTitle}>TRANSLATE</Text>
          <Text style={styles.textSubTitle}>(USE GOOGLE TRANSLATE)</Text>
        </View>
        <View style={styles.viewContainer}>
          {Object.values(translateList).map((item, key) => (
            <TouchableOpacity
              key={key}
              style={
                localOptions.translateNum == item.id
                  ? styles.viewBtnOn
                  : styles.viewBtn
              }
              onPress={(event) => {
                dispatch(setTranslate(key, item.language));
              }}>
              <Text style={styles.textBtn}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function RenderRate() {
    return (
      <View style={styles.viewRender}>
        <Text style={styles.textTitle}>RATE</Text>
        <View style={styles.viewRateContainer}>
          <TouchableOpacity
            style={styles.viewRateBtn}
            onPress={() => {
              const options = {
                AppleAppID: '1579432491',
                GooglePackageName: 'me.zosime.brawllines',
                preferredAndroidMarket: AndroidMarket.Google,
              };
              Rate.rate(options, (success) => {
                console.log('success', success);
              });
            }}>
            {Platform.OS === 'ios' ? (
              <Text style={styles.textBtn}>APPLE STORE</Text>
            ) : (
              <Text style={styles.textBtn}>GOOGLE MARKET</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView>
      <RenderMusic />
      <RenderTranslate />
      <RenderRate />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textSubTitle: {
    marginLeft: SIZES.tempSize * 8,
    color: '#505050',
    fontWeight: 'bold',
    fontSize: SIZES.tempSize * 16,
  },
  textTitle: {
    marginLeft: SIZES.tempSize * 10,
    color: '#505050',
    fontWeight: 'bold',
    fontSize: SIZES.tempSize * 22,
  },
  viewRender: {
    marginTop: 20,
  },
  viewRateContainer: {
    marginLeft: SIZES.tempSize * 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewRateBtn: {
    width: SIZES.tempSize * 220,
    height: SIZES.tempSize * 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5396fa',
    margin: SIZES.tempSize * 5,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: SIZES.tempSize * 5,
    // justifyContent: 'center',
  },
  viewBtn: {
    width: SIZES.tempSize * 120,
    height: SIZES.tempSize * 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5396fa',
    margin: SIZES.tempSize * 5,
  },
  viewBtnOn: {
    width: SIZES.tempSize * 120,
    height: SIZES.tempSize * 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    margin: SIZES.tempSize * 5,
  },
  textBtn: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: SIZES.tempSize * 14,
    margin: 1,
  },
});

export default Settings;
