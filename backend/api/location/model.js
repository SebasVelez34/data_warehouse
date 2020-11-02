import mongoose, {
    Schema,
    model
} from 'mongoose';

const locationSchema = new Schema({
    region: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    locations: {
        type: Array,
        required: true
    }
});

const locationModel = model("Location", locationSchema);
export default locationModel;