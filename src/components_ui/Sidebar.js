// 20230917 サイドバーにfirebaseに保存しているファイルを取得する機能を追加
import React, { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { auth, storage } from "../firebase";
import { fetchFiles, downloadFile } from "../components/firebaseUtils"; // 20230923 追加

const extractDateFromFileName = (fileName) => {
  const regex = /summary_(\d{8})/;
  const match = fileName.match(regex);

  return match ? match[1] : null;
};
const groupFilesByDate = (fileList) => {
  const grouped = fileList.reduce((acc, fileName) => {
    const date = extractDateFromFileName(fileName);
    if (date) {
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(fileName);
    }
    return acc;
  }, {});
  console.log("Grouped files by date:", grouped);
  return grouped;
};

function Sidebar({ isOpen, toggleSidebar, setShowFeed }) {
  // ファイル名の読み取り機能を追加 20230917
  const [isFileListVisible, setIsFileListVisible] = useState(false);
  //const [showFeed, setShowFeed] = useState(false);
  const userId = auth.currentUser.uid;
  const [expandedDate, setExpandedDate] = useState(null);

  // ログインユーザーのファイル一覧を取得する関数
  const [fileList, setFileList] = useState([]);
  // ファイルリストを日付ごとにグループ化する関数を再利用
  //console.log("File groups to be mapped:", fileGroups);
  const fileGroups = groupFilesByDate(fileList);

  useEffect(() => {
    fetchFiles(setFileList); // fetchFilesを使用
  }, []);

  // ファイルのダウンロード処理を行う関数
  const handleDownload = async (fileName) => {
    downloadFile(`/static/${userId}/result/summary/${fileName}`);
  };

  return (
    <Box
      as="nav"
      pos="fixed"
      left={isOpen ? 0 : -180}
      top="48px"
      bottom={0}
      width="200px"
      bg="#212F40"
      p={4}
      transition="all 0.3s"
      overflowY="auto"
      boxShadow="md"
    >
      <Button
        colorScheme="brand"
        onClick={toggleSidebar}
        position="absolute"
        top="5px"
        right="-10px"
        size="sm"
        variant="ghost"
        width="40px"
      >
        {isOpen ? (
          <ChevronLeftIcon boxSize={5} color="white" />
        ) : (
          <ChevronRightIcon boxSize={5} color="white" />
        )}
      </Button>
      {/* ここに他のサイドバーの内容を追加できます */}
      <Box>
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          プロフィール
        </Text>
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          アカウント設定
        </Text>

        {/* 20230917追加 ログアウト機能*/}
        <Text
          mt={2} // 適切なマージンを設定して、ボタンが他の要素から適切な距離を保つようにします
          fontSize="16px"
          color="#F9FAF6"
          onClick={() => auth.signOut()} // ログアウト処理を行う関数を呼び出します
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1} // パディングを追加してテキスト周りにスペースを作ります
          //borderRadius="md" // 丸みを帯びたボーダーを追加しま
        >
          ログアウト
        </Text>
      </Box>

      <Box mt="100px">
        <Text
          fontSize="16px"
          color="#F9FAF6"
          mt="2"
          onClick={() => setShowFeed(true)}
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1} // パディングを追加してテキスト周りにスペースを作ります
        >
          書き起こし履歴
        </Text>
      </Box>

      {/* 20230917追加 ファイル履歴 */}
      <Box mt="2px">
        {Object.keys(fileGroups).map((date) => (
          <Box key={date}>
            <Text
              fontSize="14px"
              color="#F9FAF6"
              mt="1"
              ml="1"
              onClick={() =>
                setExpandedDate(expandedDate === date ? null : date)
              }
              _hover={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {date}
            </Text>
            {expandedDate === date &&
              fileGroups[date].map((fileName) => (
                <Box display="flex" ml="0" mt="1" alignItems="center">
                  <Text fontSize="12px" color="#F9FAF6" mr="2">
                    ・
                  </Text>
                  <Text
                    key={fileName}
                    fontSize="12px"
                    color="#F9FAF6"
                    onClick={() => handleDownload(fileName)}
                    _hover={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {fileName}
                  </Text>
                </Box>
              ))}
          </Box>
        ))}
      </Box>
      <Box position="absolute" bottom="40px">
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          アプリの使い方
        </Text>
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          ヘルプ
        </Text>
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          問い合わせ
        </Text>
        <Text fontSize="16px" color="#F9FAF6" mt="2">
          運営会社
        </Text>
      </Box>
    </Box>
  );
}

export default Sidebar;
