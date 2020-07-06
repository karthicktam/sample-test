import React, { Component } from "react";

import IncomingData from "./components/IncomingData";

class ConfigSample extends Component {
    render() {

        // if (this.props.sampleRecords.length > 0)
        let eventList = [
            { title: "Need for speed",
              description: "default sample data",
              tags: ["new", "old"],
              data: {person: "vicky"}
            },
            { title: "sample data",
              description: "default sample data other",
              tags: ["person", "newPerson"],
              data: {age: 30}
            }
          ];

        let sampleRecords = eventList;

        return (
            <IncomingData 
                // sampleRecords={this.props.sampleRecords}
                sampleRecords={sampleRecords}
                eventList={eventList}
                // onNext={this.onNext} 
                // eventList={this.formatDate()} 
                // isLoading={this.props.fetchSample} 
                // getSampleFromSource={this.getSampleFromSource} 
                // getMoreSamples={this.getMoreSamples} 
                // selectedSampleData={this.props.selectedSampleData} 
                // source={this.props.match.params.source_id}
                // onToggleFetchSampleLoader={this.props.onToggleFetchSampleLoader} // process
            />
        );
    }
}

export default ConfigSample;