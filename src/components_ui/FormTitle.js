import { useState } from "react";
import { Input, Text, IconButton, HStack } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

function FormTitle({ inputName, content, setContent }) {
  const [iconBackColor, setIconBackColor] = useState("gray.200");
  const inputname = [inputName] + "を入力してください";

  const handleInputChange = (e) => {
    setContent(e.target.value);
    setIconBackColor(e.target.value ? "green.500" : "gray.300");
  };

  return (
    <HStack my="2">
      <IconButton
        icon={<FaCheck />}
        size="xs"
        backgroundColor={iconBackColor}
        aria-label="Checkmark"
        color="white"
        isRound={true}
        my="2"
      />
      <Text width="114px" fontSize="sm" my="3" mx="2">
        {inputName}
      </Text>
      <Input
        value={content}
        onChange={handleInputChange}
        placeholder={inputname}
        fontSize="sm"
      />
    </HStack>
  );
}

export default FormTitle;
