import React, { useState } from "react";
import { Box, Input, HStack,VStack, IconButton, Text } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

function FormMemberName({ nameList, setNameList, setIconBackColor }) {
    const iniName = {
        id_name: Math.floor(Math.random() * 1e5),
        name: "",
    };
    
    // 名前のStateを更新
    const changeName = (id_name, e) => {
      const newName = {id_name:id_name, name: e.target.value };
      setNameList((prevList) =>
        prevList.map((person) => (person.id_name === id_name ? newName : person))
      );
    };
    // 空の入力欄を追加する関数
    const addList = (e) => {
      e.preventDefault();
      const newName = {
        id_name: Math.floor(Math.random() * 1e5),
        name: "",
      };
      setNameList([...nameList, newName]);
      setIconBackColor('gray.200');
    };
  
    // 入力欄を削除
    const deleteList = (id) => {
      const newList = nameList.filter((person) => {
        return person.id_name !== id;
      });
      setNameList(newList);
    };
  
    return (
        <Box width="140px">
          {nameList.map((person) => {
            return (
              <VStack mb="1" key={person.id}>
                <Box width="140px">
                  <Input
                    type="text"
                    fontSize="sm"
                    placeholder="名前"
                    value={person.name}
                    onChange={(event) =>
                      changeName(person.id_name, event)
                    }
                  />
                </Box>
                <HStack>
                    <IconButton
                    aria-label="Plus button"
                    size="xs"
                    icon={<MinusIcon color="blue.500" />}
                    backgroundColor="white"
                    border="2px solid"
                    borderColor="blue.500"
                    borderRadius="50%"
                    onClick={() => addList(person.id)}
                    />
                    <IconButton
                    aria-label="Minus button"
                    size="xs"
                    icon={<MinusIcon color="blue.500" />}
                    backgroundColor="white"
                    border="2px solid"
                    borderColor="blue.500"
                    borderRadius="50%"
                    onClick={() => deleteList(person.id)}
                    />
                </HStack>
              </VStack>
            );
          })}
        </Box>
    );
  }
  
  export default FormMemberName;