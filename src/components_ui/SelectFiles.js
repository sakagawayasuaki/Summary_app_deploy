import React, { useState, useContext, useEffect } from "react";
import {
  Mycontext,
  root,
  Videocontext,
  Transcriptcontext,
  TxtContext,
  Precisioncontext,
} from "../App";
import axios from "axios";

function SelectFiles({ onFileSelected }) {
  const url = useContext(root);
  const [setting_filename] = useContext(Mycontext);
  const [, setVideolength] = useContext(Videocontext);
  const [, setTranscriptiontime] = useContext(Transcriptcontext);
  const [txt, setTxt] = useContext(TxtContext);
  const [precision, setPrecision] = useContext(Precisioncontext);

  //動画時間の取得方法
  const getTime = async () => {
    console.log("url", url, "名前", setting_filename);
    const URL_upload = url + "gettime/" + setting_filename;

    const preSubmit = async () => {
      const formdata = new FormData();
      formdata.append("upload_file", txt);
      // const requestOptions={
      //     method:"POST",
      //     body:formdata,
      // } fetchの場合に使用

      const response = await axios.post(URL_upload, formdata);

      setVideolength(response.data[0]);
      setTranscriptiontime(response.data[1]);
    };

    try {
      await preSubmit();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const get_Time = async () => {
    console.log("url", url, "精度", precision);
    const URL_upload = url + "get_time/" + precision;

    const preSubmit = async () => {
      const formdata = new FormData();
      formdata.append("upload_file", txt);
      // const requestOptions={
      //     method:"POST",
      //     body:formdata,
      // } fetchの場合に使用

      const response = await axios.post(URL_upload, formdata);

      setVideolength(response.data[0]);
      setTranscriptiontime(response.data[1]);
    };

    try {
      await preSubmit();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    if (txt && txt.name.includes("mp4")) {
      // getTime();
      get_Time();
    } else {
      setVideolength(0);
      setTranscriptiontime(0);
    }
  }, [txt]);

  //選択したファイルの情報取得、動画の場合は時間も取得する。
  const getinfo = (e) => {
    if (!e.target.files) return;

    const selectedFile = e.target.files[0];
    setTxt(e.target.files[0]); //ファイル名取得
    console.log(e.target.files[0]);

    // 以下の行を追加して、選択されたファイルを親コンポーネントに伝達します。
    if (onFileSelected) {
      onFileSelected(selectedFile);
    }
  };

  return <input id="text" type="file" accept=".txt,.mp4" onChange={getinfo} />;
}

export default SelectFiles;
