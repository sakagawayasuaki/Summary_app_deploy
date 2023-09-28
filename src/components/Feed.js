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
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
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

  /*
  // ファイルのアップロード処理を行う関数
  const handleUpload = async () => {
    // 選択されたファイルを取得
    const file = fileInputRef.current?.files?.[0];

    // 選択されたファイルが存在し、ユーザーがログインしている場合にアップロード処理を実行
    if (file && auth.currentUser) {
      // Firebase Storageへの参照を作成
      const storageRef = storage.ref(
        `files/${auth.currentUser.uid}/${file.name}`
      );

      // ファイルをFirebase Storageにアップロード
      await storageRef.put(file);
      alert("File uploaded successfully");
    }
  };
  */

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

  console.log("Filtered file list:", filteredFileList);

  const fileGroups = groupFilesByDate(filteredFileList);
  console.log("Grouped files by date:", fileGroups);
  console.log("Name search query:", nameSearchQuery);
  console.log("Date search query:", dateSearchQuery);

  console.log(
    "Converted date query:",
    new Date(dateSearchQuery).toISOString().slice(0, 10).replace(/-/g, "")
  );

  const fileGroupKeys = fileGroups ? Object.keys(fileGroups) : [];

  //<Box padding="20px" maxW="1000px" mx="auto">
  return (
    <Box padding="20px" maxW="600px" mx="auto">
      <section>
        <Text fontSize="2xl" fontWeight="bold" mb="8">
          書き起こし履歴：マイファイル参照
        </Text>
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
                      icon={<DownloadIcon />}
                      size="sm"
                      fontSize="sm"
                      onClick={() => handleDownload(fileName)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </section>

      <Box my="4">
        <Button fontSize="sm" mb="10" onClick={() => setShowFeed(false)}>
          戻る
        </Button>
      </Box>
    </Box>
  );
};

export default Feed;
