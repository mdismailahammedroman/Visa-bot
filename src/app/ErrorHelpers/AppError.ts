class AppError extends Error {
  public statusCode: number; // HTTP status code রাখা হবে এখানে (যেমন 400, 404, 500)

  constructor(statusCode: number, message: string, stack = "") {
    super(message); // Error base class এ message পাঠানো
    this.statusCode = statusCode; // statusCode সেট করা

    if (!stack) {
      this.stack = stack; // যদি stack দেওয়া হয় সেট করা
    } else {
      Error.captureStackTrace(this, this.constructor); // এটি call stack ঠিক রাখে
    }
  }
}
export default AppError; // অন্য ফাইল থেকে ব্যবহার করার জন্য export
