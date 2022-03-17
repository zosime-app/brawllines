/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Animated,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SIZES} from '../constants';
import {SwipeListView} from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import {setBookmark, setRead} from '../store/action';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

//상세보기 페이지
const Detail = ({navigation, route}) => {
  console.log('Detail');
  const id = route.params.id;
  const detail = useSelector((state) => state.brawllines)[id];
  const localOptions = useSelector((state) => state.options);
  const language = localOptions.language;
  console.log('language', language);

  const dispatch = useDispatch();
  const scrollX = new Animated.Value(0);
  const skins = detail.skins;
  //----------------------------------------------
  //스킨리스트 생성
  function RenderSkins() {
    const [skinNum, setSkinNum] = useState(0);

    const name = detail.name;
    const type = detail.type;
    const tier = detail.tier;

    useEffect(() => {
      scrollX.event(({value}) => {
        const num = Math.round(value / SIZES.width);
        if (num >= 0) {
          setSkinNum(num);
        }
      });
    });

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor:
            tier == 'Basic'
              ? '#d5f0fe'
              : tier == 'Trophy'
              ? '#d5f0fe'
              : tier == 'Rare'
              ? '#d3fdc6'
              : tier == 'Super Rare'
              ? '#c6e0fd'
              : tier == 'Epic'
              ? '#e9bdfc'
              : tier == 'Mythic'
              ? '#f7c3c8'
              : tier == 'Legendary'
              ? '#fef9bb'
              : tier == 'Chromatic'
              ? '#f7d4b3'
              : '#FFFFFF',
        }}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          scrollEnabled
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}>
          {Object.values(skins).map((skin, key) => (
            <RenderSkin key={key} skin={skin} />
          ))}
        </Animated.ScrollView>
        <View style={{flexDirection: 'row'}}>
          {Object.values(skins).map((skin, key) => (
            <View
              key={key}
              style={{
                width: SIZES.tempSize * 10,
                height: SIZES.tempSize * 10,
                borderRadius: SIZES.tempSize * 4,
                marginHorizontal: SIZES.tempSize * 3,
                marginBottom: SIZES.tempSize * 10,
                backgroundColor: skinNum == key ? '#606060' : '#AAAAAA',
              }}
            />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            left: SIZES.tempSize * 10,
            top: SIZES.tempSize * 10,
            height: SIZES.tempSize * 80,
          }}>
          <Text
            style={{
              fontSize: SIZES.tempSize * 22,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textShadowColor: '#000000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 1,
            }}>
            {name.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: SIZES.tempSize * 18,
              fontWeight: 'bold',
              color: '#C0C0F0',
              textShadowColor: '#000000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 1,
            }}>
            {type.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: SIZES.tempSize * 18,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textShadowColor: '#000000',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 1,
            }}>
            {tier.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }

  //스킨리스트 생성
  function RenderSkin(props) {
    const skinTitle =
      language == 'kor'
        ? props.skin.title.kor
        : props.skin.title.eng.toUpperCase();
    const skinPath = global.imgpath + props.skin.path;

    return (
      <View style={{width: SIZES.width, alignItems: 'center'}}>
        <Image
          source={{uri: skinPath}}
          resizeMode="contain"
          style={{width: '86%', height: '86%'}}
        />
        <Text
          style={{
            fontSize: SIZES.tempSize * 16,
            fontWeight: 'bold',
            color: '#303030',
          }}>
          {skinTitle}
        </Text>
      </View>
    );
  }

  //자막리스트 생성
  function RenderLines(props) {
    const [skinName, setSkinName] = useState(undefined);

    useEffect(() => {
      scrollX.event(({value}) => {
        const num = Math.round(value / SIZES.width);
        if (skinName != skins[num].type) {
          setSkinName(skins[num].type);
        }
      });
    });

    const lines = props.lines;
    const linesAry = Object.values(lines).filter(
      (line) => line.skin == skinName,
    );

    return (
      <SwipeListView
        data={linesAry}
        renderItem={(data, rowMap) => <RenderLine line={data.item} />}
        disableRightSwipe={true}
        renderHiddenItem={(data, rowMap) => <RenderMenu line={data.item} />}
        leftOpenValue={SIZES.tempSize * 40}
        rightOpenValue={SIZES.tempSize * -120}
        stopRightSwipe={SIZES.tempSize * -120}
        // rightOpenValue={SIZES.tempSize * -180}
        // stopRightSwipe={SIZES.tempSize * -180}
        previewRowKey={'0'}
        previewOpenValue={SIZES.tempSize * -20}
        previewOpenDelay={2000}
      />
    );
  }

  //자막 메뉴
  function RenderMenu(props) {
    const lineId = props.line.id;
    const line = props.line.eng;
    //const mean = props.line.kor;
    const soundPath = global.path + props.line.soundPath;

    const locallines = useSelector((state) => state.locallines);
    const localline = locallines[id] ? locallines[id] : null;

    let isBookmark = false;
    if (localline && localline.lines[lineId]) {
      if (localline.lines[lineId].isBookmark) {
        isBookmark = true;
      } else {
        isBookmark = false;
      }
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {/* <TouchableOpacity
          style={{
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: SIZES.tempSize * 60,
            backgroundColor: '#f1c40f',
            right: SIZES.tempSize * 120,
          }}
          onPress={(event) => {
            console.log('DOWN');
          }}>
          <Ionicons
            style={{paddingLeft: SIZES.tempSize * 5}}
            name={'md-download'}
            size={SIZES.tempSize * 32}
            color="#FFFFFF"
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: SIZES.tempSize * 60,
            backgroundColor: '#3498db',
            right: SIZES.tempSize * 60,
          }}
          onPress={(event) => {
            console.log('SHARE');
            let platformName = 'ios';
            if (Platform.OS === 'ios') {
              platformName = 'ios';
            } else {
              platformName = 'android';
              async () => {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
              };
            }
            var dirType = RNFS.DocumentDirectoryPath;
            const fromPath = soundPath;
            const toPath = dirType + '/voicelines.mp3';
            let sharePath = dirType + '/voicelines.mp3';
            if (platformName == 'android') {
              sharePath = `file://${toPath}`;
            }
            RNFS.downloadFile({
              fromUrl: fromPath,
              toFile: toPath,
            }).promise.then((res) => {
              console.log('다운성공');
              const shareOptions = {
                title: String(lineId),
                message: line,
                failOnCancel: false,
                urls: [sharePath], // base64 with mimeType or path to local file
              };
              Share.open(shareOptions)
                .then((res) => {
                  console.log('Share.open', res);
                })
                .catch((err) => {
                  err && console.log('err', err);
                });
            });
          }}>
          <Ionicons
            style={{paddingLeft: 5}}
            name={'md-share'}
            size={SIZES.tempSize * 32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: SIZES.tempSize * 60,
            backgroundColor: '#e74c3c',
            right: 0,
          }}
          onPress={(event) => {
            dispatch(setBookmark(id, lineId));
          }}>
          <Ionicons
            style={{paddingLeft: SIZES.tempSize * 5}}
            name={isBookmark ? 'md-star' : 'md-star-outline'}
            size={SIZES.tempSize * 32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    );
  }

  //자막 텍스트
  function RenderLine(props) {
    const lineId = props.line.id;
    const line = props.line.eng;
    const mean = language == 'off' ? '' : props.line[language];
    const soundPath = global.path + props.line.soundPath;

    const locallines = useSelector((state) => state.locallines);
    const localline = locallines[id] ? locallines[id] : null;
    let isRead = false;
    if (localline && localline.lines[lineId]) {
      if (localline.lines[lineId].isRead) {
        isRead = true;
      } else {
        isRead = false;
      }
    }
    return (
      <View
        style={{
          flex: 1,
          borderWidth: SIZES.tempSize * 1,
          borderColor: '#DDDDDD',
          backgroundColor: '#FFFFFF',
          // height: SIZES.tempSize * 60,
        }}>
        <TouchableOpacity
          onPress={(event) => {
            dispatch(setRead(id, lineId));

            var sound1 = new Sound(soundPath, '', (error, sound) => {
              if (error) {
                alert('error' + error.message);
                return;
              }
              sound1.play(() => {
                sound1.release();
              });
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              // height: SIZES.tempSize * 60,
              alignItems: 'center',
            }}>
            <View
              style={{
                margin: 5,
                height: SIZES.tempSize * 40,
                justifyContent: 'center',
              }}>
              <Ionicons
                name={
                  isRead ? 'chatbubble-ellipses-outline' : 'chatbubble-outline'
                }
                size={SIZES.tempSize * 30}
                color="#505050"
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: SIZES.tempSize * 16,
                  marginLeft: SIZES.tempSize * 6,
                  marginRight: SIZES.tempSize * 4,
                  marginTop: SIZES.tempSize * 6,
                  marginBottom: SIZES.tempSize * 2,
                }}>
                {line}
              </Text>
              {mean ? (
                <Text
                  style={{
                    fontSize: SIZES.tempSize * 16,
                    marginLeft: SIZES.tempSize * 6,
                    marginRight: SIZES.tempSize * 4,
                    marginTop: SIZES.tempSize * 2,
                    marginBottom: SIZES.tempSize * 6,
                  }}>
                  {mean}
                </Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //----------------------------------------------
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flex: 2}}>
        <RenderSkins />
      </View>
      <View style={{flex: 3}}>
        <RenderLines lines={detail.lines} />
      </View>
    </View>
  );
};

export default Detail;
