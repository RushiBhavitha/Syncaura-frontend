import { Hand, Mic, MicOff } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MeetingCard = ({
  gridLayout,
  visibleParticipants,
  localStream,
  isCameraOn,
  isMicOn,
  raisedHands,
}) => {
  return (
    <>
      {[...Array(gridLayout.cols)].map((_, colIndex) => {
        const columnItems = visibleParticipants.filter(
          (_, index) => index % gridLayout.cols === colIndex,
        );

        return (
          <div key={colIndex} className="flex-1 flex flex-col gap-2 h-full">
            <AnimatePresence mode="popLayout">
              {columnItems.map((p) => {
                const isLocal = p.isHost;

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.4, 0, 0.2, 1], // smooth cubic-bezier
                    }}
                
                    className="relative rounded-xl h-full w-full overflow-hidden"
                    style={{ backgroundColor: p.color }}
                  >
                    {isLocal && localStream && isCameraOn ? (
                      <motion.video
                        className="w-full h-full object-cover"
                        ref={(el) => el && (el.srcObject = localStream)}
                        autoPlay
                        muted
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),rgba(0,0,0,0.15))]" />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[35%] md:w-[25%] aspect-square rounded-full flex items-center justify-center
                          bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.3),rgba(0,0,0,0.1))] shadow-lg"
                        >
                          <span className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow">
                            {p.initial}
                          </span>
                        </motion.div>
                      </>
                    )}

                    {/* Raised Hand Animation */}
                    {raisedHands.includes(1) && p.id === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-2 md:top-4 left-2 md:left-3 z-10"
                      >
                        <Hand className="size-5 md:size-6 text-white" />
                      </motion.div>
                    )}

                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute bottom-2 left-2 backdrop-blur px-2 py-1 rounded text-[10px] sm:text-xs md:text-sm lg:text-base 2xl:text-lg"
                    >
                      <span className="text-white font-medium">
                        {p.name}
                      </span>
                    </motion.div>

                    {/* Mic Icon */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full"
                    >
                      {isLocal && isMicOn ? (
                        <Mic size={14} color="white" />
                      ) : (
                        <MicOff size={14} color="white" />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
};

export default MeetingCard;
