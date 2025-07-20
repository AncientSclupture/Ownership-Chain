export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "0.5rem",
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}) {
  return (
    <div
      className="animate-pulse bg-gray-300"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: borderRadius,
      }}
    />
  );
}

export function LoadingComponent() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex w-[300px] flex-col gap-4 p-5">
        <Skeleton height={20} width="100%" />
        <Skeleton height={20} width="100%" />
        <Skeleton height={20} width="80%" />
        <Skeleton height={40} width="100%" />
      </div>
    </div>
  );
}
