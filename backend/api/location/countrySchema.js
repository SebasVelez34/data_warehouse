import mongoose, {
    Schema,
    model
} from 'mongoose';
const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    region_id : {
        type: Schema.ObjectId, ref: 'Region',
    }
},{ _id: true, timestamps: true });

const countryModel = model("Country", countrySchema);
export default countryModel;