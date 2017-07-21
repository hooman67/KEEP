import { createSelector } from 'reselect';
import { getFilteredList } from '../../utils/CommonLibrary';

const getLessonLibraryList = state => state.lessonLibrary.courseLessons;
const getSearchTerm = state => state.lessonLibrary.searchTerm;

const getLessonLibraryFilter =
(getLessonLibraryList, getSearchTerm) => getFilteredList(getLessonLibraryList, getSearchTerm);

export const lessonLibrarySelector = createSelector(
    getLessonLibraryList,
    getSearchTerm,
    getLessonLibraryFilter,
);
