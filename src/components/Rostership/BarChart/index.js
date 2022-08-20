import { StyleSheet, View, Pressable } from 'react-native'
import React, {useEffect} from 'react'
import {
    Canvas, 
    Path, 
    Skia, 
    useComputedValue, 
    Text,
    useValue,
    runTiming,
    Easing
} from '@shopify/react-native-skia'
import * as d3 from 'd3';
import { colors } from '../../../utils/colors';

const BarChart = ({
    data,
    font,
    legendFont,
    color = colors.LIGHT_GREEN,
    rerender,
    player
}) => {
    const animationState = useValue(0);
    const GRAPH_MARGIN = 20;
    const GRAPH_BAR_WIDTH = 30;
    const CanvasHeight = 300;
    const CanvasWidth = 350;
    const graphHeight = CanvasHeight - 2 * GRAPH_MARGIN;
    const graphWidth = CanvasWidth - 2;
    const xDomain = data.map(point => point.label)
    const xRange = [0, graphWidth];
    const xChart = d3.scalePoint().domain(xDomain).range(xRange).padding(1);
    const yDomain = [
        0,
        d3.max(data, (point) => point.value)
    ]
    const yRange = [0, graphHeight - 20];
    const yChart = d3.scaleLinear().domain(yDomain).range(yRange);

    const graphPath = useComputedValue(() => {
        const newPath = Skia.Path.Make();

        data.forEach((point, index) => {
            const widthFont = font.getTextWidth(point.label)
            const x = index == 0 ? xChart(point.label) - GRAPH_BAR_WIDTH / 2 - (widthFont / 4) : xChart(point.label) - GRAPH_BAR_WIDTH / 2 + (widthFont / 7)

            const rect = Skia.XYWHRect(
                x,
                graphHeight + 10,
                GRAPH_BAR_WIDTH,
                yChart(point.value * animationState.current) * -1
            );
            const roundedRect = Skia.RRectXY(rect, 3, 3);
            newPath.addRRect(roundedRect);
        })
        return newPath;
    },[animationState, rerender])

    const animate = () => {
        animationState.current = 0;

        runTiming(animationState, 1, {
            duration:1600,
            easing:Easing.inOut(Easing.exp),
        })
    }

    useEffect(() => {
        animate();
    },[rerender])

  return (
    <Pressable onPress={animate} style={styles.container}>
        <Canvas style={[styles.container,{height:CanvasHeight,width:CanvasWidth}]}>
            <Path 
                path={graphPath}
                color={color}
            />
            {data.map((point, index) => {
                const widthFont = font.getTextWidth(point.label)
                const x = index == 0 ? xChart(point.label) - (widthFont / 2) - 25 : xChart(point.label) - (widthFont / 2) + 25
                const xLegend = index == 0 ? xChart(point.label) - GRAPH_BAR_WIDTH / 2 - (widthFont / 4) : xChart(point.label) - GRAPH_BAR_WIDTH / 2 + (widthFont / 7)

                return (
                    <React.Fragment key={index}>
                        <Text 
                            font={font}
                            x={x}
                            y={CanvasHeight - 10}
                            text={point.label}
                            color={color}
                        />
                        <Text 
                            font={legendFont}
                            x={xLegend + 8}
                            y={CanvasHeight - yChart(point.value) - 35}
                            text={point.value.toString()}
                            color={color}
                            opacity={animationState}
                        />
                    </React.Fragment>
                )
            })}
            <Text 
                font={font}
                x={0}
                y={15}
                text={'* Média'}
                color={color}
            />
        </Canvas>
    </Pressable>
  )
}

export default BarChart

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})