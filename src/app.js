import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Popup, SVGOverlay} from 'react-map-gl';
// import ControlPanel from './control-panel';

import {defaultMapStyle, dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';
import {fromJS} from 'immutable';
import {json as requestJson} from 'd3-request';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA'; // Set your mapbox token here

export default class App extends Component {
  state = {
    showPopup: false,
    mapStyle: defaultMapStyle,
    year: 2016,
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 40,
      longitude: -100,
      zoom: 1,
      bearing: 0,
      pitch: 0
    }
  };

  componentDidMount() {
    requestJson('data/cryptopuzzle_test.json', (error, response) => {
    // requestJson('data/random_hexagon.json', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    });
  }

  _loadData = data => {
    updatePercentiles(data, f => f.properties.income[this.state.year]);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'incomeByState'], fromJS({type: 'geojson', data}))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    // console.log(mapStyle, data)

    this.setState({data, mapStyle});
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onHover = event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({hoveredFeature, x: offsetX, y: offsetY});
  };

  _onClick = event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({showPopup: true, hoveredFeature, x: offsetX, y: offsetY})
  };

  _renderTooltip() {
    const {hoveredFeature, x, y} = this.state;
    
    return (
      hoveredFeature && (
        <div className="tooltip" style={{left: x, top: y}}>
          <div>State: {hoveredFeature.properties.name}</div>
          <div>Median Household Income: {hoveredFeature.properties.value}</div>
          <div>Percentile: {(hoveredFeature.properties.percentile / 8) * 100}</div>
        </div>
      )
    );
  }

  _renderPopUp() {
    const {showPopup, hoveredFeature} = this.state;
    return (
      showPopup && (
        <Popup
          latitude={47.45032}
          longitude={-82.262188}
          closeButton={true}
          closeOnClick={false}
          onClose={() => this.setState({showPopup: false})}
          anchor="top" >
          <div>test Popup</div>
          <a href="https://www.google.com.ua/" target="_blank">Google</a>
        </Popup>
      )
    );
  }

  redraw({ project }) {
    const [cx, cy] = project([-140.4376, 50.7577]);
    return (
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill="blue"
        onClick={() => console.log("circle click")}
      />
    );
  }

  render() {
    const {viewport, mapStyle} = this.state;

    return (
      <div style={{height: '100%'}}>
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this._onHover}
          onClick={this._onClick}
        >
          {/* <SVGOverlay
            captureClick={false}
            onClick={() => console.log("overlay click")}
            redraw={this.redraw}
          /> */}
            {this._renderTooltip()}
            {this._renderPopUp()}
        </MapGL>

      </div>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
