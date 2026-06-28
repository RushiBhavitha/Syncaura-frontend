export default function Avatar({ label, gradient }) {
  return (
    <div
      className={`size-11 text-xl rounded-full flex items-center justify-center
      text-white font-medium bg-linear-to-b ${gradient}`}
    >
      {label}
    </div>
  );
}