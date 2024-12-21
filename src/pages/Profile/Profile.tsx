import { useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tabs,
  Table,
  Tag,
  Upload,
  Avatar,
} from "antd";
import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { ColumnsType } from "antd/es/table";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAvatar } from "../../store/slices/authSlice";
import type { Book } from "../../types/book";
import type { RootState } from "../../store";
import { saveAvatar } from "../../utils/avatarStorage";

interface UserInfo {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  borrowCount: number;
  overdueTimes: number;
}

const Profile = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { books } = useSelector((state: RootState) => state.book);

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    const file = info.file.originFileObj;
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "上传失败");
      }

      dispatch(updateUserAvatar(result.path));
      setLoading(false);
      message.success("头像更新成功");
    } catch (error) {
      console.error("头像更新失败:", error);
      setLoading(false);
      message.error(
        `头像更新失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  // 模拟用户详细信息
  const userInfo: UserInfo = {
    id: user?.id || "",
    name: user?.name || "",
    role: user?.role === "admin" ? "管理员" : "读者",
    email: "user@example.com",
    phone: "13800138000",
    department: "信息技术部",
    borrowCount: 12,
    overdueTimes: 0,
  };

  const handleUpdateProfile = async (values: Partial<UserInfo>) => {
    try {
      // 实现更新用户信息的API调用
      console.log("更新用户信息:", values);
      message.success("更新成功");
      setIsModalVisible(false);
    } catch {
      message.error("更新失败");
    }
  };

  const borrowHistoryColumns: ColumnsType<Book> = [
    {
      title: "书名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "借阅时间",
      key: "borrowDate",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        return lastBorrow
          ? new Date(lastBorrow.borrowDate).toLocaleDateString()
          : "-";
      },
    },
    {
      title: "应还时间",
      key: "dueDate",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        if (!lastBorrow) return "-";
        const dueDate = new Date(lastBorrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        return dueDate.toLocaleDateString();
      },
    },
    {
      title: "状态",
      key: "status",
      render: (_, record) => {
        const lastBorrow =
          record.borrowHistory?.[record.borrowHistory.length - 1];
        if (!lastBorrow) return "-";
        if (lastBorrow.returnDate) {
          return <Tag color="green">已归还</Tag>;
        }
        const dueDate = new Date(lastBorrow.borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);
        return dueDate < new Date() ? (
          <Tag color="red">已逾期</Tag>
        ) : (
          <Tag color="blue">借阅中</Tag>
        );
      },
    },
  ];

  const userBooks = books.filter((book) =>
    book.borrowHistory?.some((history) => history.userId === userInfo.id)
  );

  const currentBorrows = userBooks.filter(
    (book) => !book.borrowHistory?.[book.borrowHistory.length - 1].returnDate
  );

  const borrowHistory = userBooks;

  return (
    <div className="page-container">
      <Card
        title="个人信息"
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            编辑资料
          </Button>
        }
      >
        <div className="flex items-start space-x-8">
          <div className="flex flex-col items-center space-y-4">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              customRequest={({ onSuccess }) => {
                if (onSuccess) onSuccess("ok");
              }}
            >
              {user?.avatar ? (
                <Avatar
                  size={100}
                  src={user.avatar}
                  alt="avatar"
                  className="cursor-pointer hover:opacity-80"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-avatar.png"; // 添加一个默认头像
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <span className="text-gray-500 text-sm">点击更换头像</span>
          </div>

          <Descriptions column={2} className="flex-1">
            <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
            <Descriptions.Item label="角色">{userInfo.role}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="电话">{userInfo.phone}</Descriptions.Item>
            <Descriptions.Item label="部门">
              {userInfo.department}
            </Descriptions.Item>
            <Descriptions.Item label="借阅次数">
              {userInfo.borrowCount}
            </Descriptions.Item>
            <Descriptions.Item label="逾期次数">
              {userInfo.overdueTimes}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      <Card className="mt-4">
        <Tabs
          items={[
            {
              key: "current",
              label: "当前借阅",
              children: (
                <Table
                  columns={borrowHistoryColumns}
                  dataSource={currentBorrows}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
            {
              key: "history",
              label: "借阅历史",
              children: (
                <Table
                  columns={borrowHistoryColumns}
                  dataSource={borrowHistory}
                  rowKey="id"
                  pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="编辑个人信息"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={userInfo}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: true, message: "请输入电话" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
