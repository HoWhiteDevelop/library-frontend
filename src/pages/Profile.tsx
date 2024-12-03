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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import type { Book } from "../types/book";
import type { RootState } from "../store";

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
  const { user } = useSelector((state: RootState) => state.auth);
  const { books } = useSelector((state: RootState) => state.book);

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
        <Descriptions column={2}>
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
