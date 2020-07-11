import _ from "lodash";
import { updateBroswerURL } from "../../utils/PropsCallbacks";

const getFilteredTableData = props => {
  return filterData(props);
};

const filterData = props => {
  let {
    items,
    searchWord,
    defaultPerPage,
    defaultPage,
    pagination,
    paginationOptions
  } = props;

  let filteredItems;
  searchWord = searchWord ? searchWord : "";

  let rowsPerPage = defaultPerPage || paginationOptions[0];
  let currentPage = defaultPage || 1;
  //Calculate total pages.
  let totalPages = Math.floor(items.length / rowsPerPage);
  if (items.length % rowsPerPage !== 0) {
    totalPages++;
  }
  //Add selected flag.
  let selectedFilteredItems = addSelectedFlag(items);

  //Search
  if (searchWord !== "") {
    filteredItems = filterItemsBySearch(searchWord, selectedFilteredItems);
  }
  //Pagination
  else {
    if (pagination) {
      let items = _.cloneDeep(selectedFilteredItems);
      let itemStart = (currentPage - 1) * rowsPerPage;
      let itemEnd = itemStart + rowsPerPage;
      filteredItems = items.slice(itemStart, itemEnd);
    }
  }
  updateTableURL(props.history, searchWord, rowsPerPage, currentPage);
  console.log("filteredItemsfilteredItems", filteredItems, "selectedFilteredItemsselectedFilteredItems", selectedFilteredItems);
  return {
    items: selectedFilteredItems,
    filteredItems,
    searchWord,
    pagination,
    paginationOptions,
    pageIndex: currentPage - 1,
    selectedPaginationOption: rowsPerPage,
    totalPages
  };
};

const addSelectedFlag = items => {
  return items.map(item => {
    return { ...item, selected: false };
  });
};

const filterItemsBySearch = (searchWord, items) => {
  let clonedItems = _.cloneDeep(items);
  let filteredItems = [];
  clonedItems.forEach(item => {
    Object.keys(item).every(key => {
      if (typeof item[key] === "string") {
        if (item[key].indexOf(searchWord) > -1) {
          filteredItems.push(item);
          return false;
        }
      }
      return true;
    });
  });
  return filteredItems;
};

const updateTableURL = (history, searchWord, perPage, currentPage) => {
  var searchObj = {
    search: {
      page: currentPage,
      per_page: perPage
    }
  };
  if (searchWord && searchWord !== "") {
    searchObj["search"] = {
      search: searchWord
    };
  }
  updateBroswerURL(history, searchObj);
};

export { getFilteredTableData };
