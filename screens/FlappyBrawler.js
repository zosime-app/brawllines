/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import {TouchableOpacity} from 'react-native-gesture-handler';
import entities from '../components/flappyBrawler/entities';
import Physics from '../components/flappyBrawler/physics';
import {SIZES} from '../constants';

export default function FlappyBrawler() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  useEffect(() => {
    setRunning(false);
  }, []);
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          position: 'absolute',
          width: '80%',
          fontSize: SIZES.tempSize * 50,
          fontWeight: 'bold',
          margin: SIZES.tempSize * 30,
          textAlign: 'center',
          backgroundColor: '#FFDD00',
        }}>
        {currentPoints}
      </Text>
      <GameEngine
        ret={(ref) => {
          setGameEngine(ref);
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvnet={(e) => {
          switch (e.type) {
            case 'game_over':
              setRunning(false);
              gameEngine.stop();
              break;
            case 'new_point':
              setCurrentPoints(currentPoints + 1);
              break;
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
        }}></GameEngine>
      {!running ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              setCurrentPoints(0);
              setRunning(true);
              gameEngine.swap(entities());
            }}
            style={{
              backgroundColor: 'black',
              paddingHorizontal: SIZES.tempSize * 30,
              paddingVertical: SIZES.tempSize * 20,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: SIZES.tempSize * 30,
              }}>
              START GAME
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
