import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './index.css';

import { store } from './app/store';
import { getItems } from './slices/itemsSlice';
import { getNotifications } from './slices/notificationsSlice';

import { back4appApi } from './services/back4Dataservice';

import Parse from 'parse/dist/parse.min.js';

Parse.initialize('gyK4yLMJ7Vkdxl10WEuLToXTqtUYiumw8UqPxTmQ', 'Y2Jq1AYuOe08rQbA8rbB3atRQnSEInRgFEFMRGLM');

Parse.serverURL = 'https://parseapi.back4app.com/';

// let query = new Parse.Query('Person');
// let subscription = await query.subscribe();

// subscription.on('open', () => {
//   console.log('subscription opened');
//  });

window.api = back4appApi();

async function fetchItemBeforeRender() {

  await store.dispatch(getItems());

  // await store.dispatch(getNotifications());

  const container = document.getElementById('root');

  if (container) {
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>,
    );
  } else {
    throw new Error(
      'Root element with ID \'root\' was not found in the document. Ensure there is a corresponding HTML element with the ID \'root\' in your HTML file.',
    );
  }
}

fetchItemBeforeRender();
