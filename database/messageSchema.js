import mongoose from "mongoose";

// Define a schema
const messageSchema = new mongoose.Schema(
  {
    auther: String,
    id: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

// Create a model based on the schema
const Message = mongoose.model("Message", messageSchema);

export default Message;
// Example: Create a new user
// const newUser = new User({ name: 'John Doe', age: 30 });
// newUser.save()
//   .then(() => console.log('User created'))
//   .catch(err => console.error('Error creating user:', err));
