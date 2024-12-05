import { useEffect, useParams, useLocation, useNavigate } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { handleOAuthCallback } from "../api/auth";
// import { loginSuccess } from "../store/slices/authSlice";

const OAuthCallback = () => {
  const { provider } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      handleOAuthCallback(provider, code)
        .then((response) => {
          // 处理登录成功
          //   dispatch(loginSuccess(response.data));
          navigate("/dashboard");
        })
        .catch((error) => {
          message.error("登录失败");
          navigate("/login");
        });
    }
  }, []);

  return <div>正在处理登录...</div>;
};

export default OAuthCallback;
