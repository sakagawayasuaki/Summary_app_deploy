import React, { useState, useEffect } from "react";
import { Box, Input, HStack, IconButton, Text } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

function FormMemberName({ members, setMembers }) {
  const iniMember = {
    division: "",
    names: [""]
  };
  const [list,setList] = useState([iniMember]);
  // const [nameList,setNameList] = useState([iniMember]);

  const [iconBackColor, setIconBackColor] = useState('gray.200');
  
  // menbers([部署+名前のリスト])を更新する関数 useEffectで書く(listが変更されたらmembersを更新)
  const concatenateRows = () => {
    const membersList = []
    list.map(member => {
      const namesJoined = member.names.join(', ');
      membersList.push(`${member.division}: ${namesJoined}`);
    })
    setMembers(membersList);
  };
  const checkForEmptyStrings = () => {
    const hasNoEmptyStrings = list.every(row => {
      if(row.department === "") return false; // 部署が空文字の場合
  
      return row.names.every(name => name !== ""); // 名前に空文字があるかチェック
    });
    setIconBackColor(hasNoEmptyStrings ? 'green.500' : 'gray.200');
  };

  useEffect(() => {
    concatenateRows();
    checkForEmptyStrings();
  }, [list]);
  
  // 部署or名前のStateを更新（typeによって分岐）
  const changeDivision = (divisionIndex,nameIndex,type, e) => {
      const newList= [...list]; 
      if (type === "division") {
        newList[divisionIndex].division = e.target.value;
      } else {
        newList[divisionIndex].names[nameIndex] = e.target.value;
      }
      setList(newList);
    };
  
  // 部署と名前の両方の入力欄を追加する関数
  const addList = (e) => {
    e.preventDefault();
    const newTeam = {
      division: "",
      names: [""]
    };
    setList([...list, newTeam]);
    setIconBackColor('gray.200');
  };
  // 名前の入力欄を追加する関数
  const addName = (divisionIndex) => {
    const newList= [...list]; 
    newList[divisionIndex].names.push("");
    setList(newList);
    setIconBackColor('gray.200');
  };

  // 部署の入力欄を削除
  const deleteList = (divisionIndex) => {
    const newList = list.filter((prev, index) => {
      //divisionIndexが同じなら追加しない
      return index !== divisionIndex;
    });
    setList(newList);
  };
  // 名前の入力欄を削除
  const deleteName = (divisionIndex, nameIndex) => {
    const newList = [...list];
    newList[divisionIndex].names.splice(nameIndex, 1); // nameIndexに対応する要素を１つ削除
    if(newList[divisionIndex].names.length === 0) {  // 部署の名前がすべて削除された場合、部署自体を削除
      newList.splice(divisionIndex, 1);
    }
    setList(newList);
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
        {list.map((member,divisionId) => {
          return (
            <HStack mb="1" align="start" key={divisionId}>
              <Box width="124px">
                
                <Input
                  type="text"
                  fontSize="sm"
                  placeholder="部署"
                  value={member.division}
                  onChange={(event) =>
                    changeDivision(divisionId,0,"division",event)
                  }
                />
                <IconButton
                  aria-label="Plus button"
                  size="xs"
                  m="1"
                  icon={<AddIcon color="blue.500" />}
                  backgroundColor="white"
                  border="2px solid"
                  borderColor="blue.500"
                  borderRadius="50%"
                  onClick={(e)=>addList(e)}
                />
                {/* <IconButton
                  aria-label="Minus button"
                  size="xs"
                  m="1"
                  icon={<MinusIcon color="blue.500" />}
                  backgroundColor="white"
                  border="2px solid"
                  borderColor="blue.500"
                  borderRadius="50%"
                  onClick={() => deleteList(divisionId)}
                /> */}
              </Box>
              

              <Box>
                {member.names.map((name,nameId) => {
                  return(
                    <HStack>
                      <Input
                        type="text"
                        fontSize="sm"
                        placeholder="名前"
                        width="124px"
                        value={name}
                        onChange={(event) => 
                          changeDivision(divisionId,nameId,"name",event)
                        }
                      />  
                      <IconButton
                        aria-label="Minus button"
                        size="xs"
                        ml="1"
                        icon={<MinusIcon color="blue.500" />}
                        backgroundColor="white"
                        border="2px solid"
                        borderColor="blue.500"
                        borderRadius="50%"
                        onClick={() => deleteName(divisionId, nameId)}
                      />
                      {nameId === member.names.length - 1 && ( // この名前が部署内で最後のものである場合
                        <IconButton
                          aria-label="Plus button"
                          size="xs"
                          ml="1"
                          icon={<AddIcon color="blue.500" />}
                          backgroundColor="white"
                          border="2px solid"
                          borderColor="blue.500"
                          borderRadius="50%"
                          onClick={()=>addName(divisionId)}
                        />
                      )}
                    </HStack>
                  )
                })}
                
              </Box>
            </HStack>
          );
        })}
        {members.length === 0 && (  // membersが空の場合
          <IconButton
            aria-label="Plus button"
            size="xs"
            m="1"
            icon={<AddIcon color="blue.500" />}
            backgroundColor="white"
            border="2px solid"
            borderColor="blue.500"
            borderRadius="50%"
            onClick={(e)=>addList(e)}
          />
        )}
      </Box>
    </HStack>
  );
}

export default FormMemberName;
