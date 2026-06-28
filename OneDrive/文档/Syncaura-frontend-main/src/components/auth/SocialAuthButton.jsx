import { motion } from "framer-motion";

const SocialAuthButton = ({ icon, alt, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.06,
        boxShadow: "0px 8px 20px rgba(0,0,0,0.12)"
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 18
      }}
      className="flex items-center justify-center py-2 px-7 bg-white border border-[#BCBEC0] rounded-md"
    >
      <motion.img
        src={icon}
        alt={alt}
        className="size-5"
        whileHover={{ rotate: 6 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
    </motion.button>
  );
};

export default SocialAuthButton;
