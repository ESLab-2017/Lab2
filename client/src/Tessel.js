import React, { Component } from 'react';
import { Event } from 'react-socket-io';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Checkbox from 'material-ui/Checkbox';
import FlashOn from 'material-ui/svg-icons/image/flash-on';
import FlashOff from 'material-ui/svg-icons/image/flash-off';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { gray100, lightGreen100, lightGreen700, red100, red700 } from 'material-ui/styles/colors';
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
      x_cali: 0,
      y_cali: 0,
      x_orient: "nor",
      y_orient: "nor",
      flashed: false,
    };
  }

  handleData = (obj) => {
    const { x, y } = obj;
    const thres = this.state.thres;
    this.setState({ x: x - this.state.x_cali });
    this.setState({ y: y - this.state.y_cali });
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

    if (this.state.x_orient === 'nor' && this.state.y_orient === 'nor') this.context.socket.emit('greenon');
    else if (this.state.x_orient !== 'nor' && this.state.y_orient !== 'nor') this.context.socket.emit('greenoff');
    else this.context.socket.emit('greenblink');
  }

  handleSlider = (ev, val) => {
    this.setState({ thres: val });
  }

  handleFlashToggle = () => {
    this.setState({ flashed: !this.state.flashed });
    if (!this.state.flashed) this.context.socket.emit('ledon');
    else this.context.socket.emit('ledoff');
  }

  handleSetClick = () => {
    this.setState({
      x_cali: this.state.x,
      y_cali: this.state.y
    })
  }

  handleResetClick = () => {
    this.setState({
      x_cali: 0,
      y_cali: 0
    })
  }

  renderChip = (type, orient) => {
    let avaColor = lightGreen700;
    let chipColor = lightGreen100;
    if (type === 'X' && this.state.x_orient !== 'nor') {
      avaColor = red700;
      chipColor = red100;
    }
    else if (type === 'Y' && this.state.y_orient !== 'nor') {
      avaColor = red700;
      chipColor = red100;
    }
    return (
      <Chip
        backgroundColor={ chipColor }
        style={ { 'marginLeft': 12 } }
      >
        <Avatar size={32} color={ gray100 } backgroundColor={ avaColor }>
          { type }
        </Avatar>
        { orient }
      </Chip>
    );
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
            { this.renderChip('X', this.state.x_orient) }
            { this.renderChip('Y', this.state.y_orient) }
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
          onClick={ this.handleSetClick }
        />
        <RaisedButton 
          label="Reset"
          onClick={ this.handleResetClick }
          style={ { 'marginLeft': 12 } }
        />
      </div>
    );
  }
}

Tessel.contextTypes = {
  socket: React.PropTypes.object.isRequired
}

export default Tessel;
