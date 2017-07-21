import { combineReducers } from 'redux';
import {
  ActiveVideoReducer,
} from './container/ActiveVideo';
import {
  CourseLibraryReducer,
} from './container/CourseLibrary';
import {
  LessonLibraryReducer,
} from './container/LessonLibrary';

import {SidebarReducer} from './layouts/CommandBars/ActiveVideo/sidebarReducer';

export const reducer = combineReducers({
  activeVideo: ActiveVideoReducer,
  courseLibrary: CourseLibraryReducer,
  lessonLibrary: LessonLibraryReducer,
    SidebarReducer: SidebarReducer
});

export default reducer;
