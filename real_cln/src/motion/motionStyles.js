// motionStyles.js
export const containerVariants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};
export const containerVariantsTwo = {
  hidden: { opacity: 0, scale: 0.995 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.2 },
  pressed: { scale: 0.8 },
};
