import React, { useState, useEffect, useRef } from "react";
import { auth, storage } from "../firebase";
import {
  Box,
  Text,
  Button,
  IconButton,
  Input,
  VStack,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";

const Feed = ({ setShowFeed }) => {
  // const fileInputRef = useRef(null);
  // ユーザーのファイル一覧を保存するためのstate
  const [fileList, setFileList] = useState([]);
  // ユーザーが選択したファイルを保存するためのstate
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = auth.currentUser.uid;
  const [expandedDate, setExpandedDate] = useState(null);

  const [dateSearchQuery, setDateSearchQuery] = useState(null);
  const [nameSearchQuery, setNameSearchQuery] = useState("");

  // 画面表示
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [encoding, setEncoding] = useState("UTF-8"); // 初期エンコーディングをUTF-8とする
  const [uint8Array, setUint8Array] = useState(null); // 追加: バイナリデータを保持するステート

  useEffect(() => {
    // ログインユーザーのファイル一覧を取得する関数
    const fetchFiles = async () => {
      if (auth.currentUser) {
        const filesRef = storage.ref(`/static/${userId}/result/summary`);
        const snapshots = await filesRef.listAll();
        const fileName = snapshots.items
          ? snapshots.items.map((item) => item.name)
          : [];
        console.log("Fetched files:", fileName); // この行を追加
        setFileList(fileName);
      }
    };

    fetchFiles();
  }, []);

  // ファイル名から日付を取得する関数
  const extractDateFromFileName = (fileName) => {
    const regex = /summary_(\d{8})/;
    const match = fileName.match(regex);
    return match ? match[1] : null;
  };

  // ファイルリストを日付ごとにグループ化する関数

  const groupFilesByDate = (fileList) => {
    if (!fileList) return {};
    return fileList.reduce((acc, fileName) => {
      const date = extractDateFromFileName(fileName);
      console.log("Fetched file names:", fileName);
      if (date) {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(fileName);
        // ここで各日付のファイル名をソートします
        acc[date].sort((a, b) => b.localeCompare(a)); // 例: アルファベット順で降順にソート
      }
      return acc;
    }, {});
  };

  const customStyles = {
    input: (provided) => ({
      ...provided,
      height: "100%", // テキストボックスの高さに合わせる
      width: "250px", // DatePickerの幅を指定
    }),
  };

  // ファイルのダウンロード処理を行う関数
  const handleDownload = async (fileName) => {
    // ユーザーがログインしている場合にダウンロード処理を実行
    if (auth.currentUser) {
      // Firebase Storageからの参照を作成
      const storageRef = storage.ref(
        `/static/${userId}/result/summary/${fileName}`
      );

      // ファイルのダウンロードURLを取得
      const url = await storageRef.getDownloadURL();

      // 新しいタブでダウンロードURLを開く
      window.open(url, "_blank");
    }
  };

  // ファイルのダウンロード処理を行う関数を変更して、選択されたファイルのみをダウンロード
  const handleDownloadSelected = async () => {
    for (const fileName of selectedFiles) {
      await handleDownload(fileName);
    }
  };

  // 選択されたファイルの変更をハンドルする関数
  const handleFileCheckChange = (fileName, isChecked) => {
    setSelectedFiles((prev) =>
      isChecked ? [...prev, fileName] : prev.filter((name) => name !== fileName)
    );
  };

  console.log("Original file list:", fileList);
  // フィルタリングされたファイルリストの定義
  const filteredFileList = fileList.filter((fileName) => {
    const dateFromFileName = extractDateFromFileName(fileName);

    const matchesNameQuery =
      !nameSearchQuery ||
      fileName.toLowerCase().includes(nameSearchQuery.toLowerCase());

    const matchesDateQuery =
      dateFromFileName && dateSearchQuery
        ? dateFromFileName.includes(
            new Date(new Date(dateSearchQuery).getTime() + 9 * 60 * 60 * 1000) // Add 9 hours for JST (UTC+09:00)
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, "")
          )
        : true;

    return matchesNameQuery && matchesDateQuery;
  });

  //画面表示関数
  const handleFilePreview = async (fileName) => {
    if (auth.currentUser) {
      const storageRef = storage.ref(
        `/static/${userId}/result/summary/${fileName}`
      );
      const url = await storageRef.getDownloadURL();

      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const binary = event.target.result;
            const uint8Array = new Uint8Array(binary);
            setUint8Array(uint8Array); // バイナリデータをステートにセット

            try {
              const text = new TextDecoder(encoding).decode(uint8Array);
              setFileContent(text);
              setIsModalOpen(true);
            } catch (e) {
              console.error(`Failed to decode as ${encoding}:`, e);
              // エラーハンドリング（例：ユーザーにエラーメッセージを表示）
            }
          };
          reader.readAsArrayBuffer(blob);
        })
        .catch((error) => {
          console.error("Error during file preview:", error);
          // Handle the error appropriately
        });
    }
  };

  const toggleEncoding = () => {
    setEncoding((prevEncoding) =>
      prevEncoding === "UTF-8" ? "Shift_JIS" : "UTF-8"
    );
  };

  // エンコーディングが変更されたときに再デコード
  useEffect(() => {
    if (uint8Array) {
      try {
        const text = new TextDecoder(encoding).decode(uint8Array);
        setFileContent(text);
      } catch (e) {
        console.error(`Failed to decode as ${encoding}:`, e);
      }
    }
  }, [encoding, uint8Array]);

  console.log("Filtered file list:", filteredFileList);

  const fileGroups = groupFilesByDate(filteredFileList);
  console.log("Grouped files by date:", fileGroups);
  console.log("Name search query:", nameSearchQuery);
  console.log("Date search query:", dateSearchQuery);

  console.log(
    "Converted date query:",
    new Date(dateSearchQuery).toISOString().slice(0, 10).replace(/-/g, "")
  );

  const fileGroupKeys = fileGroups
    ? Object.keys(fileGroups).sort((a, b) => b - a)
    : [];

  //<Box padding="20px" maxW="1000px" mx="auto">
  return (
    <Box padding="20px" maxW="600px" mx="auto">
      <section>
        {/* Flex container to align items horizontally */}
        <Flex justifyContent="space-between" alignItems="center" mb="8">
          <Text fontSize="2xl" fontWeight="bold">
            書き起こし履歴：マイファイル参照
          </Text>
          {/* 戻るボタン */}
          <Button fontSize="sm" onClick={() => setShowFeed(false)}>
            戻る
          </Button>
        </Flex>
        {/* 検索フィールドを横並びにするFlexコンテナ */}
        <Box display="flex" justifyContent="space-between" mb="5">
          {/* 日付検索用のカレンダーUI */}
          <DatePicker
            selected={dateSearchQuery ? new Date(dateSearchQuery) : null}
            onChange={(date) => {
              if (date instanceof Date && !isNaN(date)) {
                setDateSearchQuery(date.toISOString());
              } else {
                setDateSearchQuery(null);
              }
            }}
            placeholderText="日付で検索"
            dateFormat="yyyyMMdd"
            isClearable
            customInput={
              <Input
                height="2.5rem" // これで高さを指定します。必要に応じて調整してください。
                borderRadius="md" // 他のInputと同じボーダーラウンドを適用
                width="150px" // ここでカレンダーのInputの幅を指定
              />
            }
          />
          {/* ファイル名検索用のインプット */}
          <Input
            placeholder="ファイル名で検索"
            value={nameSearchQuery}
            onChange={(e) => setNameSearchQuery(e.target.value)}
            width="400px"
          />
        </Box>
        <Box display="flex">
          <VStack spacing={4} alignItems="start">
            {fileGroupKeys.map((date) => (
              <Text
                key={date}
                fontSize="lg" // Adjusted font size
                //fontWeight="bold"
                onClick={() =>
                  setExpandedDate(expandedDate === date ? null : date)
                }
                cursor="pointer"
              >
                {date}
              </Text>
            ))}
          </VStack>
          <Box flex="1" ml="4">
            {expandedDate && fileGroups[expandedDate] && (
              <Box>
                {fileGroups[expandedDate].map((fileName) => (
                  <Box key={fileName} display="flex" alignItems="center" mb="2">
                    <Text
                      fontSize="sm" // Adjusted font size
                      flex="1"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      mr="-60"
                    >
                      {fileName}
                    </Text>
                    <Spacer />{" "}
                    {/* この行を追加して、アイコンを右端に押し出します */}
                    <IconButton
                      icon={<ViewIcon />}
                      size="sm"
                      fontSize="sm"
                      onClick={() => handleFilePreview(fileName)}
                      mr="2"
                    />
                    <IconButton
                      icon={<DownloadIcon />}
                      size="sm"
                      fontSize="sm"
                      onClick={() => handleDownload(fileName)}
                      mr="2" // <- これを追加して、スペースを確保します
                    />
                    {/* この部分の後ろ... */}
                    <Box my="4">
                      <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                      >
                        <ModalOverlay />
                        <ModalContent width="100%" maxW="80%" height="80%">
                          <ModalHeader>File Preview</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            {/* エンコーディングを切り替えるUI */}
                            <Button onClick={toggleEncoding} mb="5">
                              Switch Encoding (
                              {encoding === "UTF-8" ? "Shift_JIS" : "UTF-8"})
                            </Button>
                            <Textarea
                              value={fileContent}
                              isReadOnly
                              w="100%"
                              h="600px"
                            />
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </section>
    </Box>
  );
};

export default Feed;
