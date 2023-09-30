import React, { useState } from "react";
import { Box, Input, HStack, IconButton, Text } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import FormMembersName from "./FormMemberName";

function FormMember({ members, setMembers }) {
  const iniMember = {
    id: Math.floor(Math.random() * 1e5),
    division: "",
    name: "",
  };
  const [list,setMember] = useState([iniMember]);
  const [nameList,setNameList] = useState([iniMember]);
  const [iconBackColor, setIconBackColor] = useState('gray.200');
  
  // menbers([部署+名前のリスト])を更新する関数
  const settingMembers = (id, name ,division) =>{
    // リストを定義
    const membersTmp = []
    list.map((member) => {
      if(member.id === id ){
        membersTmp.push(division+" "+name);
      }
      else{
        membersTmp.push(member.division +" "+ member.name);
      }
    });
    setMembers(membersTmp);
  };
  // 部署のStateを更新
  const changeDivision = (id, name, e) => {
    const newMember = { id: id, division: e.target.value, name: name };
    setMember((prevList) =>
      prevList.map((member) => (member.id === id ? newMember : member))
    );
    settingMembers(id, name ,e.target.value);
    setIconBackColor(e.target.value && name ? 'green.500' : 'gray.200');
  };
  // 名前のStateを更新
  const changeName = (id, division, e) => {
    const newMember = { id: id, division: division, name: e.target.value };
    setMember((prevList) =>
      prevList.map((member) => (member.id === id ? newMember : member))
    );
    settingMembers(id, e.target.value ,division);
    setIconBackColor(division && e.target.value ? 'green.500' : 'gray.200');
  };
  // 空の入力欄を追加する関数
  const addList = (e) => {
    e.preventDefault();
    const newMember = {
      id: Math.floor(Math.random() * 1e5),
      division: "",
      name:"",
    };
    setMember([...list, newMember]);
    setIconBackColor('gray.200');
  };

  // 入力欄を削除
  const deleteList = (id) => {
    const newList = list.filter((keyword) => {
      return keyword.id !== id;
    });
    setMember(newList);
  };

  return (
    <HStack my="2" display="flex" alignItems="flex-start">
      <IconButton
        icon={<FaCheck />}
        size="xs"
        backgroundColor={iconBackColor}
        aria-label="Checkmark"
        color="white"
        isRound={true}
        my="2"
      />
      <Box
        width="80px"
        height="36px"
        display="flex"
        alignItems="center"
        flexShrink={0}
      >
        <Text fontSize="sm" ml="0">
          参加者
        </Text>
      </Box>

      <Box mx="4">
        {list.map((member) => {
          return (
            <HStack mb="1" key={member.id}>
              <Box width="140px">
                <Input
                  type="text"
                  fontSize="sm"
                  placeholder="部署"
                  value={member.division}
                  onChange={(event) =>
                    changeDivision(member.id, member.name, event)
                  }
                />
              </Box>

              <Box width="140px">
                <Input
                  type="text"
                  fontSize="sm"
                  placeholder="名前"
                  value={member.name}
                  onChange={(event) =>
                    changeName(member.id, member.division, event)
                  }
                />
              </Box>

              <IconButton
                aria-label="Minus button"
                size="xs"
                icon={<MinusIcon color="blue.500" />}
                backgroundColor="white"
                border="2px solid"
                borderColor="blue.500"
                borderRadius="50%"
                onClick={() => deleteList(member.id)}
              />
            </HStack>
          );
        })}
        <HStack ml="2" mt="2">
          <IconButton
            aria-label="Plus button"
            size="xs"
            icon={<AddIcon color="blue.500" />}
            backgroundColor="white"
            border="2px solid"
            borderColor="blue.500"
            borderRadius="50%"
            onClick={addList}
          />
          <Text fontSize="sm">追加</Text>
        </HStack>
      </Box>
    </HStack>
  );
}

export default FormMember;
