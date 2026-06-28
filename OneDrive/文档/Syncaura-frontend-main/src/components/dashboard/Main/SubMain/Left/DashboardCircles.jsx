import CircularProgress from "./CircularProgress";
import useScreenSize from "./hook/useScreenSize";

const DashboardCircles = () => {
  const width = useScreenSize();

  const is2xl = width >= 1280;

  return (
    <CircularProgress
      value={80}
      radius={!is2xl ? 100 : 120}
      strokeWidth={3}
      color="#3361FF"
      startAngle={150}
      badgeAngle={-50}
    >
      <CircularProgress
        value={60}
        radius={!is2xl ? 70 : 85}
        strokeWidth={2}
        color="#FF6633"
        startAngle={40}
        badgeAngle={130}
        trackColor="#FFE0D6"
      >
        <CircularProgress
          value={40}
          radius={!is2xl ? 32 : 40}
          strokeWidth={1.5}
          color="#2EC938"
          startAngle={50}
          badgeAngle={-30}
          trackColor="#D4F5D7"
        />
      </CircularProgress>
    </CircularProgress>
  );
};
export default DashboardCircles