import {SIZES} from '../../../constants';

export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
export const getPipeSizePosPair = (addToPosX = 0) => { //시작점 0~100
  let yPosTop = (getRandom(0, 50) - 10) / 100; //-0.1 ~ 0.4 랜덤값
  const pipeTop = {
    pos: {
      x: SIZES.screenWidth * (addToPosX / 100),
      y: -SIZES.screenHeight * yPosTop, //SIZES.screenHeight * 0.5,
    },
    size: {
      width: SIZES.screenWidth * 0.15,
      height: -SIZES.screenHeight,
    },
  };
  const pipeBottom = {
    pos: {
      x: SIZES.screenWidth * (addToPosX / 100),
      y: SIZES.screenHeight * (1 - yPosTop + 0.2),
    },
    size: {
      width: SIZES.screenWidth * 0.15,
      height: SIZES.screenHeight,
    },
  };

  return {pipeTop, pipeBottom};
};
