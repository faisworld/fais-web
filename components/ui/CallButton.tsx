import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';

// Utility to join class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CallButtonProps {
  isCalling: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  disabled?: boolean;
  name?: string;
  children?: React.ReactNode;
}

export const CallButton: React.FC<CallButtonProps> = ({
  isCalling,
  isSpeaking,
  onClick,
  disabled = false,
  name = "FAIS Agent",
  children,
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Aura Effect */}
      <AnimatePresence>
        {isCalling && (
          <motion.div
            key="aura"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{
              scale: isSpeaking ? 1.2 : 1,
              opacity: isSpeaking ? 0.7 : 0.5,
              boxShadow: isSpeaking
                ? '0 0 0 16px rgba(34,197,94,0.25)'
                : '0 0 0 10px rgba(34,197,94,0.15)',
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute z-0 rounded-full w-full h-full"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      {/* Button */}
      <motion.button
        type="button"
        name={name}
        onClick={onClick}
        disabled={disabled}
        whileHover={{
          scale: 1.12,
          boxShadow: '0 0 0 8px rgba(34,197,94,0.25)',
          background: isCalling
            ? 'linear-gradient(90deg,#ef4444,#f59e42)'
            : 'linear-gradient(90deg,#22c55e,#3b82f6)',
        }}
        whileTap={{
          scale: 0.96,
          background: isCalling
            ? 'linear-gradient(90deg,#b91c1c,#f59e42)'
            : 'linear-gradient(90deg,#15803d,#2563eb)',
        }}
        animate={{
          background: isCalling
            ? 'linear-gradient(90deg,#ef4444,#f59e42)'
            : 'linear-gradient(90deg,#22c55e,#3b82f6)',
          boxShadow: isCalling
            ? '0 0 16px 4px rgba(239,68,68,0.25)'
            : '0 0 16px 4px rgba(34,197,94,0.15)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className={cn(
          'relative z-10 px-8 py-4 rounded-full font-bold text-white text-lg shadow-lg transition-colors duration-200 focus:outline-none',
          'ring-2 ring-offset-2 ring-green-400/40',
          isCalling ? 'ring-red-400/40' : 'ring-green-400/40'
        )}
      >
        {children || (
          isCalling ? (
            'Stop Call'
          ) : (
            <span className="flex items-center gap-2 text-lg">
              <motion.span
              initial={{ rotate: -15 }}
              animate={{ rotate: [ -15, 15, -15 ] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
              className="inline-block"
              >
              <FiPhoneCall className="text-2xl text-white drop-shadow" />
              </motion.span>
              <span className="font-bold">fAIs</span> 
            </span>
            
          )
        )}
      </motion.button>
    </div>
  );
};

export default CallButton;
