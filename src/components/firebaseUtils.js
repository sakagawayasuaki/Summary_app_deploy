import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";

// ファイルをダウンロードする関数
export const downloadFile = async (path) => {
  if (firebase.auth().currentUser) {
    // v8では、このようにrefを取得する
    const storageRef = firebase.storage().ref(path);
    const url = await storageRef.getDownloadURL();
    window.open(url, "_blank");
  }
};

// ログインしているユーザーのファイル一覧を取得する関数
export const fetchFiles = async (setFileList) => {
  if (firebase.auth().currentUser) {
    const filesRef = firebase
      .storage()
      .ref(`/static/${firebase.auth().currentUser.uid}/result/summary`);
    const snapshots = await filesRef.listAll();
    const fileNames = snapshots.items.map((item) => item.name);
    setFileList(fileNames);
  }
};

// ダウンロードURLを取得する関数
export const getFirebaseDownloadURL = async (path) => {
  // v8では、このようにrefを取得する
  const storageRef = firebase.storage().ref(path);
  return await storageRef.getDownloadURL();
};

// ログイン中のユーザー情報を取得する関数
export const getCurrentUser = () => {
  if (firebase.auth().currentUser) {
    return {
      id: firebase.auth().currentUser.uid,
      email: firebase.auth().currentUser.email,
    };
  }
  return null;
};
