import React, { Component } from "react";
import IncomingEvent from "./IncomingEvent";
import NoWebHookData from "./NoWebHookData/NoWebHookData";
import { Link } from "react-router-dom";

import Testing from "../../components/cl-map-dropdown/Testing";


class InitialPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: undefined,
      innerScreen: "default",
      search: "", // process from here
      sample: this.props.eventList,
      filteredSample: this.props.eventList,
      showCancel: false,
      selectedKey: "",
      // loadData: false, // process
      pageDecide: false
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

  // onConfirm = () => {
  //   if (Object.keys(this.props.selectedSampleData).length === 0) {
  //     this.props.onNext(this.state.selectedEvent, false);
  //   } else {
  //     // confirmAlert({
  //     //   title: 'Do you want to change the sample data?',
  //     //   message: "Filter and mapping steps required to be updated again",
  //     //   buttons: [
  //     //     {
  //     //       label: "Yes",
  //     //       onClick: () => {
  //     //         this.props.onNext(this.state.selectedEvent, true);
  //     //       }
  //     //     },
  //     //     { label: "No", onClick: () => {} }
  //     //   ],
  //     //   childrenElement: () => <div />,
  //     //   closeOnEscape: false,
  //     //   closeOnClickOutside: false
  //     // })
  //   }
  // }; // newly added

  onConfirm = val => {
    this.setState({
      pageDecide: true
    });
  } // process

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

  selectedValueHandler = key => {
    console.log(key, "keysjhshsssjkjs");
    this.setState({
      selectedKey: key
    });
  } // process

  // loadSampleScreen = () => {
  //   this.setState({
  //     loadData: true
  //   });
  // } // process


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

      let array = [
        {
          title: "Select the default data",
          description: "The default data are the ones which is created by our system",
          buttonText: "Select the default data"
        },
        {
          title: "Pull data from facebook",
          description: "Take the data you need to pull from facebook",
          buttonText: "Pull data from facebook"
        }
      ];

        return (
            !this.state.pageDecide
              ?
                <React.Fragment>
                  { array.map(data => (
                      <div>
                        <div>
                          <p>{data.title}</p>
                          <p>{data.description}</p>
                        </div>

                        <div className="incoming-data__sbt-btn">
                          <button 
                            type="button" 
                            className="source_dark_btn" 
                            onClick={() => this.onConfirm(data.buttonText)} 
                          >{data.buttonText}</button>
                        </div>
                      </div>
                    ))
                  }

                  <div>
                    <div>
                      <p>Triger live data</p>
                      <p>Send the data to this belw webhook URL to trigger</p>
                      <span>https://customerlabs.co</span>
                    </div>

                    <div className="incoming-data__sbt-btn">
                      <button 
                        type="button" 
                        className="source_dark_btn" 
                        onClick={() => this.onConfirm("Triger live data")} 
                      >Triger live data</button>
                    </div>
                  </div>
              </React.Fragment>
            :
              <React.Fragment>
                <div>
                  <Testing
                    listData={this.props.productList}
                    value={this.state.selectedKey}
                    name="Select a product"
                    className="boxshadow__searchsearchbox"
                    onChange={this.selectedValueHandler}
                    // selectedProperty={this.props.selectedProperty} // newly added
                  />
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

                  <span style={{fontSize: '3em'}}>
                    <img
                      src="../../assets/icons/filter.svg"
                      alt="Filter"
                      style={{height: "100px"}}
                    />
                    {/*<i className="fas fa-sort-alpha-down"></i>*/}
                  </span>
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
            </React.Fragment>
        );
    }
}

export default InitialPage;