import { useState } from "react";
import { Input, Text, IconButton, HStack } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

function FormTime({ inputName, setDate }) {
  const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');

    const [iconBackColor, setIconBackColor] = useState('gray.200');
  
    const handleInputChange1 = (e) => {
      setInputValue1(e.target.value);
      setIconBackColor(e.target.value && inputValue2 && inputValue3 ? 'green.500' : 'gray.200');
      settingDate(1,e.target.value);
    };
    const handleInputChange2 = (e) => {
      setInputValue2(e.target.value);
      setIconBackColor(inputValue1 && e.target.value && inputValue3 ? 'green.500' : 'gray.200');
      settingDate(2,e.target.value);
    };
    const handleInputChange3 = (e) => {
      setInputValue3(e.target.value);
      setIconBackColor(inputValue1 && inputValue2 && e.target.value ? 'green.500' : 'gray.200');
      settingDate(3,e.target.value);
    };
    const settingDate = (num, val) => {
      if(num===1){
        setDate(val +"年"+ inputValue2 +"月"+ inputValue3 +"日");
      }
      else if(num===2){
        setDate(inputValue1 +"年"+ val +"月"+ inputValue3 +"日");
      }
      else{
        setDate(inputValue1 +"年"+ inputValue2 +"月"+ val +"日");
      };
    };


  return (
    <HStack my="1">
      <IconButton
        icon={<FaCheck />}
        size="xs"
        backgroundColor={iconBackColor}
        aria-label="Checkmark"
        color="white"
        isRound={true}
        my={2}
      />
      <Text width="80px" fontSize="sm" my="3" mx="2">
        {inputName}
      </Text>
      <HStack>
        <Input
          value={inputValue1}
          onChange={handleInputChange1}
          placeholder="0000"
          fontSize="sm"
          width="100px"
          textAlign="center"
        />
        <Text fontSize="sm" mx={1}>
          年
        </Text>
        <Input
          value={inputValue2}
          onChange={handleInputChange2}
          placeholder="00"
          fontSize="sm"
          width="64px"
          textAlign="center"
        />
        <Text fontSize="sm" mx={1}>
          月
        </Text>
        <Input
          value={inputValue3}
          onChange={handleInputChange3}
          placeholder="00"
          fontSize="sm"
          width="64px"
          textAlign="center"
        />
        <Text fontSize="sm" mx={1}>
          日
        </Text>
      </HStack>
    </HStack>
  );
}

export default FormTime;
