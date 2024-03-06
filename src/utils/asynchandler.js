// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//   } catch (error) {
//     await fn(req, res, next);
//     res.status(err.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//     console.log(error);
//   }
// };

// export { asyncHandler };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
export { asyncHandler };
