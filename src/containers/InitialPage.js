import React, { Component } from "react";

class InitialPage extends Component {

    render() {
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
                          onClick={this.onConfirm} 
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
                      onClick={this.onConfirm} 
                    >Triger live data</button>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default InitialPage;