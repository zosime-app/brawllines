/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SIZES} from '../constants';

const List = ({navigation}) => {
  const brawllines = useSelector((state) => state.brawllines);

  function RenderList(props) {
    const name = props.list.name.toUpperCase();
    const imageURL = global.imgpath + props.list.thumbPath;
    const linesCnt = Object.values(props.list.lines).length;
    const id = props.list.id;
    const imgSize = SIZES.tempSize * 110;
    const conSize = SIZES.tempSize * 120;
    const locallines = useSelector((state) => state.locallines);
    const localline = locallines ? locallines[id] : null;
    const linesReadCnt = localline
      ? Object.values(localline.lines).filter((line) => line.isRead == true)
          .length
      : 0;
    const linesPer = linesReadCnt / linesCnt;

    return (
      <TouchableOpacity
        style={{margin: SIZES.tempSize * 5, marginBottom: SIZES.tempSize * 15}}
        onPress={(event) => {
          props.navigation.navigate('Detail', {id: id});
          // event.stopPropagation();
          // onDetail(id);
        }}>
        <View
          style={{
            width: conSize,
            height: conSize,
            backgroundColor: '#181818',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: imageURL}}
            resizeMode="contain"
            style={{width: imgSize, height: imgSize}}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: SIZES.tempSize * 5,
            top: SIZES.tempSize * 82,
          }}>
          <Text
            style={{
              fontSize: SIZES.tempSize * 15,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textShadowColor: '#000000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 1,
            }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#000000',
            width: conSize,
            height: SIZES.tempSize * 30,
            top: SIZES.tempSize * 100,
          }}>
          <Ionicons
            style={{
              position: 'absolute',
              top: SIZES.tempSize * 5,
              left: SIZES.tempSize * 5,
            }}
            name={'chatbubble-ellipses'}
            size={SIZES.tempSize * 20}
            color="#FFFFFF"
          />
          <View
            style={{
              position: 'absolute',
              marginLeft: SIZES.tempSize * 30,
              marginTop: SIZES.tempSize * 6,
              width: SIZES.tempSize * 85,
              height: SIZES.tempSize * 20,
              backgroundColor: '#5c0033',
            }}
          />
          <View
            style={{
              position: 'absolute',
              marginLeft: SIZES.tempSize * 30,
              marginTop: SIZES.tempSize * 6,
              width: SIZES.tempSize * 85 * linesPer,
              height: SIZES.tempSize * 20,
              backgroundColor: '#ff6cff',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <View
            style={{
              position: 'absolute',
              marginLeft: SIZES.tempSize * 30,
              marginTop: SIZES.tempSize * 6,
              width: SIZES.tempSize * 85,
              height: SIZES.tempSize * 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: SIZES.tempSize * 16,
              }}>
              {linesReadCnt}/{linesCnt}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {Object.values(brawllines)
            .sort((a, b) => {
              return a.order - b.order;
            })
            .map((thum) => (
              <RenderList key={thum.id} list={thum} navigation={navigation} />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default List;
