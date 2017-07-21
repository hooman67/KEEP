import { createSelector } from 'reselect';
import { getFilteredList } from '../../utils/CommonLibrary';

const getCourseLibraryList = state => state.courseLibrary.courseLibraryList;
const getSearchTerm = state => state.courseLibrary.searchTerm;

const getCourseLibraryFilter =
(getCourseLibraryList, getSearchTerm) => getFilteredList(getCourseLibraryList, getSearchTerm);


export const courseLibrarySelector = createSelector(
    getCourseLibraryList,
    getSearchTerm,
    getCourseLibraryFilter,
);
