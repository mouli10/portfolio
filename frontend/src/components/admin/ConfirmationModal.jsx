import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'bg-red-500 hover:bg-red-600' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-yellow-500/10 rounded-full">
                                <FaExclamationTriangle className="text-yellow-500 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm()
                                    onClose()
                                }}
                                className={`px-4 py-2 text-white rounded-lg transition-all font-medium ${confirmColor}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ConfirmationModal
