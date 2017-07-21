import React from 'react';
import ReactDOM from 'react-dom';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import Root from './root';
import routes from './routes';

const store = configureStore();

const render = routes => {
  ReactDOM.render(
    <AppContainer>
      <Fabric>
        <Provider store={store}>
          <Root routes={routes} />
        </Provider>
      </Fabric>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default;
    render(nextRoutes);
  });
}
