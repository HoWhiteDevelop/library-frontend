import { Form, Input, Button, Card, App } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store";
// import { searchBooks } from "../api/books";

const Login = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      // const response: any = await searchBooks({
      //   q: "简史",
      //   fields: "title",
      //   from: 0,
      //   size: 10,
      // });
      // console.log(response.data.hits.hits);
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

  return (
    <div className="login-container min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-t from-transparent to-white/10"></div>
      </div>

      <Card
        className="w-96 shadow-2xl backdrop-blur-sm bg-white/90 animate-fade-in"
        bordered={false}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            图书馆管理系统
          </h1>
          <p className="text-gray-500 mt-2">欢迎使用图书馆管理系统</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          preserve={true}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-10 rounded-lg text-lg"
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
