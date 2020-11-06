import mongoose, {
    Schema,
    model
} from 'mongoose';
const regionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
},{ timestamps: true});

const regionModel = model("Region", regionSchema);
export default regionModel;