import React, { useState, useContext, useEffect } from "react";
import {
  Mycontext,
  root,
  Pathcontext,
  Videocontext,
  Transcriptcontext,
  TxtContext,
  Precisioncontext,
} from "../App";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  HStack,
  VStack,
  Center,
  RadioGroup,
  Radio,
  Collapse,
  Flex,
  Spacer,
  extendTheme,
  ChakraProvider,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloudUploadIcon } from "@chakra-ui/icons";
import SliderAccuracy from "./SliderAccuracy";
import SelectFiles from "./SelectFiles";
import FormTitle from "./FormTitle";
import FormTime from "./FormTime";
import FileUploadArea from "./FileUploadArea"; // 20231129 追加
import FormMemberName from "./FormMemberName";
import DL from "../components/DLfirebase";
import { getCurrentUser } from "../components/firebaseUtils"; // 20230923 追加
import axios from "axios";

function Submit_Setting_Files() {
  const url = useContext(root);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [sliderValue, setSliderValue] = useState(0); //書き起こし精度
  const [setting_filename, setSettingfilename] = useContext(Mycontext);
  const [precision, setPrecision] = useContext(Precisioncontext);
  const [resultpath, setResultpath] = useContext(Pathcontext);
  const [videolength] = useContext(Videocontext);
  const [transcriptiontime] = useContext(Transcriptcontext);
  const [txt] = useContext(TxtContext);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const currentUser = getCurrentUser();
  const [isOpenBaseInfo, setIsOpenBaseInfo] = useState(false);
  const toggleCollapse = () => {
    setIsOpenBaseInfo(!isOpenBaseInfo);
  };

  const id = currentUser.id;
  const [fileType, setFileType] = useState(null);
  // カスタマイズされたテーマを作成
  const theme = extendTheme({
    components: {
      Radio: {
        baseStyle: {
          control: {
            fontFamily: "Roboto, sans-serif !important",
            fontSize: "24px !important",
            fontWeight: "300 !important",
          },
        },
      },
    },
  });

  // 条件分岐ページ用
  const [hasStartedTranscription, setHasStartedTranscription] = useState(false);

  // ★ 追加
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  // ファイルのポストとファイルネーム作成、APIのpostパスの作成
  const post_setting_file = async (event) => {
    event.preventDefault();
    const data = {
      title: title,
      date: date,
      participants: members,
      purpose: purpose,
      precision: precision,
    };
    try {
      const response = await axios.post(url + "settings/" + id, data);
      console.log("filename:", response);
      setSettingfilename(response.data);

      // すぐに画面遷移させる
      setHasStartedTranscription(true);

      // バックグラウンドで非同期処理を行う
      post_file(response.data, selectedValue);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  //テキストファイルと動画ファイルのアップロード
  const post_file = async (st_filename, selectedValue) => {
    console.log("setting_filename:", st_filename);
    const URL_getfilename = url + "get_filename/" + st_filename;
    const URL_upload =
      url + "uploadfile/" + id + "/" + selectedValue + "/" + st_filename;
    //const name = someObject?.name;

    const Submit = async () => {
      const formdata = new FormData(); //
      formdata.append("upload_file", txt);

      const response_name = await axios.post(URL_getfilename, formdata); //ファイル名の取得?
      setResultpath(response_name.data);

      console.log(URL_upload);
      const response = await axios.post(URL_upload, formdata, {
        timeout: 600000,
      }); //ファイルのアップロード
      setTranscription(response.data.transcription);
      setSummary(response.data.summary);
    };

    try {
      await Submit();
      alert("要約が完了しました");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleFileSelected = (file) => {
    if (file.type.startsWith("video/")) {
      setFileType("video");
    } else {
      setFileType("other");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      // ドロップされたファイルの処理を行う
      console.log("ドロップされたファイル:", droppedFile);
      if (droppedFile.type.startsWith("video/")) {
        setFileType("video");
      } else {
        setFileType("other");
      }
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <div>
        <Flex direction="column" width="100%" paddingTop="20px">
          {hasStartedTranscription ? (
            // 3. hasStartedTranscriptionがtrueの場合の表示
            <>
              <DL />
              <Center mt="5">
                {/* 1. 戻るボタンの追加 */}
                <Button
                  w="full"
                  alignItems="center"
                  fontSize="xl"
                  backgroundColor="#6FA2DF"
                  color="white"
                  onClick={() => setHasStartedTranscription(false)} // 2. 戻るボタンをクリックしたらhasStartedTranscriptionをfalseに
                >
                  戻る
                </Button>
              </Center>
            </>
          ) : (
            // 3. hasStartedTranscriptionがfalseの場合の表示
            <>
              <Text
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "28px",
                  fontWeight: "600",
                }}
                textAlign="center"
                color="#6FA2DF"
                mb="10px"
              >
                ファイルのアップロード
              </Text>

              <form onSubmit={post_setting_file}>
                <FileUploadArea onFileSelected={handleFileSelected} />

                {fileType === "video" && (
                  <>
                    {/* 書き起こし精度の設定 */}
                    <Text fontSize="xl" color="#6FA2DF" mt="8">
                      文字おこしの精度
                    </Text>
                    <SliderAccuracy
                      sliderValue={sliderValue}
                      setSliderValue={setSliderValue}
                    />
                  </>
                )}
                {/* <p>精度={precision}</p> */}

                {/* 議事録フォーマットの選択 */}
                <Text
                  mt="4"
                  mb="3"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                  textAlign="center"
                  color="#6FA2DF"
                >
                  議事録フォーマットの選択
                </Text>
                <RadioGroup
                  value={selectedValue}
                  onChange={handleChange}
                  ml="1"
                >
                  <VStack spacing={2} display="flex" alignItems="left">
                    <Radio mt="1" value="any">
                      <Text
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        話題別の要約
                      </Text>
                    </Radio>
                    <Radio mt="1" value="all">
                      <Text
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        話題別の要約 + 標準要約
                      </Text>
                    </Radio>
                  </VStack>
                </RadioGroup>
                {/* 基本情報の記入 */}

                <Button
                  onClick={toggleCollapse}
                  leftIcon={<ChevronDownIcon boxSize="8" color="#6FA2DF" />}
                  px="0"
                  pr="3"
                  pl="0"
                  mx="0"
                  mt="3"
                  backgroundColor="white"
                  fontWeight="thin"
                >
                  <Text
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "24px",
                      fontWeight: "600",
                    }}
                    textAlign="center"
                    color="#6FA2DF"
                  >
                    基本情報の記入
                  </Text>
                </Button>

                <Collapse in={isOpenBaseInfo}>
                  <FormTitle
                    inputName="タイトル"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                    content={title}
                    setContent={setTitle}
                  />
                  {/* <p>{title}</p> */}
                  <FormTime inputName="日時" setDate={setDate} />
                  {/* <p>{date}</p> */}
                  <FormMemberName members={members} setMembers={setMembers} />
                  {/* <div>
                              {members.map((member) => {
                                  return (
                                      <li key={member.id}>
                                          {member}
                                      </li>
                                  );
                              })}
                          </div> */}
                  <FormTitle
                    inputName="目的"
                    content={purpose}
                    setContent={setPurpose}
                  />
                  {/* <p>{purpose}</p> */}
                </Collapse>

                {/* 書き起こし開始ボタン */}
                {/* <button type="submit">Submit</button>  */}
                <Center mt="5">
                  <Button
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                    type="submit"
                    w="full"
                    alignItems="center"
                    backgroundColor="#6FA2DF"
                    color="white"
                  >
                    書き起こし・要約スタート
                  </Button>
                </Center>
              </form>
            </>
          )}
        </Flex>
      </div>
    </ChakraProvider>
  );
}

export default Submit_Setting_Files;
