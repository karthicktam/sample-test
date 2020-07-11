const getFilteredTableData = props => {
  return filterData(props);
};

const filterData = props => {
  let {
    items,
  } = props;

  let filteredItems;

  //Add selected flag.
  let selectedFilteredItems = addSelectedFlag(items);

  filteredItems = selectedFilteredItems;
  
  return {
    items: selectedFilteredItems,
    filteredItems,
  };
};

const addSelectedFlag = items => {
  return items.map(item => {
    return { ...item, selected: false };
  });
};

export { getFilteredTableData };
