import React, { useState, useContext, useEffect } from "react";
import { root } from "../App";
import axios from "axios";
import { Pathcontext } from "../App";
import {
  getFirebaseDownloadURL,
  getCurrentUser,
} from "../components/firebaseUtils"; // 20230923 追加
import { FaCheckCircle, FaSpinner, FaDownload } from "react-icons/fa";
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Text,
  Center,
  Flex,
  Box,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";

const DL = ({ fileType }) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const currentUser = getCurrentUser();
  const id = currentUser.id;
  const address = currentUser.email;
  const disabledIconColor = useColorModeValue("gray.400", "gray.600");
  const hoverIconColor = useColorModeValue("gray.700", "gray.300");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileContent, setFileContent] = useState("");

  const contextValue = useContext(Pathcontext);
  let summary_path, transcription_path;
  if (contextValue) {
    [summary_path, transcription_path] = contextValue[0];
  }

  const pathsummary = `static/${currentUser.id}/result/summary/` + summary_path; // ← 修正
  const pathtranscription =
    `static/${currentUser.id}/result/transcription/` + transcription_path; // ← 修正
  const url = useContext(root);
  const [encoding, setEncoding] = useState("UTF-8");
  const [uint8Array, setUint8Array] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Debug Path Summary1: ", pathsummary);
  console.log("Debug Path Summary2: ", pathtranscription);

  const downloadfile = async (path, event) => {
    event.preventDefault(); // ページ遷移をキャンセル

    try {
      const url = await getFirebaseDownloadURL(path);

      // ダウンロード用の仮のリンクを作成し、クリックすることでファイルをダウンロード
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = path || "downloadedFile"; // ダウンロード時のファイル名を指定
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // ダウンロード後、URL.revokeObjectURLでURLを解放することが重要です
      URL.revokeObjectURL(blobUrl);
      // ダウンロードが試行されたらボタンを再度有効化する
    } catch (error) {
      console.error("ファイルのダウンロードエラー:", error);
    } finally {
    }
  };

  const post_mail = async () => {
    const data = {
      address: address,
    };
    try {
      // console.log(data);
      const response = await axios.post(url + "announce", data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const fetchFileContent = async (path) => {
    try {
      const url = await getFirebaseDownloadURL(path);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer(); // レスポンスをArrayBufferとして取得
      setUint8Array(new Uint8Array(arrayBuffer)); // バイナリデータをステートにセット
      decodeAndSetContent(new Uint8Array(arrayBuffer), encoding); // 初回デコード
      setIsModalOpen(true);
      onOpen();
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const interflag = false;

  const decodeAndSetContent = (uint8Array, encoding) => {
    try {
      const text = new TextDecoder(encoding).decode(uint8Array);
      setFileContent(text);
    } catch (e) {
      console.error(`Failed to decode as ${encoding}:`, e);
    }
  };

  const toggleEncoding = () => {
    const newEncoding = encoding === "UTF-8" ? "Shift_JIS" : "UTF-8";
    setEncoding(newEncoding);
    if (uint8Array) {
      decodeAndSetContent(uint8Array, newEncoding);
    }
  };

  useEffect(
    (interflag) => {
      let intervalId;
      console.log("use_path1", pathsummary);
      // checkfile関数を定期的に実行する関数を定義します
      const runCheckfile = async () => {
        try {
          const url = await getFirebaseDownloadURL(pathsummary); // ← 修正
          setButtonDisabled(false);
          await post_mail();
          alert("要約が完了しました");

          // もしbuttonDisabledがfalseになったら、intervalをクリアして実行を止めます
          clearInterval(intervalId);
          console.log("clear");
        } catch (error) {
          console.log("use_path2", pathsummary);
          setButtonDisabled(true);
        }
      };

      // 定期的にrunCheckfile関数を実行する間隔（ミリ秒単位）を設定します
      if (!interflag) {
        intervalId = setInterval(runCheckfile, 10000); // 例として10秒ごとに実行する設定です
        interflag = true;
      }

      // コンポーネントがアンマウントされたときにintervalをクリアします
      return () => {
        clearInterval(intervalId);
      };
    },
    [pathsummary]
  );

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (uint8Array) {
      decodeAndSetContent(uint8Array, encoding);
    }
  }, [uint8Array, encoding]);

  return (
    <Flex direction="column" alignItems="center" spacing={6}>
      <Text fontSize="xl" fontWeight="bold" color="#6FA2DF" mt="6" mb="8">
        {buttonDisabled
          ? "要約ファイル作成中"
          : "要約ファイル作成が完了しました"}
      </Text>

      <Center>
        {buttonDisabled ? (
          <FaSpinner
            style={{
              animation: "spin 1.6s linear infinite", // 回転スピードを2秒に変更
              opacity: 0.5, // スピナーの色を薄くするための透明度を追加
              transition: "all 0.5s ease-in-out", // イーズイン・アウトのアニメーションを適用
            }}
            size={120}
          />
        ) : (
          <FaCheckCircle size={120} color="#6FA2DF" />
        )}
      </Center>

      <Flex width="100%" justifyContent="space-between" mt={12}>
        <Box
          border="1px"
          borderRadius="5px"
          padding="4px"
          maxWidth="85%"
          width="100%"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {!buttonDisabled && <Text fontSize="xs">{summary_path}</Text>}
        </Box>
        <Box>
          <ViewIcon
            boxSize="20px"
            color={buttonDisabled ? disabledIconColor : "black"}
            _hover={{ color: hoverIconColor }}
            onClick={
              buttonDisabled ? null : () => fetchFileContent(pathsummary)
            }
          />
        </Box>
        <Box>
          <DownloadIcon
            boxSize="20px"
            color={buttonDisabled ? disabledIconColor : "black"}
            _hover={{ color: hoverIconColor }}
            onClick={
              buttonDisabled
                ? null
                : (event) => downloadfile(pathsummary, event)
            }
          />
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent width="100%" maxW="80%" height="80%">
            <ModalHeader>File Content</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Button onClick={toggleEncoding} mb="5">
                Switch Encoding ({encoding === "UTF-8" ? "Shift_JIS" : "UTF-8"})
              </Button>
              <Textarea value={fileContent} isReadOnly w="100%" h="600px" />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>

      {fileType === "video" && (
        <Flex width="100%" justifyContent="space-between" mt={4} mb={6}>
          <Box
            border="1px"
            borderRadius="5px"
            padding="4px"
            maxWidth="85%"
            width="100%"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {!buttonDisabled && <Text fontSize="xs">{transcription_path}</Text>}
          </Box>
          <Box>
            <DownloadIcon
              boxSize="30px"
              color={buttonDisabled ? disabledIconColor : "black"}
              _hover={{ color: hoverIconColor }}
              onClick={
                buttonDisabled
                  ? null
                  : (event) => downloadfile(pathtranscription, event)
              }
            />
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default DL;
