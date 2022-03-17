/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SIZES} from '../constants';
import YouTube, {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from 'react-native-youtube';
import {setMute} from '../store/action';

const Animations = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState('');
  const [videId, setVideoId] = useState('');
  const YOUTUBE_API_KEY = global.youtubeKey;
  function getPlayList(listId) {
    const url = global.youtubeUrl;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("you", json);
        setIsLoading(false);
        if (Platform.OS === 'ios') {
          setVideoId(json.items[0].contentDetails.videoId);
        }
        // setVideoId(json.items[0].contentDetails.videoId);
        setList(json);
      });
  }

  function RenderVideo() {
    // let videoId = useState
    const [skinNum, setSkinNum] = useState(0);
    const videoW = SIZES.tempSize * 400;
    const videH = SIZES.tempSize * 226;
    if (Platform.OS === 'ios') {
      return (
        <YouTube
          apiKey={YOUTUBE_API_KEY}
          videoId={videId} // The YouTube video ID
          autoPlay={true}
          play // control playback of video with true/false
          inline // control whether the video should play in fullscreen or inline
          ended // control whether the video should loop when ended
          // onReady={(e) => this.setState({isReady: true})}
          // onChangeState={(e) => this.setState({status: e.state})}
          // onChangeQuality={(e) => this.setState({quality: e.quality})}
          // onError={(e) => this.setState({error: e.error})}
          style={{alignSelf: 'stretch', width: videoW, height: videH}}
        />
      );
    } else {
      return YouTubeStandaloneAndroid.playVideo({
        apiKey: YOUTUBE_API_KEY, // Your YouTube Developer API Key
        videoId: videId, // YouTube video ID
        autoplay: false, // Autoplay the video
        fullscreen: false,
        // startTime: 120, // Starting point of video (in seconds)
      })
        .then(() => console.log('Standalone Player Exited'))
        .catch((errorMessage) => console.error(errorMessage));
    }

    // if (Platform.OS === 'ios') {
    //   return (
    //     <YouTube
    //       videoId={videId} // The YouTube video ID
    //       play // control playback of video with true/false
    //       inline // control whether the video should play in fullscreen or inline
    //       ended // control whether the video should loop when ended
    //       // onReady={(e) => this.setState({isReady: true})}
    //       // onChangeState={(e) => this.setState({status: e.state})}
    //       // onChangeQuality={(e) => this.setState({quality: e.quality})}
    //       // onError={(e) => this.setState({error: e.error})}
    //       style={{alignSelf: 'stretch', width: videoW, height: videH}}
    //     />
    //   );
    // } else {
    //   YouTubeStandaloneAndroid.playVideo({
    //     apiKey: YOUTUBE_API_KEY, // Your YouTube Developer API Key
    //     videoId: videId, // YouTube video ID
    //     autoplay: true, // Autoplay the video
    //     fullscreen: false,
    //     // startTime: 120, // Starting point of video (in seconds)
    //   })
    //     .then(() => console.log('Standalone Player Exited'))
    //     .catch((errorMessage) => console.error(errorMessage));
    // }
  }

  function RenderList(props) {
    const title = props.item.snippet.title;
    const imageURL = props.item.snippet.thumbnails.high.url;
    const movId = props.item.contentDetails.videoId;

    const conSizeW = SIZES.tempSize * 400;
    const conSizeH = SIZES.tempSize * 80;
    const imgSizeW = SIZES.tempSize * 150;
    const imgSizeH = SIZES.tempSize * 80;
    const textSizeW = SIZES.tempSize * 220;
    return (
      <TouchableOpacity
        style={{width: conSizeW, height: conSizeH, backgroundColor: '#FFFFFF'}}
        onPress={(event) => {
          if (Platform.OS === 'ios') {
            setVideoId(movId);
          } else {
            dispatch(setMute(true));
            YouTubeStandaloneAndroid.playVideo({
              apiKey: YOUTUBE_API_KEY, // Your YouTube Developer API Key
              videoId: movId, // YouTube video ID
              autoplay: true, // Autoplay the video
            })
              .then(() => {
                console.log('Standalone Player Exited');
                dispatch(setMute(false));
              })
              .catch((errorMessage) => console.error(errorMessage));
          }
        }}>
        <View
          style={{
            margin: 4,
            // backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <Image
            source={{uri: imageURL}}
            style={{width: imgSizeW, height: imgSizeH}}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              color: '#181818',
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return list ? (
    Platform.OS === 'ios' ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <RenderVideo />
        <ScrollView>
          {Object.values(list.items).map((item) => (
            <RenderList key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    ) : (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ScrollView>
          {Object.values(list.items).map((item) => (
            <RenderList key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    )
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {getPlayList('PLTBLax1DE162xe0IH3wBZFSUkigtAVk_d')}
      <Text>LOADING</Text>
    </View>
  );
};

export default Animations;
