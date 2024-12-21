import React from "react";
import { useEffect } from "react";
import { Layout, Typography } from "antd";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { Row, Col, Card, Statistic, Breadcrumb, Button, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
  BookOutlined,
  SwapOutlined,
  UserOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  RiseOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchBooks, fetchLoanHistory } from "../store/slices/bookSlice";
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

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const GradientText = styled.span`
  background: linear-gradient(45deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const { loanHistory, historyLoading } = useSelector(
    (state: RootState) => state.book
  );
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
    // dispatch(fetchBooks());
    dispatch(fetchLoanHistory());
  }, [dispatch]);

  // console.log(books);
  console.log(loanHistory);

  const totalBooks = books.length;
  const borrowedBooks = books.filter(
    (book) => book.status === "borrowed"
  ).length;
  const availableBooks = books.filter(
    (book) => book.status === "available"
  ).length;

  // 借阅趋势图表配置
  const borrowTrendOption = {
    title: {
      text: "近期借阅趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
    },
    series: [
      {
        data: [10, 15, 8, 20, 12, 23, 15],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.1)",
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
        },
      },
    ],
  };

  // 图书分类饼图配置
  const bookCategoryOption = {
    title: {
      text: "图书分类统计",
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
    },
    series: [
      {
        name: "图书分类",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "文学" },
          { value: 735, name: "科技" },
          { value: 580, name: "历史" },
          { value: 484, name: "艺术" },
          { value: 300, name: "其他" },
        ],
      },
    ],
  };

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

            <motion.div
              className="welcome-banner mb-8 p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg text-white overflow-hidden relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-4xl font-bold mb-3">
                    {getGreeting()}，<GradientText>{user?.name}</GradientText>
                  </h1>
                  <p className="text-white/90 text-lg">
                    今天是{" "}
                    {new Date().toLocaleDateString("zh-CN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <motion.div
                  className="text-6xl"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ClockCircleOutlined />
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg -z-10"></div>
            </motion.div>

            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StyledCard className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <Statistic
                      title={
                        <span className="flex items-center text-lg font-medium">
                          <BookOutlined className="mr-2 text-blue-500" />
                          馆藏图书总量
                        </span>
                      }
                      value={totalBooks}
                      valueStyle={{ color: "#1890ff", fontSize: "28px" }}
                      prefix={<RiseOutlined />}
                    />
                    <div className="mt-2 text-gray-500">较上月增长 5%</div>
                  </StyledCard>
                </motion.div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StyledCard className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <Statistic
                      title={
                        <span className="flex items-center text-lg font-medium">
                          <SwapOutlined className="mr-2 text-orange-500" />
                          当前借出
                        </span>
                      }
                      value={borrowedBooks}
                      valueStyle={{ color: "#fa8c16", fontSize: "28px" }}
                      prefix={<RiseOutlined />}
                    />
                    <div className="mt-2 text-gray-500">较上月增长 3%</div>
                  </StyledCard>
                </motion.div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StyledCard className="bg-gradient-to-br from-green-50 to-green-100">
                    <Statistic
                      title={
                        <span className="flex items-center text-lg font-medium">
                          <UserOutlined className="mr-2 text-green-500" />
                          可借图书
                        </span>
                      }
                      value={availableBooks}
                      valueStyle={{ color: "#52c41a", fontSize: "28px" }}
                      prefix={<RiseOutlined />}
                    />
                    <div className="mt-2 text-gray-500">较上月增长 2%</div>
                  </StyledCard>
                </motion.div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} lg={14}>
                <StyledCard>
                  <ReactECharts
                    option={borrowTrendOption}
                    style={{ height: "400px" }}
                  />
                </StyledCard>
              </Col>
              <Col xs={24} lg={10}>
                <StyledCard>
                  <ReactECharts
                    option={bookCategoryOption}
                    style={{ height: "400px" }}
                  />
                </StyledCard>
              </Col>
            </Row>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FireOutlined className="mr-2 text-red-500" />
                热门推荐
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* <BookGrid /> */}
              </div>
            </div>

            {user?.role === "admin" && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <SwapOutlined className="mr-2" />
                  最近活动
                </h2>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <StyledCard
                      title={
                        <span className="flex items-center">
                          <BookOutlined className="mr-2 text-blue-500" />
                          最新借阅
                        </span>
                      }
                      className="h-96 overflow-auto"
                    >
                      <RecentBorrowList books={loanHistory} />
                    </StyledCard>
                  </Col>
                  <Col xs={24} lg={12}>
                    <StyledCard
                      title={
                        <span className="flex items-center">
                          <UserOutlined className="mr-2 text-green-500" />
                          图书荐购
                        </span>
                      }
                      className="h-96 overflow-auto"
                    >
                      {/* 荐购列表组件 */}
                    </StyledCard>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </PageTransition>
      </ContentWrapper>
    </StyledContent>
  );
};

export default Dashboard;
