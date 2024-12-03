import { message } from "antd";
import type { AxiosError } from "axios";

export const handleRequestError = (error: unknown) => {
  const err = error as AxiosError<{ message: string }>;
  if (err.response) {
    switch (err.response.status) {
      case 400:
        message.error("请求参数错误");
        break;
      case 401:
        message.error("未授权，请重新登录");
        // 可以在这里处理登出逻辑
        break;
      case 403:
        message.error("拒绝访问");
        break;
      case 404:
        message.error("请求错误，未找到该资源");
        break;
      case 408:
        message.error("请求超时");
        break;
      case 500:
        message.error("服务器内部错误");
        break;
      case 501:
        message.error("服务未实现");
        break;
      case 502:
        message.error("网关错误");
        break;
      case 503:
        message.error("服务不可用");
        break;
      case 504:
        message.error("网关超时");
        break;
      default:
        message.error(err.response.data?.message || "未知错误");
    }
  } else if (err.request) {
    message.error("网络错误，请检查您的网络连接");
  } else {
    message.error("请求配置错误");
  }
  return Promise.reject(error);
};
