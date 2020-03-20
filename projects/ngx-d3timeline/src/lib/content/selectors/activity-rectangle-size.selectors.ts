import { createSelector } from '../../selector/create-selector';
import {
  selectTimeScale,
  selectBandScale
} from '../../store/timeline-selectors';
import { selectTimeOrientation } from '../../store/state';
import {
  getRectBreadthInTimeAxis,
  getRectHeight,
  getRectWidth
} from '../content-utils';

const selectRectBreadthInTimeAxis = createSelector(selectTimeScale, timeScale =>
  getRectBreadthInTimeAxis.bind(null, timeScale)
);

const selectRectBreadthInResourceAxis = createSelector(
  selectBandScale,
  bandScale => bandScale.bandwidth()
);

export const selectRectHeight = createSelector(
  selectTimeOrientation,
  selectRectBreadthInTimeAxis,
  selectRectBreadthInResourceAxis,
  (timeOrientation, rectBreadthInTimeAxis, rectBreadthInResourceAxis) =>
    getRectHeight.bind(
      null,
      timeOrientation,
      rectBreadthInTimeAxis,
      rectBreadthInResourceAxis
    )
);

export const selectRectWidth = createSelector(
  selectTimeOrientation,
  selectRectBreadthInTimeAxis,
  selectRectBreadthInResourceAxis,
  (timeOrientation, rectBreadthInTimeAxis, rectBreadthInResourceAxis) =>
    getRectWidth.bind(
      null,
      timeOrientation,
      rectBreadthInTimeAxis,
      rectBreadthInResourceAxis
    )
);