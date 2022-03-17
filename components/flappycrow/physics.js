import Matter from 'matter-js';
import {getPipeSizePosPair} from './utils/random';

import {Dimensions, Platform} from 'react-native';
import {SIZES} from '../../constants';

let gameType = 'none';

const Physics = (entities, {touches, time, dispatch}) => {
  if (gameType != 'none') {
    gameType = 'none';
  }
  let engine = entities.physics.engine;
  touches
    .filter((t) => t.type === 'press')
    .forEach((t) => {
      dispatch({type: 'touch'});
      Matter.Body.setVelocity(entities.Bird.body, {
        x: 0,
        y:
          Platform.OS === 'ios'
            ? -SIZES.screenHeight * 0.01
            : -SIZES.screenHeight * 0.01,
      });
    });

  Matter.Engine.update(engine, time.delta);

  for (let index = 1; index <= 2; index++) {
    if (
      entities[`ObstacleTop${index}`].body.bounds.max.x <= 50 &&
      !entities[`ObstacleTop${index}`].point
    ) {
      entities[`ObstacleTop${index}`].point = true;
      if (gameType != 'new_point') {
        gameType = 'new_point';
        dispatch({type: 'new_point'});
      }
    }

    if (
      entities[`ObstacleTop${index}`].body.bounds.max.x <
      SIZES.screenWidth * -1
    ) {
      const pipeSizePos = getPipeSizePosPair(100);
      Matter.Body.setPosition(
        entities[`ObstacleTop${index}`].body,
        pipeSizePos.pipeTop.pos,
      );
      Matter.Body.setPosition(
        entities[`ObstacleBottom${index}`].body,
        pipeSizePos.pipeBottom.pos,
      );
      entities[`ObstacleTop${index}`].point = false;
    }
    Matter.Body.translate(entities[`ObstacleTop${index}`].body, {
      x:
        Platform.OS === 'ios'
          ? -SIZES.screenWidth * 0.01
          : -SIZES.screenWidth * 0.01,
      y: 0,
    });
    Matter.Body.translate(entities[`ObstacleBottom${index}`].body, {
      x:
        Platform.OS === 'ios'
          ? -SIZES.screenWidth * 0.01
          : -SIZES.screenWidth * 0.01,
      y: 0,
    });
  }

  Matter.Events.on(engine, 'collisionStart', (event) => {
    if (gameType != 'game_over') {
      gameType = 'game_over';
      dispatch({type: 'game_over'});
    }
  });
  return entities;
};
export default Physics;
