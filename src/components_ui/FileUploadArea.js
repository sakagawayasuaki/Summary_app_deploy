import React, { useState } from "react";
import { Center, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

function FileUploadArea({ onFileSelected }) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setIsFileUploaded(true);
      onFileSelected(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // 枠線と背景色を条件に応じて設定
  const borderColor = useColorModeValue(
    isFileUploaded ? "blue.500" : "blue.300", // アップロード後は青色の枠に変更
    "gray.600"
  );
  const backgroundColor = useColorModeValue(
    isDragOver ? "blue.50" : isFileUploaded ? "blue.50" : "white", // ドラッグ中は薄い青色、それ以外は白または薄い青色
    "gray.100"
  );
  const iconColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Center
      p="5"
      border="2px dashed"
      borderColor={borderColor}
      borderRadius="md"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      bg={backgroundColor}
    >
      <input
        id="file-input"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".mp4,.txt"
      />
      {/* 中身は変更なし */}
      <Box
        onClick={() => document.getElementById("file-input").click()}
        width="200px"
        height="200px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        _hover={{ color: iconColor }}
      >
        <AttachmentIcon w={12} h={12} />
        {/* テキストと選択したファイル名の表示は変更なし */}
        {!selectedFileName && (
          <>
            <Text mt="1" textAlign="center">
              動画MP4ファイル
            </Text>
            <Text mt="1" textAlign="center">
              文字起こしtxtファイル
            </Text>
            <Text mt="1" textAlign="center">
              選択 or ドラック＆ドロップ
            </Text>
          </>
        )}
        {selectedFileName && <Text mt="2">{selectedFileName}</Text>}
      </Box>
    </Center>
  );
}

export default FileUploadArea;
