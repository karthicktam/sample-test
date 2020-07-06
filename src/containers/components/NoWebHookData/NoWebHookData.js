import React from "react";
import "./_noWebHook.scss";
// import PropTypes from "prop-types";

import { Link } from "react-router-dom";

class NoWebHookDataBodyConatiner extends React.Component {

  stopFetching = () => {
    this.props.onToggleFetchSampleLoader(false);
  } // process

  render() {
    return (
      <div className="nodatacontainer">
        <div className="nodatacontainer__mapping-data1">
          {!this.props.isLoading && this.props.innerScreen === "facebook" 
            ? 
              <div>
                <h1 className="nodatacontainer__title">There is no pull data available!</h1>
                <h3 className="nodatacontainer__text">
                    Np pull data is available from the facebook source right now you can either
                    <br />
                    refresh or you can select any other data after you triggered the action.{" "}
                </h3> 
                <div>
                  <div className="source__save-btn source-dark-mt20">
                      <button type="button" className="source_dark_btn" onClick={() => {this.props.onRefresh();}}>Refresh to check again</button>
                  </div>
                  <div className="source__save-btn source-dark-mt20">
                      <button type="button" className="source_dark_btn" onClick={() => {this.props.onRefresh();}}>Trigger a live data</button>
                  </div>
                </div>
              </div>
            : !this.props.isLoading && this.props.innerScreen === "default"  
                ?
                  <div>
                    <h1 className="nodatacontainer__title">There is no live data available!</h1>
                    <h3 className="nodatacontainer__text">
                        Np live data is coming in. You can alse send the data through this
                        <br />
                        below webhook URL to get the data.{" "}
                    </h3> 
                    <div className="source__save-btn source-dark-mt20">
                      <p>{this.props.url}</p>
                    </div>
                    <div className="source__save-btn source-dark-mt20">
                        <button type="button" className="source_dark_btn" onClick={() => {this.props.onRefresh();}}>Refresh to check again</button>
                    </div>
                  </div>
                :
                  null
          }
          <div className="nodatacontainer__nodatasubmit">
            {this.props.isLoading ? (
              <div>
                <div className="nodatacontainer__loader"></div>
                <h1 className="nodatacontainer__title">Fetching your sample data</h1>
                <h3 className="nodatacontainer__text">
                  Please Wait {"..."}
                </h3> 
                <Link style={{ color: 'grey' }} onClick={this.stopFetching}>cancel</Link>
              </div>
            ) : (
                null
              /*<div className="source__save-btn source-dark-mt20">
                <button type="button" className="source_dark_btn" onClick={() => {this.props.onRefresh();}}>Refresh to check</button>
              </div>*/
            )}
          </div>
        </div>
      </div>
    );
  }
}

// NoWebHookDataBodyConatiner.propTypes = {
//   isLoading: PropTypes.bool,
//   onRefresh: PropTypes.func
// };

export default NoWebHookDataBodyConatiner;
