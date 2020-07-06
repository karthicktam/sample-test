import React from "react";

export function renderFriend(option) {
  
    return ( 
      <React.Fragment>
        <span>{option.value}</span>
        <span style={{ fontStyle: 'italic', color: 'gray', float: 'right' }}>{option.name}</span>
      </React.Fragment>
    );
} // newly added

export function renderFriendNew(option) {
  
  return ( 
    <React.Fragment>
      <span>{option.value}</span>
      <span style={{ fontStyle: 'italic', color: 'gray', float: 'right' }}>{option.show}</span>
    </React.Fragment>
  );
} // test test


export function renderFriendWithoutValue(option) {
  
  return ( 
    <React.Fragment>
      <span>{option.name}</span>
    </React.Fragment>
  );
} // newly added

export const fuse = {
  keys: ['name', 'value', 'show'],
  threshold: 0.3,
};  


export function renderFontOption(props, { stack, name, value }, snapshot, className) {

  return (
      <button {...props} className={className} type="button">
          <span>{name}</span><span style={{ fontFamily: 'italic', color: 'gray', float: 'right' }}>{value}</span>
      </button>
  );
} //newly added

export  function renderFriendNewVersion(props, option, snapshot, className) {

  return (
      <button {...props} className={className} type="button">
        <span>{option.name}</span><span style={{ fontFamily: 'italic', color: 'gray', float: 'right' }}>{option.value}</span>
      </button>
  );
} // newly added