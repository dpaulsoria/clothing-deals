import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaDatabase, FaCloud } from 'react-icons/fa';

interface LoadingScreenProps {
    isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.5,
                when: "afterChildren",
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        },
        exit: {
            y: 20,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[8050]"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                >
                    <motion.div
                        className="bg-white bg-opacity-10 p-12 rounded-3xl shadow-2xl backdrop-blur-md"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col items-center">
                            <motion.div
                                className="text-6xl text-indigo-400"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <FaSpinner />
                            </motion.div>
                            <motion.h2
                                className="mt-8 text-3xl font-bold text-white"
                                variants={itemVariants}
                            >
                                Cargando datos
                            </motion.h2>
                            <motion.p
                                className="mt-4 text-xl text-gray-300"
                                variants={itemVariants}
                            >
                                Por favor, espere un momento
                            </motion.p>
                            <motion.div
                                className="mt-8 flex space-x-4"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="text-4xl text-pink-400"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <FaDatabase />
                                </motion.div>
                                <motion.div
                                    className="text-4xl text-purple-400"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                                >
                                    <FaCloud />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};