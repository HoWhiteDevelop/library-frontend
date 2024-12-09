import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const cursorTrailAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
`;

const CursorDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  transition: all 0.1s ease;
  mix-blend-mode: difference;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  will-change: transform;
  transform-origin: center;
`;

const CursorRing = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid #fff;
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 99998;
  transition: all 0.2s ease-out;
  mix-blend-mode: difference;
  will-change: transform;
  transform-origin: center;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
`;

const Trail = styled.div`
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 9997;
  animation: ${cursorTrailAnimation} 0.5s linear forwards;
`;

interface CursorStyle {
  scale?: string;
  opacity?: string;
  backgroundColor?: string;
  borderColor?: string;
  mixBlendMode?: string;
}

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>({});
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const trailCount = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>();

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });

        // 添加拖尾效果
        if (
          Math.abs(e.clientX - lastPosition.current.x) > 5 ||
          Math.abs(e.clientY - lastPosition.current.y) > 5
        ) {
          trailCount.current++;
          setTrails((prev) =>
            [
              ...prev,
              {
                x: e.clientX,
                y: e.clientY,
                id: trailCount.current,
              },
            ].slice(-10)
          );
          lastPosition.current = { x: e.clientX, y: e.clientY };
        }

        // 检查鼠标所在区域并更新样式
        const target = e.target as HTMLElement;
        const isClickable =
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button" ||
          target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest(".ant-menu-item") ||
          target.closest(".ant-btn") ||
          window.getComputedStyle(target).cursor === "pointer";

        if (isClickable) {
          setCursorStyle({
            scale: "1.5",
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
          });
        } else if (
          target.tagName.toLowerCase() === "input" ||
          target.tagName.toLowerCase() === "textarea" ||
          target.closest(".ant-input") ||
          target.closest(".ant-select")
        ) {
          setCursorStyle({
            scale: "0.8",
            backgroundColor: "#2196F3",
            borderColor: "#2196F3",
          });
        } else {
          setCursorStyle({});
        }
      });
    };

    // 添加防抖以提高性能
    let rafId: number;
    const debouncedUpdate = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updateCursorPosition(e));
    };

    window.addEventListener("mousemove", debouncedUpdate);

    return () => {
      window.removeEventListener("mousemove", debouncedUpdate);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <CursorDot
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          scale: cursorStyle.scale || "1",
          backgroundColor: cursorStyle.backgroundColor,
          mixBlendMode: cursorStyle.mixBlendMode || "difference",
        }}
      />
      <CursorRing
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
          scale: cursorStyle.scale || "1",
          borderColor: cursorStyle.borderColor,
          mixBlendMode: cursorStyle.mixBlendMode || "difference",
        }}
      />
      {trails.map((trail) => (
        <Trail
          key={trail.id}
          style={{
            left: trail.x - 3,
            top: trail.y - 3,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
