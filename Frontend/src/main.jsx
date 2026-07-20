import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";
import AuthInitializer from "./components/AuthInitializer";
import { store } from "./redux/store";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
          <AuthInitializer>

              <App />

          </AuthInitializer>

      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);