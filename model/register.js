
const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require('dotenv').config();

const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tokens: [{ token: { type: String, required: true } }] 
});




registrationSchema.methods.generateAuthToken = async function () {
  try {
      const token = jwt.sign(
          { _id: this._id.toString() },
          process.env.SECRET_KEY || 'subhashkumarisagreatboyfrombihar'
      );
      console.log("Generated token:", token);
      this.tokens = this.tokens.concat({ token: token });
      await this.save(); // Check if there is an issue during save
      console.log("Token saved to user");
      return token;
  } catch (error) {
      console.log("Error generating token:", error);
      throw new Error("Token generation failed");
  }
};


  // registrationSchema.pre("save",async function(next){
  //   if(this.isModified("password")){
       
  //      this.password=await bcrypt.hash(this.password,10);
  //   }
  //   next();
  // })
  

const Register = new mongoose.model("Register", registrationSchema);
module.exports = Register;
