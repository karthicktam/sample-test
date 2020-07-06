import React, { Component } from "react";
import "./_incomingEvent.scss";
// import Flyout from "../../components/cl-flyout/Flyout";
// import PropTypes from "prop-types";
// import JsonViewer from "../../components/cl-json-viewer/JsonViewer";
// import Link from "../../components/cl-link/Link";
import { Link } from "react-router-dom";

class IncomingEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flyoutVisibility: false
    };
  }
  openFlyout = () => {
    this.setState({ flyoutVisibility: true });
  };

  closeFlyout = () => {
    this.setState({ flyoutVisibility: false });
  };

  closeFlyoutForButton = (event) => {
    this.setState({ flyoutVisibility: false });
    this.refs.plus.checked = true;
    this.handleChange(event);
  }; // done by me

  handleChange = event => {
    this.props.selectedEvent(event);
  };

  render() {
    return (
      <div>
        <input
          type="radio"
          name="incoming-event"
          ref="plus" // newly added
          id={`incoming${this.props.event["title"]}`}
          onChange={() => this.handleChange(this.props.event)}
        />{" "}
        {/* input is used outside for accessing all elements in css*/}
        <div className="incoming-event">
          <label
            style={{ width: "100%", cursor: "pointer" }}
            htmlFor={`incoming${this.props.event["title"]}`}
          >
            <div className="incoming-event__flex">
              <div className="incoming-event__inner-flex">
                <div className="incoming-event__radio-section">
                  <span className="incoming-event__radio"></span>
                </div>
                <div>
                  <p style={{margin: "0px"}}>{this.props.tags.map(tag => (<span style={{margin: "0px 5px"}} className="incoming-event__tag" key={tag + Math.random(0, 10)}>{tag}</span>))}</p>
                  <h4>Request ID: {this.props.event["title"]}</h4>
                  <p className="incoming-event__description">
                    Received on: {this.props.event["description"]}
                  </p>
                </div>
              </div>
              <div className="incoming-event__view-json">
                <Link onClick={this.openFlyout}>view data</Link>
              </div>
            </div>
          </label>
        </div>
        {/*<Flyout
          title={"Incoming " + this.props.event["title"]}
          visibility={this.state.flyoutVisibility}
          onExit={this.closeFlyout}
        >
          <JsonViewer jsonData={this.props.event["data"]} />
          <button 
            className="incoming-event__button"
            onClick={() => this.closeFlyoutForButton(this.props.event)}     
          >Select this sample</button> {/* button added by me 
        </Flyout>*/}
      </div>
    );
  }
}

// IncomingEvent.propTypes = {
//   selectedEvent: PropTypes.func, //callback function to return the selected event
//   event: PropTypes.object //contains an object of datas for the event
// };

export default IncomingEvent;
