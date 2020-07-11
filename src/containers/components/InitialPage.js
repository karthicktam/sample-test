import React, { Component } from "react";
import IncomingEvent from "./IncomingEvent";
import NoWebHookData from "./NoWebHookData/NoWebHookData";
import { Link } from "react-router-dom";
import Table from "../../components/cl-table-fb/Table";

class Facebook extends Component {
  constructor(props){
    super(props);
    this.state = {
      active_columns: [
        {
          name: "Form Name",
          field: "name",
          sortable: true,
          showColumn: true,
          // columnType: "link",
          disabled: true,
          "text-overflow": "ellipsis",
          "white-space": "nowrap",
          overflow: "hidden",
          colWidth: { width: "890px", pwidth: "160px" }
        },
        {
          name: "Action",
          field: "Apply this form",
          columnType: "link",
          disabled: true,
          showColumn: true,
          callback: this.fetchFb,
          "text-overflow": "ellipsis",
          "white-space": "nowrap",
          overflow: "hidden",
          // colWidth: { width: "890px", pwidth: "160px" }
        }
      ]
    }
  };

  fetchFb = (formId) => {
    console.log("formIdformIdformId", formId);
    this.props.fetchFacebookSample(formId);
  }
 
  render() {
    return (
      <React.Fragment>
        <div className="source-section_heading">
          <h1 className="incoming-section_heading__h1">Fetching samples from Facebook 
            <div className="incoming-data__load-btn" style={{display: "inline-block", "float": "right"}}>
              <button type="button" className="get-more-sample" onClick={this.props.cancel}>Stop Fetching</button>
            </div>
          </h1>
          <h1 className="incoming-section_heading__p">
              Select any one of the form to fetch sample data
          </h1>
        </div>
        <div>
        { this.props.isLoading ? (
                  <div className="incoming-data__loader-grid">
                    <div className="incoming-data__loader"></div>
                  </div>
          ) : ( 
            <div>
              <Table
                columns={this.state.active_columns}
                items={this.props.data}
                onRefresh={this.onRefresh}
                searchable={false}
                refreshable={false}
                selectedTab={this.props.selectedTab} // new
              />
              {/*this.props.data.map(form => (
                <div className="incoming-event">
                  <label
                    style={{ width: "100%", cursor: "pointer" }}
                    htmlFor={`incoming${form["name"]}`}
                  >
                    <div className="incoming-event__flex">
                      <div className="incoming-event__inner-flex">
                        <div className="incoming-event__radio-section">
                          {/* <span className="incoming-event__radio"></span>
                        </div>
                        <div>
                          <h4>{form["name"]}</h4>
                        </div>
                      </div>
                      <div className="incoming-event__view-json">
                        <Link onClick={() => { this.props.fetchFacebookSample(form["id"])} }>Fetch data from this form</Link>
                      </div>
                    </div>
                  </label>
                </div>
              ))*/}
            </div>
          ) 
        }
        </div>
    </React.Fragment>
    );
  }
}

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
      pageDecide: false,
      errorDecide: "",
      loadDataEnable: false,
      data: [
        {name: "vendata", id: "7393892nsmnxnmn"},
        {name: "conman", id: "37sjhusjskjmm"},
      ]
    };

    this.filterList = this.filterList.bind(this);
    this.onChange = this.onChange.bind(this); // process
  }

  getSelectedEvent = event => {
    this.setState({ selectedEvent: event });
  };

  fetchSamplesFromSource = () => {
    this.setState({innerScreen: this.props.source});
    this.props.getSampleFromSource();
  }

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

  onConfirmHandler = val => {
    if (val === "Triger live data") {
      this.setState({
        loadDataEnable: true
      });
    } else {
      this.setState({
        loadDataEnable: false
      });
    }

    if (val === "Pull data from facebook") {
      this.setState({innerScreen: this.props.source});
    }

    this.setState({
      pageDecide: true,
      errorDecide: val
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

  showInitialScreenHandler = () => {
    this.setState({
      pageDecide: false
    });
  } // process

  onCancel = () => {
    this.setState({
      innerScreen: "default"
    })
  }

  sourceBaseScreen = (source) => {
    switch(source){
      case "facebook":
        return <Facebook 
                  // data={this.props.facebookForms} 
                  data={this.state.data}
                  pagination={this.props.pagination} 
                  isLoading={this.props.isLoading} 
                  cancel={this.onCancel} 
                  fetchFacebookSample={this.fetchSampleFromFacebook}
                />
      default:
        return null
    }
  }

  fetchSampleFromFacebook = (form_id) => {
    this.setState({innerScreen: "default"})
    // this.props.onToggleFetchSampleLoader(true);
    // this.props.onFetchSampleFromFB(form_id);
    // this.props.getMoreSamples();
  }

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
                        errorDecide={this.state.errorDecide}
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
        },
        {
          title: "Triger live data",
          description: "Send the data to this belw webhook URL to trigger",
          buttonText: "Triger live data"
        }
      ];

        return (
            !this.state.pageDecide
              ?
                <React.Fragment>
                  { array.map(data => (
                      <div key={data.buttonText}>
                        <div>
                          <p>{data.title}</p>
                          <p>{data.description}</p>
                          {this.props.textUrl
                            ?
                              <span>{this.props.textUrl}</span>
                            :
                              null
                          }
                        </div>

                        <div className="incoming-data__sbt-btn">
                          <button 
                            type="button" 
                            className="source_dark_btn" 
                            onClick={() => this.onConfirmHandler(data.buttonText)} 
                          >{data.buttonText}</button>
                        </div>
                      </div>
                    ))
                  }
              </React.Fragment>
            :
              <React.Fragment>
                <div>
                  <div className="incoming-event__view-json">
                    <Link onClick={this.showInitialScreenHandler}>Choose another sample data</Link>
                  </div>
                </div>
                
                { this.state.innerScreen === "default" 
                    ?
                      <React.Fragment>
                        <div className="source-section_action">
                          <div className="source-section_action_dropdown">
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

                        {this.state.loadDataEnable
                            ?
                              <div className="incoming-data__sbt-btn">
                                <button type="button" 
                                className="source_dark_btn" 
                                onClick={this.onConfirm}>Load more data</button>
                              </div>
                            :
                              null
                        }

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
                                  <button 
                                    type="button"
                                    className="source_dark_btn" 
                                    onClick={this.onConfirm} 
                                    disabled={this.state.selectedEvent === undefined}
                                  >Next: Filter incoming data</button>
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
                    :
                      this.sourceBaseScreen("facebook")
                  }      
            </React.Fragment>
        );
    }
}

export default InitialPage;