import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
  App,
} from './container/App';
import {
  ActiveVideo,
} from './container/ActiveVideo';
import {
  CourseLibrary,
} from './container/CourseLibrary';
import {
  LessonLibrary,
} from './container/LessonLibrary';
import {
  LessonCreator,
} from './container/LessonCreator';

export const routes = () => {
  return (
    <Route path='/' component={App}>
      <IndexRoute components={CourseLibrary}/>
      <Route path='course/:id' component={LessonLibrary}/>
      <Route path='lesson/:id' component={ActiveVideo}/>
      <Route path='createLesson' component={LessonCreator}/>
    </Route>
  );
};

export default routes;
