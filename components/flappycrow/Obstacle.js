/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import Matter from 'matter-js';
import React from 'react';
import {View, Image, Platform} from 'react-native';
import {SIZES} from '../../constants';

const Obstacle = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;
  const color = props.color;

  if (Platform.OS === 'ios') {
    return (
      <View
        style={{
          // borderWidth: 2,
          // borderColor: '#151102',
          // borderStyle: 'solid',
          position: 'absolute',
          left: xBody,
          top: yBody,
          width: widthBody,
          height: heightBody,
          flexDirection: 'row',
          backgroundColor: '#509020',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: 'black',
        }}>
        <Image
          source={require('../../assets/images/opuntia.png')}
          resizeMode="repeat"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
          }}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          position: 'absolute',
          left: xBody,
          top: yBody,
          width: widthBody,
          height: heightBody,
          flexDirection: 'row',
          backgroundColor: '#509020',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: 'black',
        }}>
        <Image
          source={require('../../assets/images/opuntia.png')}
          resizeMode="repeat"
          style={{
            top: heightBody * 0.001,
            left: 0,
            width: widthBody * 0.92,
            height: heightBody * 0.996,
            borderWidth: 1,
          }}
        />
      </View>
    );
  }
};

export default (world, label, color, pos, size) => {
  const initialObstacle = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label,
      isStatic: true,
    },
  );
  Matter.World.add(world, initialObstacle);

  return {
    body: initialObstacle,
    color,
    pos,
    renderer: <Obstacle />,
  };
};
