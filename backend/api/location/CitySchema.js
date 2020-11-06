import mongoose, {
    Schema,
    model
} from 'mongoose';

const citySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    country_id:{
        type: Schema.ObjectId, ref: 'Country',
    }
},{ _id: true, timestamps: true });

const cityModel = model("City", citySchema);
export default cityModel;