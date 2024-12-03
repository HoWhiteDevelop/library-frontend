import { useEffect } from "react";
import { Row, Col, Card, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOutlined,
  SwapOutlined,
  UserOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { fetchBooks } from "../store/slices/bookSlice";
import type { AppDispatch, RootState } from "../store";
import RecentBorrowList from "../components/RecentBorrowList";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const totalBooks = books.length;
  const borrowedBooks = books.filter(
    (book) => book.status === "borrowed"
  ).length;
  const availableBooks = books.filter(
    (book) => book.status === "available"
  ).length;

  return (
    <div className="page-container">
      <h1 className="section-title">系统概览</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="馆藏图书总量"
              value={totalBooks}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="当前借出"
              value={borrowedBooks}
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="可借图书"
              value={availableBooks}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {user?.role === "admin" && (
        <div className="mt-8">
          <h2 className="section-title">最近活动</h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title="最新借阅"
                loading={loading}
                className="h-96 overflow-auto"
              >
                <RecentBorrowList books={books} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="图书荐购"
                loading={loading}
                className="h-96 overflow-auto"
              >
                {/* 最新荐购列表组件将在后续实现 */}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
