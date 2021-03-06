import { createSelector } from '../store-lib/selector/create-selector';

import { selectResources } from '../scales/selectors/band-scale.selectors';
import {
  selectOrientedScale,
  selectScale
} from '../scales/selectors/scale-selectors';
import { selectTimeScale } from '../scales/selectors/time-scale.selectors';
import { getTimeAxisTickMarkRenderer } from './time-axis-tick-mark-renderer';
import { getResourceAxisTickMarkRenderer } from './resource-axis-tick-mark-renderer';
import { mapValues } from '../core/transform-utils';
import { selectViewTopLeft } from '../view/view.selectors';
import {
  selectAxisTickLineOffset,
  selectAxisFontFace,
  selectAxisFontSize
} from '../options/selectors/axis-options.selectors';
import { partialApply, identity, add } from '../core/function-utils';
import { TimeScale } from '../scales/scale-types';
import { Orientation, flipOrientation } from '../core/orientation';
import { Point, pointToTransform, origin } from '../core/point';
import { TickMarkRenderer } from './tick-mark-renderer';
import { TickMark } from './tick-mark';
import { Line, createOrientedLine } from '../core/line';
import { AxisType, flipAxisType } from '../axis/axis';
import {
  createEnumSelector,
  createStructuredSelector
} from '../store-lib/selector/selector-utils';
import { constSelector } from '../store-lib/selector/selector';
import { selectAxisOrientation } from '../options/selectors/options.selectors';

export const selectGetTickPosition = createSelector(
  selectViewTopLeft,
  viewTopLeft => getTickPosition.bind(null, viewTopLeft)
);

function getTickPosition(
  viewTopLeft: Point,
  orientation: Orientation,
  range: number
): Point {
  return orientation === Orientation.Vertical
    ? { ...viewTopLeft, y: range }
    : { ...viewTopLeft, x: range };
}

const selectResourceAxisTickMarkRenderer = createSelector(
  selectOrientedScale(AxisType.Resources),
  getResourceAxisTickMarkRenderer
);

const selectTimeAxisTickMarkRenderer = createSelector(
  selectOrientedScale(AxisType.Time),
  getTimeAxisTickMarkRenderer
);

const selectGetTimeAxisTickLabel = createSelector(
  selectScale(AxisType.Time),
  getTimeAxisTickLabel
);

function getTimeAxisTickLabel(scale: TimeScale) {
  return (value: Date) => scale.tickFormat()(value);
}

const selectGetTickLabel = (axisType: AxisType) =>
  createEnumSelector<AxisType, (x: any) => string>({
    Time: selectGetTimeAxisTickLabel,
    Resources: constSelector(identity)
  })(constSelector(axisType));

const selectTickLabelGap = constSelector(-2);
const selectTickLabelSpacing = (axisType: AxisType) =>
  createSelector(selectAxisTickLineOffset(axisType), selectTickLabelGap, add);

const selectHorizontalTickLabelOffset = (axisType: AxisType) =>
  createStructuredSelector<Point>({
    x: selectTickLabelSpacing(axisType),
    y: constSelector(0)
  });

const selectVerticalTickLabelOffset = (axisType: AxisType) =>
  createStructuredSelector<Point>({
    x: constSelector(0),
    y: selectTickLabelSpacing(axisType)
  });

const selectTickLabelOffset = (axisType: AxisType) =>
  createEnumSelector<Orientation, Point>({
    Horizontal: selectHorizontalTickLabelOffset(axisType),
    Vertical: selectVerticalTickLabelOffset(axisType)
  })(selectAxisOrientation(flipAxisType(axisType)));

const selectOrientedTickLine = (orientation: Orientation, axisType: AxisType) =>
  createSelector(
    constSelector(origin),
    selectAxisTickLineOffset(axisType),
    (point, offset) => createOrientedLine(point, offset, orientation)
  );

const selectTickLine = (axisType: AxisType) =>
  createEnumSelector<Orientation, Line>({
    Horizontal: selectOrientedTickLine(Orientation.Horizontal, axisType),
    Vertical: selectOrientedTickLine(Orientation.Vertical, axisType)
  })(selectAxisOrientation(flipAxisType(axisType)));

const selectGetResourceAxisTickMark = createSelector(
  selectGetTickPosition,
  selectGetTickLabel(AxisType.Resources),
  selectTickLabelOffset(AxisType.Resources),
  selectTickLine(AxisType.Resources),
  selectResourceAxisTickMarkRenderer,
  selectAxisFontFace(AxisType.Resources),
  selectAxisFontSize(AxisType.Resources),
  partialApply(getTickMark)
);

const selectGetTimeAxisTickMark = createSelector(
  selectGetTickPosition,
  selectGetTickLabel(AxisType.Time),
  selectTickLabelOffset(AxisType.Time),
  selectTickLine(AxisType.Time),
  selectTimeAxisTickMarkRenderer,
  selectAxisFontFace(AxisType.Time),
  selectAxisFontSize(AxisType.Time),
  partialApply(getTickMark)
);

function getTickMark(
  tickValue: any,
  tickPosition: (o: Orientation, range: number) => Point,
  label: (x: any) => string,
  labelOffset: Point,
  line: Line,
  tickMarkRenderer: TickMarkRenderer,
  fontFace: string,
  fontSize: number
): TickMark {
  return {
    label: label(tickValue),
    transform: pointToTransform(
      tickPosition(
        tickMarkRenderer.orientation,
        tickMarkRenderer.mapTickValueToPositionInScale(tickValue)
      )
    ),
    labelOffset,
    line,
    fontFace,
    fontSize
  };
}

const selectTimeAxisTickValues = createSelector(
  selectTimeScale,
  getTimeAxisTickValues
);

function getTimeAxisTickValues(scale: TimeScale) {
  return scale.ticks();
}

export const selectAxisTickValues = (axisType: AxisType) =>
  createEnumSelector<AxisType, any[]>({
    Resources: selectResources,
    Time: selectTimeAxisTickValues
  })(constSelector(axisType));

export const selectResourceAxisTickMarks = createSelector(
  selectAxisTickValues(AxisType.Resources),
  selectGetResourceAxisTickMark,
  mapValues
);

export const selectTimeAxisTickMarks = createSelector(
  selectAxisTickValues(AxisType.Time),
  selectGetTimeAxisTickMark,
  mapValues
);
