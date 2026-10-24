import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";
import AuthInitializer from "./components/AuthInitializer";
import { store } from "./redux/store";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "106056511607-3ur9q2f2j140fcihrt6hdalr4dp4is62.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
            <AuthInitializer>

                <App />

            </AuthInitializer>

        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);