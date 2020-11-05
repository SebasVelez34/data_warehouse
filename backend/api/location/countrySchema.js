import mongoose, {
    Schema,
    model
} from 'mongoose';
import City from './CitySchema';
const countrySchema = new Schema({
    country_name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    cities: [City.schema]
},{ _id: true, timestamps: true });

const countryModel = model("Country", countrySchema);
export default countryModel;