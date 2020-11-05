import mongoose, {
    Schema,
    model
} from 'mongoose';
import Country from './countrySchema';
const locationSchema = new Schema({
    region: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    locations: [Country.schema]
},{ timestamps: true});

const locationModel = model("Location", locationSchema);
export default locationModel;