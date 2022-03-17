/* eslint-disable react-native/no-inline-styles */
import Matter from 'matter-js';
import React from 'react';
import {View, Image} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {SIZES} from '../../constants';
//import LottieView from 'lottie-react-native';

const Bird = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  const color = props.color;

  return (
    <View
      style={{
        // borderWidth: 1,
        // borderColor: color,
        // borderStyle: 'solid',
        position: 'absolute',
        left: xBody,
        top: yBody,
        width: widthBody,
        height: heightBody,
      }}>
      <AnimatedLottieView
        source={require('../../assets/animations/crow.json')}
        style={{
          left: -SIZES.tempSize * 6,
          top: -SIZES.tempSize * 5,
          width: SIZES.tempSize * 60,
          height: SIZES.tempSize * 60,
        }}
        autoPlay
        loop
      />
    </View>
  );
};

export default (world, color, pos, size) => {
  const initialBird = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {label: 'Bird'},
  );
  Matter.World.add(world, initialBird);

  return {
    body: initialBird,
    color,
    pos,
    renderer: <Bird />,
  };
};
