
// Iska kaam
// Har async controller ko wrap karega.
// Agar koi error aayega to automatically errorMiddleware ko bhej dega.
// Har controller me try...catch likhne ki zarurat nahi padegi.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;