import { model, Schema } from "mongoose";
import { INotification, NotificationType } from "./notification.interface";


const notificationSchema= new Schema<INotification>(
  {
    userId:{type:Schema.Types.ObjectId, ref:"User", required:true, index:true},
    title:{type:String, required:true, trim:true},
    message:{type:String, required:true, trim:true},
    type:{type:String, enum:Object.values(NotificationType), required:true},
    isRead:{type:Boolean, default:false},
  },
  {timestamps:true, versionKey:false},
) 


export const NotificationModel= model<INotification>("Notification",
  notificationSchema,
)