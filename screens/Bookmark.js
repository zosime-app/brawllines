/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
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

const Bookmark = ({navigation, route}) => {
  const dispatch = useDispatch();

  //로컬스토리지 저장된 북마크 데이터
  const locallines = useSelector((state) => state.locallines);

  //대사 전체 데이터
  const details = useSelector((state) => state.brawllines);

  const localOptions = useSelector((state) => state.options);
  const language = localOptions.language;

  //북마크 리스트 배열
  const bookmarkAry = [];
  for (const [id, value] of Object.entries(locallines)) {
    let lineAry = [];
    for (const [lineId, line] of Object.entries(value.lines)) {
      if (line.isBookmark) {
        details[id].lines[lineId].name = id;
        lineAry.push(details[id].lines[lineId]);
      }
    }

    //북마크용 배열 생성
    let bookmarkObj = {
      id: id,
      name: details[id].name,
      thumbPath: details[id].thumbPath,
      data: lineAry,
    };
    console.log('bookmarkObj', bookmarkObj);
    if (lineAry.length > 0) {
      bookmarkAry.push(bookmarkObj);
    }
  }

  //자막 텍스트
  function RenderLine(props) {
    const id = props.item.name;
    const lineId = props.item.id;
    const line = props.item.eng;
    // const mean = props.item.kor;
    const mean = language == 'off' ? '' : props.item[language];
    const soundPath = global.path + props.item.soundPath;

    return (
      <View
        style={{
          flex: 1,
          borderWidth: SIZES.tempSize * 1,
          borderColor: '#DDDDDD',
          backgroundColor: '#FFFFFF',
          //height: SIZES.tempSize * 60,
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
              //height: SIZES.tempSize * 60,
              alignItems: 'center',
            }}>
            <View
              style={{
                margin: 5,
                height: SIZES.tempSize * 40,
                justifyContent: 'center',
              }}>
              <Ionicons
                name={'chatbubble-ellipses-outline'}
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

  function RenderMenu(props) {
    const id = props.item.name;
    // const mean = props.item.kor;
    const lineId = props.item.id;
    const line = props.item.eng;
    const soundPath = global.path + props.item.soundPath;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
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
            //dispatch(setBookmark(id, lineId));
            dispatch(setBookmark(id, lineId));
          }}>
          <Ionicons
            style={{paddingLeft: SIZES.tempSize * 5}}
            name={'md-star'}
            size={SIZES.tempSize * 32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    );
  }
  function renderSection(props) {
    var name = props.section.name;
    var thumbPath = global.imgpath + props.section.thumbPath;
    var lineCnt = props.section.data.length;
    return lineCnt ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <View style={{width: 50, height: 50, margin: 4}}>
          <Image
            source={{uri: thumbPath}}
            resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View>
          <Text
            style={{
              width: 300,
              fontWeight: 'bold',
              fontSize: SIZES.tempSize * 24,
              marginLeft: SIZES.tempSize * 4,
            }}>
            {name.toUpperCase()}
          </Text>
        </View>
      </View>
    ) : null;
  }

  const [listData, setListData] = useState(
    Array(5)
      .fill('')
      .map((_, i) => ({
        title: `title${i + 1}`,
        data: [
          ...Array(5)
            .fill('')
            .map((_, j) => ({
              key: `${i}.${j}`,
              text: `item #${j}`,
            })),
        ],
      })),
  );
  if (!bookmarkAry || bookmarkAry.length == 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            color: '#505050',
            fontWeight: 'bold',
            fontSize: SIZES.tempSize * 20,
          }}>
          Bookmark the lines.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <SwipeListView
          recalculateHiddenLayout={true}
          useSectionList
          sections={bookmarkAry}
          renderItem={RenderLine}
          renderSectionHeader={renderSection}
          renderHiddenItem={RenderMenu}
          disableRightSwipe={true}
          leftOpenValue={SIZES.tempSize * 40}
          rightOpenValue={SIZES.tempSize * -120}
          stopRightSwipe={SIZES.tempSize * -120}
          previewRowKey={'0'}
          previewOpenValue={SIZES.tempSize * -20}
          previewOpenDelay={2000}
        />
      </View>
    );
  }
};

export default Bookmark;
