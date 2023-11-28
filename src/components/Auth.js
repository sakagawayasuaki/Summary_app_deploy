import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import styles from "./App.module.css";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

//import { Button, Box, Input, Text, Avatar, IconButton, Grid, Modal } from "@chakra-ui/react";

// password 再設定用
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  headerBar: {
    height: "64px",
    backgroundColor: "#355379",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1691405989953-97cba2ffb88b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOTF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // 100%にして、親要素に幅を制御させる
    maxWidth: "400px", // 最大幅を設定して、大きな画面でも適切な幅を保持できるようにする
    marginTop: theme.spacing(1),
    margin: "0 auto", // センターに配置
    [theme.breakpoints.down("xs")]: {
      // スマホ幅でのスタイル調整
      maxWidth: "100%",
      padding: theme.spacing(1),
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },

  appTitle: {
    fontSize: "32px",
    color: "rgba(0, 0, 0, 0.85)",
    fontFamily: "Roboto",
    marginBottom: "20px",
    fontWeight: 700,
  },
  appDescription: {
    fontSize: "14px",
    color: "rgba(0, 0, 0, 0.4)",
    fontFamily: "Roboto",
    marginBottom: "70px",
    fontWeight: 600,
    textAlign: "center",
  },
  typography: {
    //fontSize: "0.67rem", // フォントサイズを小さくする
    fontSize: "24px",
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Roboto",
    marginBottom: "0px",
    fontWeight: 700,
  },
}));

function Auth() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  //const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  //const [openModal, setOpenModal] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const onChangeImageHandler = (e) => {
    if (e.target.files[0]) {
      setAvatarImage(e.target.files[0]);
      e.target.value = "";
    }
  };

  // password リセット
  const sendResetEmail = async (e) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  // サインイン
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  // サインイン認証
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);

    await authUser.user?.updateProfile({
      displayName: username,
      // photoURL: url,  // この行をコメントアウトまたは削除します
    });

    dispatch(
      updateUserProfile({
        displayName: username,
        // photoUrl: url,
      })
    );
  };

  return (
    <>
      <div className={classes.headerBar}></div> {/* これが新しいバーです */}
      <Grid
        container
        component="main"
        className={classes.root}
        style={{ backgroundColor: "#F2F2F2" }}
      >
        <CssBaseline />
        {/*<Grid item xs={false} sm={4} md={7} className={classes.image} />*/}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          component={Paper}
          elevation={6}
          square
          //style={{ backgroundColor: "transparent" }}
        >
          <div className={classes.paper}>
            <Typography
              component="h1"
              variant="h5"
              className={classes.appTitle}
            >
              Tech0 書き起こしApp
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.appDescription}
            >
              動画データ/テキストデータから文字起こしと要約の書き起こしを行います
              <br />
              利用するためには会員登録・ログインが必要です
            </Typography>

            <Typography
              component="h1"
              variant="h5"
              className={classes.typography}
            >
              {isLogin ? "Login" : "Register"}
            </Typography>
            <form className={classes.form} noValidate>
              {!isLogin && (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  {/* 以下の Box セクションをコメントアウトまたは削除します
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        <AccountCircleIcon
                          fontSize="large"
                          className={
                            avatarImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        <input
                          className={styles.login_hiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                  */}
                </>
              )}

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6
                }
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                // icon追加
                startIcon={<EmailIcon />}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signInEmail();
                        } catch (err) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (err) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLogin ? "Login" : "Register"}
              </Button>

              <Grid container>
                <Grid item xs>
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}
                  >
                    Forgot password
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create new account ?" : "Back to login"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<CameraIcon />}
                className={classes.submit}
                onClick={signInGoogle}
              >
                Sign In with Google
              </Button>
            </form>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <div style={getModalStyle()} className={classes.modal}>
                <div className={styles.login_modal}>
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="email"
                    name="email"
                    label="Reset E-mail"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                    }}
                  />
                  <IconButton onClick={sendResetEmail}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </Modal>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Auth;
