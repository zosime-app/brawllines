import AsyncStorage from '@react-native-async-storage/async-storage';
import {onLoadBrawlLines} from './action';
import Sound from 'react-native-sound';

import {
  APP_LOAD_COMPLETE,
  LOAD_SETTINGS_LIST,
  LOAD_BRAWLLINES,
  LOAD_LOCALSETTINGS,
  LOAD_LOCALLINES,
  SET_READ,
  SET_BOOKMARK,
  SET_TRANSLATE,
  SET_MUSIC,
  SET_MUTE,
} from './actionType';
import {useCallback} from 'react';

const init = {
  counter: 0,
  isLoading: true,
  brawllines: null, //웹 json대사 정보
  locallines: {}, //대사기능 로컬 저장
  settingsList: {}, //웹 json설정 정보
  options: null, //설정 로컬 저장
};

const isShowLog = true;
const showLog = (name, value) => {
  if (!isShowLog) {
    return;
  }
  console.log('\n\n');
  console.log(name, value);
};

//설정 저장
const saveSettings = async (value) => {
  try {
    await AsyncStorage.setItem('settings', JSON.stringify(value));
  } catch (e) {}
};

//로컬데이터(북마크, 듣기대사) 저장
const saveStorage = async (value) => {
  try {
    await AsyncStorage.setItem('localList', JSON.stringify(value));
  } catch (e) {}
};

//초기화
const clearStorage = () => {
  AsyncStorage.clear();
};
//BGM재생 = 기본사운드 로컬재생 수정 > 트래픽 용량 감소
const playBGM = (path) => {
  stopBgm();
  if (path == '') {
    return;
  }
  const callback = (error) => {
    if (error) {
      alert('error' + error.message);
      return;
    }
    this.sound.setVolume(0.5);
    this.sound.setNumberOfLoops(-1);
    this.sound.play();
  };
  const localPath = require('../assets/sounds/brawl_stars_menu_01.mp3');
  const bgmPath = global.path + path;
  Sound.setCategory('Playback');
  if (path == '/brawllines/sounds/brawl_stars_menu_01.mp3') {
    this.sound = new Sound(localPath, (error) => callback(error));
  } else {
    this.sound = new Sound(bgmPath, '', (error) => {
      if (error) {
        alert('error' + error.message);
        return;
      }
      this.sound.setVolume(0.3);
      this.sound.setNumberOfLoops(-1);
      this.sound.play();
    });
  }
};

// const playBGM = (path) => {
//   stopBgm();
//   if (path == '') {
//     return;
//   }
//   console.log('BGM재생');
//   // const bgmPath = global.path + path;
//   const bgmPath = require('../assets/sounds/brawl_stars_menu_01.mp3');
//   Sound.setCategory('Playback');
//   this.sound = new Sound(bgmPath, '', (error) => {
//     if (error) {
//       alert('error' + error.message);
//       return;
//     }
//     this.sound.setVolume(0.3);
//     this.sound.setNumberOfLoops(-1);
//     this.sound.play();
//   });
// };

const stopBgm = () => {
  if (this.sound) {
    this.sound.release();
  }
};

const pauseBgm = () => {
  console.log('pauseBgm');
  if (this.sound) {
    this.sound.pause();
  }
};

const resumeBgm = () => {
  console.log('resumeBgm');
  if (this.sound) {
    this.sound.play();
  }
};

export const mainReducer = (state = init, action) => {
  switch (action.type) {
    case APP_LOAD_COMPLETE:
      return {...state, isLoading: false};
    case LOAD_BRAWLLINES:
      // showLog('reducers] LOAD_BRAWLLINES:', action.list);
      return {...state, brawllines: action.list};
    case LOAD_SETTINGS_LIST:
      // showLog('reducers] LOAD_SETTINGS_LIST:', action.list);
      return {...state, settingsList: action.list};
    case LOAD_LOCALLINES:
      if (action.list) {
        return {...state, locallines: action.list};
      } else {
        return {...state, locallines: {}};
      }
    //로컬 설정 정보 불러옴=============================================
    case LOAD_LOCALSETTINGS:
      const bgmPath = state.settingsList.music[action.opt.playMusicNum].path;
      playBGM(bgmPath);
      return {...state, options: action.opt};
    case SET_MUSIC:
      playBGM(action.path);
      const soundOpt = {
        ...state,
        options: {
          ...state.options,
          playMusicNum: action.playMusicNum,
        },
      };
      saveSettings(soundOpt.options);
      return soundOpt;
    case SET_MUTE:
      if (action.mute) {
        pauseBgm();
      } else {
        resumeBgm();
      }
      console.log('SET_MUTE', state);
      return state;
    case SET_TRANSLATE:
      const translateOpt = {
        ...state,
        options: {
          ...state.options,
          translateNum: action.translateNum,
          language: action.language,
        },
      };
      saveSettings(translateOpt.options);
      return translateOpt;
    case SET_BOOKMARK:
      let bookmark = true;
      if (!state.locallines[action.brawlerID]) {
        state.locallines[action.brawlerID] = {lines: {}};
      } else {
        if (
          state.locallines[action.brawlerID].lines[action.lineID] &&
          state.locallines[action.brawlerID].lines[action.lineID].isBookmark
        ) {
          bookmark = false;
        }
      }
      const newBookmark = {
        ...state,
        locallines: {
          ...state.locallines,
          [action.brawlerID]: {
            ...state.locallines[action.brawlerID],
            lines: {
              ...state.locallines[action.brawlerID].lines,
              [action.lineID]: {
                ...state.locallines[action.brawlerID].lines[action.lineID],
                isBookmark: bookmark,
              },
            },
          },
        },
      };
      saveStorage(newBookmark.locallines);
      return newBookmark;
    case SET_READ:
      if (!state.locallines[action.brawlerID]) {
        state.locallines[action.brawlerID] = {lines: {}};
      }
      const newLines = {
        ...state,
        locallines: {
          ...state.locallines,
          [action.brawlerID]: {
            ...state.locallines[action.brawlerID],
            lines: {
              ...state.locallines[action.brawlerID].lines,
              [action.lineID]: {
                ...state.locallines[action.brawlerID].lines[action.lineID],
                isRead: true,
              },
            },
          },
        },
      };
      saveStorage(newLines.locallines);
      return newLines;
    default:
      return state;
  }
};
