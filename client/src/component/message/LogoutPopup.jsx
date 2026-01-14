import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import warningIcon from '../../assets/icons/warning.png';

const LogoutPopup = ({ setLogoutPopup }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true); // control visibility for animation

  const handleLogout = () => {
    const removeItems = ['Token', 'UserId', 'UserName', 'Role'];
    removeItems.forEach((item) => localStorage.removeItem(item));
    navigate('/');
  };

  const handleCancel = () => {
    // trigger exit animation first
    setIsVisible(false);
    setTimeout(() => setLogoutPopup(false), 300); // match exit animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-dvw h-dvh fixed top-0 left-0 z-50 bg-black/30 flex justify-center items-center px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="max-w-sm w-full bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center gap-3 text-center dark:bg-slate-900"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={warningIcon} alt="Warning Icon" width={80} className="mb-2" />

            <h3 className="text-3xl font-extrabold dark:text-white">Logout</h3>
            <p className="text-slate-700 dark:text-slate-200 text-base">
              Are you sure want to logout?
            </p>

            <div className="flex gap-5">
              <button
                onClick={handleCancel}
                className="mt-4 bg-slate-400 hover:bg-slate-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutPopup;