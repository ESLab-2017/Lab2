import React, { Component } from 'react';
import { Event } from 'react-socket-io';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Checkbox from 'material-ui/Checkbox';
import FlashOn from 'material-ui/svg-icons/image/flash-on';
import FlashOff from 'material-ui/svg-icons/image/flash-off';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { gray100, grey700 } from 'material-ui/styles/colors';
import Slider from 'material-ui/Slider';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import './Tessel.css';

injectTapEventPlugin();

class Tessel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      thres: 0.045,
      x: null,
      y: null,
      x_orient: "nor",
      y_orient: "nor",
      flashed: false,
    };
  }

  handleData = (obj) => {
    const { x, y } = obj;
    const thres = this.state.thres;
    this.setState({ x });
    this.setState({ y });
    this.setState({ x_orient: "nor" });
    this.setState({ y_orient: "nor" });

    if (Math.abs(x) > thres) {
        if (x > 0) this.setState({ x_orient: "pos" });
        else this.setState({ x_orient: "neg" });
    }
    if (Math.abs(y) > thres) {
        if (y > 0) this.setState({ y_orient: "pos" });
        else this.setState({ y_orient: "neg" });
    }
  }

  handleSlider = (ev, val) => {
    this.setState({ thres: val });
  }

  handleFlashToggle = () => {
    this.setState({ flashed: !this.state.flashed });
  }

  render() {

    return(
      <div className="tessel">
        <Event event="newdata" handler={ this.handleData } />
        <div className="camera">
           <img src="/stream" className="web-cam" alt="web-cam" />
        </div>
        <Toolbar style={ { 
          'backgroundColor': 'white',
          'margin': '10px'
          } }>
          <ToolbarGroup firstChild={ true }>
            <Checkbox
              checked={ this.state.flashed }
              onCheck={ this.handleFlashToggle }
              checkedIcon={<FlashOn />}
              uncheckedIcon={<FlashOff />}
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <Chip
              backgroundColor={ gray100 }
            >
              <Avatar size={32} color={ gray100 } backgroundColor={ grey700 }>
                X
              </Avatar>
              { this.state.x_orient }
            </Chip>
            <Chip
              backgroundColor={ gray100 }
              style={ { 'marginLeft': 12 } }
            >
              <Avatar size={32} color={ gray100 } backgroundColor={ grey700 }>
                Y
              </Avatar>
              { this.state.y_orient }
            </Chip>
          </ToolbarGroup>

          <ToolbarGroup lastChild={ true }>
            <ToolbarTitle text={ this.state.thres.toFixed(3) } />
            <Slider 
              className="thres-slider"
              value={ this.state.thres }
              max={ 0.5 }
              min={ 0 }
              step={ 0.005 }
              onChange={ this.handleSlider }
            />
          </ToolbarGroup>
        </Toolbar>
        <RaisedButton 
          label="Set"
          onClick={ this.context.socket.emit('newcalib', [this.state.x, this.state.y]) }
        />
        <RaisedButton 
          label="Reset"
          onClick={ this.context.socket.emit('newcalib', [0, 0]) }
        />
      </div>
    );
  }
}

export default Tessel;
