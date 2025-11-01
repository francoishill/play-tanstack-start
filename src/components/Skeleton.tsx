import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "0.25rem",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#f1f3f4",
        background:
          "linear-gradient(90deg, #f1f3f4 25%, #e3e5e8 50%, #f1f3f4 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.5s infinite",
      }}
    />
  );
}

export function ButtonSkeleton() {
  return <Skeleton width="280px" height="36px" borderRadius="0.25rem" />;
}

export function TitleSkeleton() {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <Skeleton width="400px" height="2rem" borderRadius="0.25rem" />
    </div>
  );
}

export function TextSkeleton({ width = "300px" }: { width?: string }) {
  return <Skeleton width={width} height="1rem" borderRadius="0.25rem" />;
}

export function PaperSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #e9ecef",
        borderRadius: "0.25rem",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
}

export function ContainerSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      {children}
    </div>
  );
}

export function StackSkeleton({
  children,
  gap = "1rem",
}: {
  children: React.ReactNode;
  gap?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {children}
    </div>
  );
}
