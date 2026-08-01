import mongoose from "mongoose";


const soupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    userId:{type:String, required:true}

},{timestamps: true});

export const Soup = mongoose.model("Soup", soupSchema);