// ApiError class bana rahe hain.
// Ye JavaScript ke built-in Error class ko inherit karti hai.
// Matlab ApiError ke paas Error ki sari properties aur features honge.
class ApiError extends Error {

    // Constructor object create hote hi automatically call hota hai.
    constructor(

        // HTTP Status Code
        statusCode,

        // Error Message
        message = "Something went wrong",

        // Validation ya multiple errors store karne ke liye array
        errors = [],

        // Optional custom stack trace
        stack = ""

    ) {

        // Parent Error class ka constructor call kar rahe hain.
        // Isse original error message Error object me store hota hai.
        super(message);

        // HTTP status code save kar rahe hain.
        this.statusCode = statusCode;

        // Error response me data nahi hota.
        // Isliye null assign kar rahe hain.
        this.data = null;

        // Error message save kar rahe hain.
        this.message = message;

        // Error response hai isliye success hamesha false rahega.
        this.success = false;

        // Extra errors store karne ke liye.
        // Example:
        // ["Email already exists", "Password is weak"]
        this.errors = errors;

        // Agar custom stack diya gaya hai
        if (stack) {

            // Wahi stack use karo.
            this.stack = stack;

        } else {

            // Warna JavaScript automatically stack trace generate karegi.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Dusri files me use karne ke liye export kar rahe hain.
export { ApiError };