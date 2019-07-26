import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'data',
  source: 'incomeByState',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#4287f5'],
        [1, '#42f54e'],
        [2, '#f5ec42'],
        [3, '#ff382e'],
        [4, '#ff0afb']
      ]
    },
    'fill-opacity': 0.5
  }
});

export const defaultMapStyle = fromJS(MAP_STYLE);
