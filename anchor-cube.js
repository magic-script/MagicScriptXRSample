import React from 'react';
import { View, Line, Text } from 'magic-script-components';

const red = [1, 0, 0, 1];
const green = [0, 1, 0, 1];
const blue = [0, 0, 1, 1];
const vecStart = [0, 0, 0];
const length = 0.25;

// props:
// - id
// - uuid

export default function (props) {
  const uuid = props.uuid;
  const vecX = [vecStart, [length, 0, 0]];
  const vecY = [vecStart, [0, length, 0]];
  const vecZ = [vecStart, [0, 0, length]];

  return (
    <View anchorUuid={uuid}>
      <Line points={vecX} color={red} />
      <Line points={vecY} color={green} />
      <Line points={vecZ} color={blue} />
      <Text textSize={0.02} text={props.id} textColor={red}/>
    </View>
  );
}
