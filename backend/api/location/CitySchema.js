import mongoose, {
    Schema,
    model
} from 'mongoose';

const citySchema = new Schema({
    city_name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    }
},{ _id: true, timestamps: true });

const cityModel = model("City", citySchema);
export default cityModel;