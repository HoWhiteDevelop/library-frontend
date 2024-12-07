import { useEffect } from "react";
import { Layout, Typography } from "antd";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { Row, Col, Card, Statistic, Breadcrumb, Button, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOutlined,
  SwapOutlined,
  UserOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../store/slices/bookSlice";
import type { AppDispatch, RootState } from "../store";
import RecentBorrowList from "../components/RecentBorrowList";
import PageTransition from "../components/PageTransition";
import PageLoading from "../components/PageLoading";
import BookGrid from "../components/books/BookGrid";

const { Content } = Layout;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Title } = Typography;

const StyledContent = styled(Content)`
  position: relative;
  overflow: hidden;
`;

const DecorativeElement = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1890ff20, #1890ff10);
  filter: blur(40px);
  z-index: 0;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  padding: 2rem;
`;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const { user } = useSelector((state: RootState) => state.auth);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -100]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.2]);

  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 6) return "夜深了";
    if (currentHour < 9) return "早上好";
    if (currentHour < 12) return "上午好";
    if (currentHour < 14) return "中午好";
    if (currentHour < 17) return "下午好";
    if (currentHour < 19) return "傍晚好";
    return "晚上好";
  };

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

  if (loading) {
    return <PageLoading tip="正在加载数据..." />;
  }

  return (
    <StyledContent>
      <DecorativeElement style={{ top: -50, left: -50, y: y1, opacity }} />
      <DecorativeElement style={{ bottom: -50, right: -50, y: y2, opacity }} />

      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageTransition>
          <div className="page-container">
            <div className="flex justify-between items-center mb-6">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <>
                        <HomeOutlined className="mr-1" />
                        首页
                      </>
                    ),
                  },
                  {
                    title: "仪表盘",
                  },
                ]}
              />
              <div className="space-x-2">
                <Tooltip title="快速借阅">
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => navigate("/books/borrow")}
                    ghost
                  >
                    借阅图书
                  </Button>
                </Tooltip>
                {user?.role === "admin" && (
                  <Tooltip title="添加新书">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/books/management")}
                      ghost
                    >
                      上架图书
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="welcome-banner mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {getGreeting()}，{user?.name}
                  </h1>
                  <p className="text-white/80">
                    今天是{" "}
                    {new Date().toLocaleDateString("zh-CN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-5xl">
                  <ClockCircleOutlined className="animate-pulse" />
                </div>
              </div>
            </div>

            <h2 className="section-title flex items-center">
              <BookOutlined className="mr-2" />
              图书统计
            </h2>
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={8}>
                <Card
                  loading={loading}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Statistic
                    title={
                      <span className="flex items-center text-lg">
                        <BookOutlined className="mr-2 text-blue-500" />
                        馆藏图书总量
                      </span>
                    }
                    value={totalBooks}
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <div className="mt-2 text-gray-500">全部图书数量</div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  loading={loading}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Statistic
                    title={
                      <span className="flex items-center text-lg">
                        <SwapOutlined className="mr-2 text-orange-500" />
                        当前借出
                      </span>
                    }
                    value={borrowedBooks}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                  <div className="mt-2 text-gray-500">已借出的图书数量</div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card
                  loading={loading}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Statistic
                    title={
                      <span className="flex items-center text-lg">
                        <UserOutlined className="mr-2 text-green-500" />
                        可借图书
                      </span>
                    }
                    value={availableBooks}
                    valueStyle={{ color: "#52c41a" }}
                  />
                  <div className="mt-2 text-gray-500">当前可借的图书数量</div>
                </Card>
              </Col>
            </Row>

            {user?.role === "admin" && (
              <div className="mt-8">
                <h2 className="section-title flex items-center">
                  <SwapOutlined className="mr-2" />
                  最近活动
                </h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <span className="flex items-center">
                          <BookOutlined className="mr-2" />
                          最新借阅
                        </span>
                      }
                      loading={loading}
                      className="h-96 overflow-auto hover:shadow-lg transition-shadow duration-300"
                    >
                      <RecentBorrowList books={books} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <span className="flex items-center">
                          <UserOutlined className="mr-2" />
                          图书荐购
                        </span>
                      }
                      loading={loading}
                      className="h-96 overflow-auto hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* 最新荐购列表组件将在后续实现 */}
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">推荐图书</h2>
              <BookGrid />
            </div>
          </div>
        </PageTransition>
      </ContentWrapper>
    </StyledContent>
  );
};

export default Dashboard;
