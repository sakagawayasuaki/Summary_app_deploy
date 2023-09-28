import "./index.css";
import React from "react";
import ReactDOM from "react-dom"; // React の DOM レンダラーです。
import App from "./App"; // App コンポーネント：アプリケーションのメインコンポーネントです。
import { Provider } from "react-redux"; // Redux store を React アプリケーションに統合します。
import { store } from "./app/store"; //Redux storeをインポートしています。アプリケーションの状態を管理
import reportWebVitals from "./reportWebVitals";

// HTML ドキュメント内の <div id=root></div> を持つ要素を取得し、それを React のルート要素として設定します。
// App.js で定義されている App コンポーネントをレンダリングします。
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root") // ここで直接要素を取得して渡します
);

// Web Vitalsを利用してアプリケーションのパフォーマンスを計測します
reportWebVitals();
