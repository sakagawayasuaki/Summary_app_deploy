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

  // ゲストユーザーかどうかを判断
  const isGuestUser = userId === "neqj1hQ76lWY5PUF1JExPzgmYyQ2"; // 例: ゲストユーザーのIDが "guest" の場合

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
      style={{ zIndex: 1000 }}
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
        <Text
          fontSize="18px"
          color="#FFFFFF"
          onClick={() => setShowFeed(false)}
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          ホーム
        </Text>

        <Text
          fontSize="18px"
          color="#FFFFFF"
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          アカウント
        </Text>

        {/* 20230917追加 ログアウト機能*/}
        <Text
          fontSize="18px"
          color="#FFFFFF"
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          設定・カスタム
        </Text>

        {/* 20230917追加 ログアウト機能*/}
        <Text
          fontSize="18px"
          color="#FFFFFF"
          onClick={() => auth.signOut()} // ログアウト処理を行う関数を呼び出します
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="110%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          ログアウト
        </Text>
      </Box>

      {!isGuestUser && (
        <Box mt="100px">
          <Text
            fontSize="18px"
            color="#FFFFFF"
            fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
            fontWeight="600"
            mt="2"
            onClick={() => setShowFeed(true)}
            _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
            width="110%" // テキスト要素の幅を100%に設定します
            p={1}
          >
            履歴ファイル
          </Text>
        </Box>
      )}
      {/* 20230917追加 ファイル履歴 */}
      {!isGuestUser && (
        <Box mt="2px">
          {Object.keys(fileGroups)
            .sort((a, b) => b.localeCompare(a))
            .slice(0, 6) // ここで最初の10件だけを取得
            .map((date) => (
              <Box key={date}>
                <Text
                  fontSize="16px"
                  color="#FFFFFF"
                  fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
                  fontWeight="200"
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
                        fontSize="16px"
                        color="#FFFFFF"
                        fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
                        fontWeight="200"
                        onClick={() => handleDownload(fileName)}
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {fileName}
                      </Text>
                    </Box>
                  ))}
              </Box>
            ))}
        </Box>
      )}
      <Box position="absolute" bottom="40px">
        <Text
          fontSize="18px"
          color="#FFFFFF"
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="136%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          ヘルプ
        </Text>
        <Text
          fontSize="18px"
          color="#FFFFFF"
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="136%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          問い合わせ
        </Text>
        <Text
          fontSize="18px"
          color="#FFFFFF"
          fontFamily="'Roboto', sans-serif" // ここでフォントファミリーを指定
          fontWeight="600"
          mt="2"
          _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} // ホバー時の背景色を指定します
          width="136%" // テキスト要素の幅を100%に設定します
          p={1}
        >
          運営会社
        </Text>
      </Box>
    </Box>
  );
}

export default Sidebar;
