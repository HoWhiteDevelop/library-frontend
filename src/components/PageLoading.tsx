import { motion } from "framer-motion";
import styled from "styled-components";

const LoadingWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const LoadingText = styled(motion.div)`
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
`;

const BookSpinner = styled(motion.div)`
  width: 80px;
  height: 120px;
  position: relative;
  background: linear-gradient(45deg, #ff0080, #7928ca);
  border-radius: 8px;
  transform-origin: bottom;
  box-shadow: 0 0 40px rgba(255, 0, 128, 0.2);

  &:before {
    content: "";
    position: absolute;
    left: 8px;
    top: 8px;
    right: 8px;
    bottom: 8px;
    background: #0f172a;
    border-radius: 4px;
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 100%;
    height: 20px;
    background: rgba(0, 0, 0, 0.2);
    filter: blur(10px);
    border-radius: 50%;
  }
`;

const PageLines = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    height: 2px;
    background: linear-gradient(90deg, #ff0080, #7928ca);
    opacity: 0.7;
    border-radius: 1px;
  }
`;

const bookAnimation = {
  initial: { rotateX: 0 },
  animate: {
    rotateX: [0, 30, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const linesAnimation = {
  initial: { width: "10px" },
  animate: {
    width: ["10px", "30px", "10px"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      staggerChildren: 0.2,
    },
  },
};

const fadeInOut = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface PageLoadingProps {
  tip?: string;
}

const PageLoading = ({ tip = "正在加载中..." }: PageLoadingProps) => {
  return (
    <LoadingWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingContent>
        <BookSpinner {...bookAnimation}>
          <PageLines {...linesAnimation}>
            <motion.span {...fadeInOut} />
            <motion.span {...fadeInOut} style={{ delay: "0.2s" }} />
            <motion.span {...fadeInOut} style={{ delay: "0.4s" }} />
          </PageLines>
        </BookSpinner>
        <LoadingText {...fadeInOut}>{tip}</LoadingText>
      </LoadingContent>
    </LoadingWrapper>
  );
};

export default PageLoading;
