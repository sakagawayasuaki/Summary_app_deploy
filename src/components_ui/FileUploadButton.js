import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const FileUploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // 選択されたファイルの処理を行う
      console.log("選択されたファイル:", selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      // ドロップされたファイルの処理を行う
      console.log("ドロップされたファイル:", droppedFile);
    }
  };

  return (
    <>
      <Button onClick={openModal}>選択</Button>
      <Modal isOpen={isOpen} onClose={closeModal} centered>
        <ModalOverlay />
        <ModalContent
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          maxWidth="600px" // モーダルの最大幅を600pxに設定
          width="80%" // モーダルの幅を親要素の80%に設定
          maxHeight="400px" // モーダルの最大高さを400pxに設定
          height="120%" // モーダルの高さを親要素の70%に設定
          marginBottom="20rem" // モーダルのボトムの余白を4remに設定
        >
          <ModalHeader>ファイルをアップロード</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <p>
              またはファイルをドラッグ＆ドロップ
              <br />
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FileUploadButton;
