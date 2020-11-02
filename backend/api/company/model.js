import mongoose, {
    Schema,
    model
} from 'mongoose';

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    phone: {
        type: Number,
        required: true
    },
    city_id: {
        type: Number,
        required: true
    }
});

const companyModel = model("Company", companySchema);
export default companyModel;