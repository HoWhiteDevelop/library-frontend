import { Form, Input, Button, Card, App, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store";
import { motion } from "framer-motion";
import { getOAuthURL } from "../api/auth";

const Login = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      message.success("登录成功，即将跳转...");
      setTimeout(() => {
        if (result.user) {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      message.error("登录失败: " + ((error as Error).message || "未知错误"));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
      },
    },
    tap: { scale: 0.95 },
  };

  const socialIcons = [
    {
      type: "邮箱",
      icon: <MailOutlined style={{ fontSize: "1.2rem" }} />,
      onClick: () => {
        // 邮箱登录可以打开一个模态框
        Modal.info({
          title: "邮箱登录",
          content: (
            <Form>
              <Form.Item
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Form>
          ),
        });
      },
    },
    {
      type: "微信",
      icon: <WechatOutlined style={{ fontSize: "1.2rem" }} />,
      onClick: () => {
        // 微信登录通常需要打开一个新窗口
        const url = getOAuthURL("wechat");
        window.open(url, "wechat-login", "width=600,height=600");
      },
    },
    {
      type: "Github",
      icon: <GithubOutlined style={{ fontSize: "1.2rem" }} />,
      onClick: () => {
        // GitHub OAuth 登录
        const url = getOAuthURL("github");
        window.location.href = url; // 直接跳转
      },
    },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0">
          {/* 动态渐变背景 */}
          <div className="absolute inset-0 bg-gradient-animate"></div>
          {/* 浮动气泡效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bubble"
                style={
                  {
                    "--size": `${2 + Math.random() * 4}rem`,
                    "--distance": `${6 + Math.random() * 4}rem`,
                    "--position": `${-5 + Math.random() * 110}%`,
                    "--time": `${2 + Math.random() * 2}s`,
                    "--delay": `${-1 * (2 + Math.random() * 2)}s`,
                  } as React.CSSProperties
                }
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 左侧登录表单 */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-md w-full backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/30">
          <motion.h1
            className="text-2xl font-bold text-center mb-8 text-white"
            variants={itemVariants}
          >
            登入账号
          </motion.h1>

          <motion.div
            className="flex justify-center space-x-4 mb-8"
            variants={itemVariants}
          >
            {socialIcons.map(({ type, icon, onClick }, index) => (
              <motion.button
                key={type}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm outline-none focus:outline-none border-none"
                whileHover={{ scale: 1.3, rotate: 0 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={onClick}
              >
                <span className="text-white flex items-center justify-center w-6 h-6">
                  {icon}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <motion.p
            className="text-center text-white/80 mb-8"
            variants={itemVariants}
          >
            选择登录方式或账密登录
          </motion.p>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <motion.div variants={itemVariants}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-white/60" />}
                  placeholder="用户名"
                  size="large"
                  className="rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/60 hover:border-white/60 focus:border-white transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-white/60" />}
                  placeholder="密码"
                  size="large"
                  className="rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/60 hover:border-white/60 focus:border-white transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item>
                <motion.button
                  className="w-full h-12 rounded-lg text-lg bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                >
                  {loading ? "登录中..." : "登录"}
                </motion.button>
              </Form.Item>
            </motion.div>
          </Form>

          <motion.div className="text-center" variants={itemVariants}>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              忘记密码？
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* 右侧欢迎区域 */}
      <motion.div
        className="hidden md:flex w-1/2 items-center justify-center p-8 relative z-10"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4"
            animate={{
              y: [0, -10, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            Hello Friend!
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            欢迎访问图书系统
          </motion.p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="default"
              ghost
              size="large"
              className="rounded-full px-8 hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              HoWhite
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
