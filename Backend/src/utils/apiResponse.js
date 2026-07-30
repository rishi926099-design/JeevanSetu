// ApiResponse naam ki ek class bana rahe hain.
// Is class ka kaam har successful API response ko ek standard format me bhejna hai.
class ApiResponse {

    // Constructor tab automatically call hota hai
    // jab hum "new ApiResponse()" likhte hain.
    constructor(statusCode, data, message = "success") {

        // HTTP Status Code store kar rahe hain.
        // Example:
        // 200 -> OK
        // 201 -> Created
        // 204 -> No Content
        this.statusCode = statusCode;

        // Client ko jo actual data bhejna hai
        // (User, Patient, Doctor, Hospital, etc.)
        this.data = data;

        // Response message store kar rahe hain.
        // Agar message pass nahi kiya to default "success" use hoga.
        this.message = message;

        // Success true ya false automatically decide hoga.
        // Agar status code 400 se chhota hai
        // (200, 201, 204...)
        // to success = true
        // warna false.
        this.success = statusCode < 400;
    }
}