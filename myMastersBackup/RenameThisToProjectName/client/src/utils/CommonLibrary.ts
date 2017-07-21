export function getFilteredList (originalList, searchTerm) {
  if (!(searchTerm === undefined || searchTerm === '')) {
    return originalList.filter((item) => {
      return item.Name.toLowerCase().search(
        searchTerm.toLowerCase()) !== -1;
    });
  } else {
    return originalList;
  }
}
