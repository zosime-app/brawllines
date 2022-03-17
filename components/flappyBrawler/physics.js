import Matter from 'matter-js';
import {Platform} from 'react-native';
import {SIZES} from '../../constants';
import {getPipeSizePosPair} from './utils/random';

let gameType = 'none';

const Physics = (entities, {touches, time, dispatch}) => {
  if (gameType != 'none') {
    gameType = 'none';
  }

  let engine = entities.physics.engine;

  touches
    .filter((t) => t.type === 'press')
    .forEach((t) => {
      Matter.Body.setVelocity(entities.Bird.body, {
        x: 0,
        y:
          Platform.OS === 'ios'
            ? -SIZES.screenHeight * 0.01
            : -SIZES.screenHeight * 0.02,
      });
    });

  Matter.Engine.update(engine, time.delta);
  for (let i = 1; i <= 2; i++) {
    if (
      entities[`ObstacleTop${i}`].body.bounds.max.x <= 50 &&
      !entities[`ObstacleTop${i}`].point
    ) {
      entities[`ObstacleTop${i}`].point = true;
      if (gameType != 'new_point') {
        gameType = 'new_point';
        dispatch({type: 'new_point'});
      }
    }

    if (
      entities[`ObstacleTop${i}`].body.bounds.max.x <
      SIZES.screenWidth * -0.95
    ) {
      const pipeSizePos = getPipeSizePosPair(95);
      Matter.Body.setPosition(
        entities[`ObstacleTop${i}`].body,
        pipeSizePos.pipeTop.pos,
      );
      Matter.Body.setPosition(
        entities[`ObstacleBottom${i}`].body,
        pipeSizePos.pipeBottom.pos,
      );
    }
    Matter.Body.translate(entities[`ObstacleTop${i}`].body, {x: -3, y: 0});
    Matter.Body.translate(entities[`ObstacleBottom${i}`].body, {x: -3, y: 0});
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
