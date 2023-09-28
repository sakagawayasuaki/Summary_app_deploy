//  reportWebVitals ウェブアプリケーションのパフォーマンスを計測するために使用

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Cumulative Layout Shift（累積レイアウトシフト）を計測します。
      getFID(onPerfEntry); // First Input Delay（最初の入力遅延）を計測します。
      getFCP(onPerfEntry); // First Contentful Paint（最初のコンテンツフルペイント）を計測します。
      getLCP(onPerfEntry); // Largest Contentful Paint（最大コンテンツフルペイント）を計測します
      getTTFB(onPerfEntry); // Time to First Byte（最初のバイトまでの時間）を計測します。
    });
  }
};

export default reportWebVitals;
