/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {SIZES} from '../constants';

const Games = ({navigation}) => {
  const [bestPoints, setBestPoints] = useState(0);
  useEffect(() => {
    AsyncStorage.getItem('flappyCrow_point').then((value) => {
      var point = parseInt(value);
      if (point > 0) {
        setBestPoints(point);
      }
    });
  });
  return (
    <ScrollView>
      <View>
        <Text style={styles.textTitle}>FlappyCrow</Text>
        <TouchableOpacity
          style={[styles.gameBtn]}
          onPress={(event) => {
            navigation.navigate('FlappyCrow');
          }}>
          <Image
            source={require('../assets/images/flappyCrowBanner.png')}
            resizeMode="stretch"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <Text
            style={{
              position: 'absolute',
              fontWeight: 'bold',
              fontSize: SIZES.tempSize * 30,
              top: SIZES.tempSize * 80,
              left: SIZES.tempSize * 10,
              color: '#202020',
            }}>
            BEST : {bestPoints}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    marginTop: SIZES.tempSize * 15,
    marginBottom: SIZES.tempSize * -10,
    marginLeft: SIZES.tempSize * 10,
    color: '#505050',
    fontWeight: 'bold',
    fontSize: SIZES.tempSize * 30,
  },
  gameBtn: {
    margin: SIZES.width * 0.02,
    width: SIZES.width * 0.96,
    height: SIZES.height * 0.2,
  },
});

export default Games;
