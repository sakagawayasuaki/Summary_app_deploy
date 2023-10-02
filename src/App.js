import "./App.css";
import React, { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import {
  Text,
  Box,
  HStack,
  VStack,
  Center,
  RadioGroup,
  Radio,
  Button,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SliderAccuracy from "./components_ui/SliderAccuracy";
import Sidebar from "./components_ui/Sidebar";
import FileUploadButton from "./components_ui/FileUploadButton";
import FormTitle from "./components_ui/FormTitle";
import FormTime from "./components_ui/FormTime";

// import PostSetting from "./component/PostSetting";
// import SubmitFiles from "./component/SubmitFiles";
// import Downloads from "./component/Download";
import Submit_Setting_Files from "./components_ui/Submit_Setting_Files";

// firebase用で追加
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
//import styles from "./App.module.css";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

export const Mycontext = createContext();
export const Pathcontext = createContext();
export const Videocontext = createContext();
export const Transcriptcontext = createContext();
export const TxtContext = createContext();
export const root = createContext(
  "https://giziroku-fastapi-docker.azurewebsites.net/"
); //http://127.0.0.1:8000///https://giziroku-fastapi-docker.azurewebsites.net
export const Precisioncontext = createContext();

function App() {
  // 各種の状態変数を定義します。これらはコンポーネント内でデータを保持・管理するために使用します。
  const [setting_filename, setSettingfilename] = useState(null);
  const [[summary_path, transcription_path], setResultpath] = useState([]);
  const [videolength, setVideolength] = useState(0);
  const [transcriptiontime, setTranscriptiontime] = useState(0);
  const [txt, setTxt] = useState();
  const url = useContext(root);
  const [precision, setPrecision] = useState("low");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  // const setting_filename="20230829095105_settings.json"
  // UI関連
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const [showFeed, setShowFeed] = useState(false); // 履歴参照ページfeedの切り替え

  // ユーザーのログイン状態を監視します。Firebase 認証サービスから auth オブジェクトを使用して、
  // onAuthStateChanged メソッドを呼び出し、認証状態の変更をリッスンします。このメソッドは、認証状態が変更されるたびに呼び出されるコールバック関数を受け取ります。

  // authUser オブジェクトが存在する場合（ユーザーがログインしている場合）、Redux の login アクションをディスパッチします。
  // authUser オブジェクトから uid, photoURL, displayName を取得して login アクションのパラメータとして渡します。
  // authUser オブジェクトが null の場合（ユーザーがログアウトしているか、未認証の場合）、Redux の logout アクションをディスパッチします。

  // return unsub ：useEffect は、コンポーネントがアンマウントされるときにクリーンアップ関数を返すことができます。
  // この関数は、コンポーネントのアンマウント時に呼び出され、onAuthStateChanged で設定した
  // 認証状態のリスナーを解除（unsubscribe）します。これにより、不要なメモリリークを避けることができます。

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      //認証状態の変更を監視
      if (authUser) {
        dispatch(
          //ログイン状態の変更を監視
          login({
            uid: authUser.uid, //ユーザーの一意のID
            photoUrl: authUser.photoURL, //ユーザーのプロフィール写真
            displayName: authUser.displayName, //ユーザーの表示名
          })
        );
      } else {
        dispatch(logout()); //ログアウト状態の変更を監視
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);

  // components のAuth.js でログイン状態の画面表示。
  // その後、ユーザーログイン状態：user.uidに応じて、異なるコンポーネント:をレンダリング：書き起こし画面のHome表示
  // 書き起こし履歴の画面遷移は、サイドバーの書き起こし履歴をクリックすることで、Feed.jsのshowFeedをtrueにして、画面遷移。戻るでもとに戻る。

  // 認証されたユーザーの場合は、いくつかのコンテキストプロバイダーを使用してコンテキストを子コンポーネントに提供
  // ログイン認証されていないユーザーの場合は、Auth コンポーネントをレンダリングします。

  if (auth.currentUser) {
    const userid = auth.currentUser.uid;
    const email = auth.currentUser.email;
    console.log(`The user's id is ${userid}`);
    console.log(`The user's email is ${email}`);
  }

  return (
    <>
      {user.uid ? (
        <div>
          <ChakraProvider>
            <Box h="48px" bg="#355379"></Box>
            <Sidebar
              isOpen={isOpen}
              toggleSidebar={toggleSidebar}
              setShowFeed={setShowFeed}
            />
            {showFeed ? (
              <Feed setShowFeed={setShowFeed} />
            ) : (
              <Flex
                ml={isOpen ? "200px" : "20px"} // サイドバーが開いている場合のマージンと閉じている場合のマージン
                p="8" // すべての方向に対するパディング
                transition="all 0.3s" // トランジションの効果をすべてのプロパティに0.3秒で適用
                alignItems="center" // 垂直方向の中央寄せ
                justifyContent="center" // 水平方向の中央寄せ
                //width="full" // コンテナの幅をフルスクリーンに設定
                //ml={isOpen ? "200px" : "20px"} // サイドバーが開いている場合のマージンと閉じている場合のマージン
                //p="8" // すべての方向に対するパディング
                //transition="all 0.3s" // トランジションの効果をすべてのプロパティに0.3秒で適用
                //mx="auto"
                //w="full" // コンテナの幅をフルスクリーンに設定。必要に応じてコメントアウトを外す
              >
                <Mycontext.Provider
                  value={[setting_filename, setSettingfilename]}
                >
                  <Pathcontext.Provider
                    value={[[summary_path, transcription_path], setResultpath]}
                  >
                    <Precisioncontext.Provider
                      value={[precision, setPrecision]}
                    >
                      <Videocontext.Provider
                        value={[videolength, setVideolength]}
                      >
                        <Transcriptcontext.Provider
                          value={[transcriptiontime, setTranscriptiontime]}
                        >
                          <TxtContext.Provider value={[txt, setTxt]}>
                            {/*<Downloads />*/}
                            <Box pl="20" width="480px">
                              {" "}
                              {/* このボックスに左のパディング20と幅480pxを設定pl="20" width="480px" * <Box padding="20px" maxW="600px" mx="auto">/}
                              {/* 動画のアップロード処理 */}
                              <Submit_Setting_Files />
                            </Box>
                          </TxtContext.Provider>
                        </Transcriptcontext.Provider>
                      </Videocontext.Provider>
                    </Precisioncontext.Provider>
                  </Pathcontext.Provider>
                </Mycontext.Provider>
              </Flex>
            )}
          </ChakraProvider>
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}

// Appコンポーネントをエクスポートして、他のファイルからインポートできるようにします。
export default App;
