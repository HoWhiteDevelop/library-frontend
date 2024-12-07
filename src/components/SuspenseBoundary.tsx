import { Suspense } from "react";
import LoadingScreen from "./LoadingScreen";

export const SuspenseBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};
