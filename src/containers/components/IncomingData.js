import React, { Component } from "react";

import IncomingEvent from "./IncomingEvent";
import NoWebHookData from "./NoWebHookData/NoWebHookData";
import { Link } from "react-router-dom";

class Incomingdata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: undefined,
      innerScreen: "default",
      search: "", // process from here
      sample: this.props.eventList,
      filteredSample: this.props.eventList,
      showCancel: false
    };

    this.filterList = this.filterList.bind(this);
    this.onChange = this.onChange.bind(this); // process
  }

  getSelectedEvent = event => {
    this.setState({ selectedEvent: event });
  };

  stopFetching = () => {
    this.props.onToggleFetchSampleLoader(false);
  } // process

  onConfirm = () => {
    if (Object.keys(this.props.selectedSampleData).length === 0) {
      this.props.onNext(this.state.selectedEvent, false);
    } else {
      // confirmAlert({
      //   title: 'Do you want to change the sample data?',
      //   message: "Filter and mapping steps required to be updated again",
      //   buttons: [
      //     {
      //       label: "Yes",
      //       onClick: () => {
      //         this.props.onNext(this.state.selectedEvent, true);
      //       }
      //     },
      //     { label: "No", onClick: () => {} }
      //   ],
      //   childrenElement: () => <div />,
      //   closeOnEscape: false,
      //   closeOnClickOutside: false
      // })
    }
  }; // newly added

  clearValue = () => {
    this.setState({
      search: "",
      showCancel: false
    }, () => this.filterList())
  } // process

  onChange(event) {
    const search = event.target.value.toLowerCase();
    this.setState({ search }, () => this.filterList());
    if (search.length !== "") {
      this.setState({ showCancel: true }, () => this.filterList());
    }
  } // process

  filterList() {
    let sample = this.state.sample;
    let search = this.state.search;

    sample = sample.filter(function(sData) {
      console.log("sDatasDatasData", JSON.stringify(sData["data"]));
      return JSON.stringify(sData["data"]).toLocaleLowerCase().indexOf(search) !== -1;
    });

    this.setState({ filteredSample: sample });
  } // process

    render() {

        let container;

        if (this.props.sampleRecords.length > 0) {
          container = <div>
                        {this.state.filteredSample.map(event => (
                          <IncomingEvent
                            key={event["title"]}
                            selectedEvent={this.getSelectedEvent}
                            event={event}
                            tags={event["tags"]}
                          />
                        ))}
                      </div>
        } else {
          container = <NoWebHookData
                        isLoading={false}
                        innerScreen={this.state.innerScreen}
                        url={"https://customerlabs.co"}
                       />
        }

        return (
          <div className="incoming-data">
            <div className="incoming-data__container">
              <div>
                <div className="source-section_heading">
                  <h1 className="incoming-section_heading__h1">Choose which data to load</h1>
                  <h1 className="incoming-section_heading__p">
                    Select the data to which you can use to map
                  </h1>
                </div> 

                <div>
                  <p>Help</p>
                </div>

                <div>
                  <p>How this works?</p>
                </div>
              </div>

              <div className="source-section_action">
                <div className="source-section_action_dropdown">
                  {/* <input type="text" className="source-dropdown" placeholder="All"></input> */}
                  <input 
                    type="text" 
                    className="source-searchbar" 
                    placeholder="search sample data"
                    value={this.state.search}
                    onChange={this.onChange}
                  />

                  {this.state.showCancel ? (
                    <span style={{margin: '-20px', zIndex: '20', cursor: 'pointer'}} onClick={this.clearValue}>
                      &times;
                    </span>
                  ) : null}
                </div>
              </div> {/* process */}

              <div className="incoming-data__sbt-btn">
                <button type="button" 
                className="source_dark_btn" 
                onClick={this.onConfirm}>Load more data</button>
              </div>
                {container}
                <div className="incoming-data__submit">
                {this.props.isLoading ? (
                  <div className="incoming-data__loader-grid">
                    <div className="incoming-data__loader"></div>
                    <Link style={{ color: 'grey' }} onClick={this.stopFetching}>cancel</Link> {/* process */}
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="incoming-data__sbt-btn">
                      <button type="button" 
                      className="source_dark_btn" 
                      onClick={this.onConfirm} disabled={this.state.selectedEvent === undefined}>Next: Filter incoming data</button>
                    </div>

                    {/*<div className="incoming-data__load-btn">
                      <button type="button" 
                      className="get-more-sample" 
                      onClick={this.props.getMoreSamples}>Load More Data</button>
                    </div>*/}

                    {/* this.isSourceFetchEnabled(this.props.source) ? <div className="incoming-data__load-btn">
                      <button type="button" 
                      className="get-more-sample" 
                      onClick={this.fetchSamplesFromSource}>Fetch data from source</button>
                    </div> : null */}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        );
    }
}

export default Incomingdata;