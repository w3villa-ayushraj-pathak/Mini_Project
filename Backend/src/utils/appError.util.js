class AppError extends Error{
    constructor(message,statusCode)
    {
        super(message);
        this.statusCode=statusCode
        this.success=false
        this.isOperational=true
        
        Error.captureStackTrace(this,this.constructor)
    }
}

let app=new AppError('error while login',401)

module.exports=AppError