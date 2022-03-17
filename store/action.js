import {
  LOAD_SETTINGS_LIST,
  LOAD_BRAWLLINES,
  LOAD_LOCALSETTINGS,
  LOAD_LOCALLINES,
  APP_LOAD_COMPLETE,
  SET_READ,
  SET_BOOKMARK,
  SET_MUSIC,
  SET_TRANSLATE,
  SET_MUTE,
} from './actionType';

//----------------------------
//앱 정보 불러오기
//----------------------------
export const appLoadComplete = () => ({
  type: APP_LOAD_COMPLETE,
});

//-----------------------
//웹정보 불러오기
//-----------------------
export const onLoadBrawlLines = (list) => ({
  type: LOAD_BRAWLLINES,
  list,
});
export const onLoadSettingsList = (list) => ({
  type: LOAD_SETTINGS_LIST,
  list,
});

//-----------------------
//로컬정보 불러오기
//-----------------------
export const onLoadLocalLines = (list) => ({
  type: LOAD_LOCALLINES,
  list,
});
export const onLoadLocalSettings = (opt) => ({
  type: LOAD_LOCALSETTINGS,
  opt,
});
//------------------------------------
//대사 듣기
export const setRead = (brawlerID, lineID) => ({
  type: SET_READ,
  brawlerID,
  lineID,
});

//북마크
export const setBookmark = (brawlerID, lineID) => ({
  type: SET_BOOKMARK,
  brawlerID,
  lineID,
});

//번역
export const setTranslate = (translateNum, language) => ({
  type: SET_TRANSLATE,
  translateNum,
  language,
});

//사운드
export const setMusic = (playMusicNum, path) => ({
  type: SET_MUSIC,
  playMusicNum,
  path,
});

//사운드 - mute
export const setMute = (mute) => ({
  type: SET_MUTE,
  mute,
});
