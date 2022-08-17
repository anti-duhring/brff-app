import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { Skia, Canvas, Path, Text, useValue, runTiming, Easing } from '@shopify/react-native-skia';
import { colors } from '../../../utils/colors';

const DonutChart = ({
    strokeWidth,
    radius,
    font,
    smallerFont,
    percentageComplete,
    targetPercentage,
    color = colors.LIGHT_GREEN,
    rerender
}) => {
    const innerRadius = radius - strokeWidth / 2;
    const targetText = `${targetPercentage * 100}%`

    const path = Skia.Path.Make();
    path.addCircle(radius, radius, innerRadius)

    const width = font.getTextWidth(targetText)
    const widthSmallerFont = smallerFont.getTextWidth('Rostership')

    const animationState = useValue(0)
    const opacityState = useValue(0);

    const animateChart = () => {
        animationState.current = 0;

        runTiming(animationState, percentageComplete, {
            duration: 1250,
            easing: Easing.inOut(Easing.cubic),
        })
    }
    const animateOpacity = () => {
        opacityState.current = 0;

        runTiming(opacityState, 1, {
            duration: 1250,
            easing: Easing.inOut(Easing.cubic),
        })
    }

    
    useEffect(() => {
        animateChart();
        animateOpacity();
    },[rerender])

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path 
            path={path}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            start={0}
            end={animationState}
        />
        <Text 
            x={innerRadius - width / 2}
            y={radius + strokeWidth}
            text={targetText}
            font={font}
            opacity={opacityState}
            color={color}
        />
        <Text 
            x={innerRadius - (widthSmallerFont / 2)}
            y={radius + 45}
            text={'Rostership'}
            font={smallerFont}
            opacity={opacityState}
            color={color}
        />
      </Canvas>
    </View>
  )
}

export default DonutChart

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})