import { createSelector } from '../store-lib/selector/create-selector';
import {
  selectViewTopLeft,
  selectVerticalMargin,
  selectMarginLeft
} from '../view/view.selectors';
import {
  selectResourceAxisTickMarks,
  selectTimeAxisTickMarks,
  selectAxisTickValues,
  selectGetTickPosition
} from '../tick-mark/tick-mark.selector';
import { Line, createOrientedLine, createLine } from '../core/line';
import { selectOrientedScale } from '../scales/selectors/scale-selectors';
import { OrientedScale } from '../scales/oriented-scale';
import { Scale } from '../scales/scale-types';
import { mapValues } from '../core/transform-utils';
import {
  selectAxisShowGridLines,
  selectAxisShowAxisLine
} from '../options/selectors/axis-options.selectors';
import { partialApply } from '../core/function-utils';
import { Axis, AxisType, flipAxisType } from './axis';
import { Orientation, flipOrientation } from '../core/orientation';
import { Point } from '../core/point';
import { selectAxisOrientation } from '../options/selectors/options.selectors';
import {
  createEnumSelector,
  createStructuredSelector
} from '../store-lib/selector/selector-utils';

const selectGetAxisLine = createSelector(
  selectViewTopLeft,
  partialApply(getAxisLine)
);

function getAxisLine(
  orientedScale: OrientedScale<Scale>,
  viewTopLeft: Point
): Line {
  return createLine(viewTopLeft, getAxisEndPoint(orientedScale, viewTopLeft));
}

function getAxisEndPoint(
  orientedScale: OrientedScale<Scale>,
  viewTopLeft: Point
): Point {
  return orientedScale.orientation === Orientation.Vertical
    ? { ...viewTopLeft, y: getRangeLimit(orientedScale.scale) }
    : { ...viewTopLeft, x: getRangeLimit(orientedScale.scale) };
}

const selectGetMargin = (axisType: AxisType) =>
  createEnumSelector<Orientation, number>({
    Horizontal: selectMarginLeft,
    Vertical: selectVerticalMargin
  })(selectAxisOrientation(axisType));

const selectGetAxisGridLine = (axisType: AxisType) =>
  createSelector(
    selectGetTickPosition,
    selectOrientedScale(axisType),
    selectOrientedScale(flipAxisType(axisType)),
    selectGetMargin(flipAxisType(axisType)),
    partialApply(getTickGridLine)
  );

function getTickGridLine(
  tickValue: any,
  tickPosition: (o: Orientation, range: number) => Point,
  orientedScale: OrientedScale<Scale>,
  otherOrientedScale: OrientedScale<Scale>,
  margin: number
): Line {
  return createOrientedLine(
    tickPosition(orientedScale.orientation, orientedScale.scale(tickValue)),
    getGridLineLength(otherOrientedScale, margin),
    flipOrientation(orientedScale.orientation)
  );
}

function getGridLineLength(
  orientedScale: OrientedScale<Scale>,
  margin: number
) {
  return getRangeLimit(orientedScale.scale) - margin;
}

function getRangeLimit(scale: Scale): number {
  return scale.range()[1];
}

const selectAxisGridLines = (axisType: AxisType) =>
  createSelector(
    selectAxisTickValues(axisType),
    selectGetAxisGridLine(axisType),
    mapValues
  );

const selectAxisLine = (axisType: AxisType) =>
  createSelector(
    selectAxisShowAxisLine(axisType),
    selectOrientedScale(axisType),
    selectGetAxisLine,
    axisLineFromOrientedScale
  );

function axisLineFromOrientedScale(
  showAxisLine: boolean,
  orientedScale: OrientedScale<Scale>,
  line: (o: OrientedScale<Scale>) => Line
) {
  return showAxisLine && line(orientedScale);
}

export const selectResourceAxis = createStructuredSelector<Axis>({
  gridLines: selectAxisGridLines(AxisType.Resources),
  line: selectAxisLine(AxisType.Resources),
  orientation: selectAxisOrientation(AxisType.Resources),
  showGridLines: selectAxisShowGridLines(AxisType.Resources),
  tickMarks: selectResourceAxisTickMarks
});

export const selectTimeAxis = createStructuredSelector<Axis>({
  gridLines: selectAxisGridLines(AxisType.Time),
  line: selectAxisLine(AxisType.Time),
  orientation: selectAxisOrientation(AxisType.Time),
  showGridLines: selectAxisShowGridLines(AxisType.Time),
  tickMarks: selectTimeAxisTickMarks
});
