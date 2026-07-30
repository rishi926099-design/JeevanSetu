// asyncHandler ek Higher Order Function (HOF) hai.
// Ye kisi bhi async controller function ko receive karta hai.
const asyncHandler = (requestHandler) =>

  // Ye Express middleware function return karta hai.
  // Express automatically req, res aur next pass karta hai.
  (req, res, next) =>

    // requestHandler (controller) ko execute karo.
    // Promise.resolve ensure karta hai ki agar function Promise return kare
    // ya async function ho to usse safely handle kiya ja sake.
    Promise.resolve(

      // Actual controller call ho raha hai.
      // Example:
      // registerUser(req, res, next)
      requestHandler(req, res, next)

    )

    // Agar controller ke andar koi bhi error aata hai
    // (throw Error ya rejected Promise),
    // to ye catch us error ko receive karega.
    .catch(

      // Error ko Express ke next middleware ke paas bhej do.
      // next(err) -> Global Error Handler execute karega.
      (err) => next(err)

    );

// asyncHandler ko dusri files me use karne ke liye export kar rahe hain.
export { asyncHandler };




export {asyncHandler}

//const asyncHandeler = (fn) =>{}
//const asyncHandeler = (fn) => () => {}
//const asyncHandeler = (fn) => async ()=>{}

// const asyncHandeler = (fn) => async (req, res, next){
//   try{
//     await fn(req,res ,next)
//   }catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
//   );
//   )
// }
    //           registerUser()
    //                 ▲
    //                 │
    //       requestHandler
    //                 ▲
    //                 │
    //      asyncHandler()
    //                 │
    //  ┌──────────────┴──────────────┐
    //  │ Executes your controller    │
    //  │ Catches async errors        │
    //  │ Calls next(err) if needed   │
    //  └──────────────┬──────────────┘
    //                 │
    //                 ▼
    //     Express Error Middleware
    //                 │
    //                 ▼
    //           Client Response