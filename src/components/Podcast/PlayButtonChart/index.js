import { StyleSheet, View, Pressable, PixelRatio } from 'react-native'
import React, { useEffect } from 'react'
import { Skia, Canvas, Path, Image, useImage} from '@shopify/react-native-skia';
import { colors } from '../../../utils/colors';

const RADIUS = PixelRatio.roundToNearestPixel(20);
const STROKE_WIDTH = 2.5;

const PlayButtonChart = ({
    percentageComplete,
    color = colors.LIGHT_GREEN,
}) => {
    const innerRadius = RADIUS - (STROKE_WIDTH / 2);

    const path = Skia.Path.Make();
    path.addCircle(30, 120, 20)


  return (
      <Canvas style={styles.container}>
        <Path 
            path={path}
            color={'white'}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap='square'
            start={percentageComplete}
            end={1}
            
        />
        {/*<Path 
            path={path}
            color={color}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap='square'
            start={0.5}
            end={1}
            
        />*/}
        <Path
            path={'m 38.192 122.394 l -12.726 7.384 c -1.08 0.626 -2.466 -0.132 -2.466 -1.394 V 113.616 c 0 -1.26 1.384 -2.02 2.466 -1.392 l 12.726 7.384 a 1.604 1.604 90 0 1 0 2.786 z'}
            color={'white'}

            style='fill'
        />
      </Canvas>
  )
}

export default PlayButtonChart

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})