import Region from './model';
import Country from './countrySchema';
import City from './citySchema';
import mongoose from 'mongoose';
const index = async (req, res) => {
    try {
        const locations = await Region.find();
        if (locations.length === 0) {
            res.status(204).send(locations);
        }
        res.send(locations);
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
};

const storeRegion = async (req, res) => {
    try {
        const region = new Region({
            name: req.body.name,
        });
        if(region){
            const newRegion = await region.save();
            if(newRegion){
                res.status(200).send({
                    id: newRegion._id,
                    name: newRegion.name
                });
            }
        } 
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

const storeCountry = async (req, res) => {
    try {
        const country = new Country({
            name: req.body.name,
            region_id: req.body.region_id
        });
        if(country){
            const newCountry = await country.save();
            if(newCountry){
                res.status(200).send({
                    id: newCountry._id,
                    name: newCountry.name,
                    region_id: newCountry.region_id
                });
            }
        } 
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

const storeCity = async (req, res) => {
    try {
        const city = new City({
            name: req.body.name,
            country_id: req.body.country_id
        });
        if(city){
            const newCity = await city.save();
            if(newCity){
                res.status(200).send({
                    id: newCity._id,
                    name: newCity.name,
                    country_id: newCity.country_id
                });
            }
        } 
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

const showRegion = async (req, res) => {
    try {
        const location = await Location.findOne({
            _id: req.params.region
        });
        if (location) {
            res.send({
                _id: location.id,
                locations: location.locations,
                region: location.region
            })
        } else {
            res.status(500).send({
                msg: "Error finding region"
            });
        }
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const showCountry = async (req, res) => {
    try {
        const country_id = mongoose.Types.ObjectId(req.params.country);
        const location = await Location.findOne({
            "locations._id" : country_id
        });
        if (location) {
            const {
                id,
                locations,
                region
            } = location;
            res.send({
                _id: id,
                locations: locations.find(l => l.id == country_id),
                region: region
            })
        } else {
            res.status(500).send({
                msg: "Error finding country"
            });
        }
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const showCity = async (req, res) => {
    try {
        const city_id = mongoose.Types.ObjectId(req.params.city);
        const location = await Location.findOne({
            "locations.cities._id": city_id
        });
        if (location) {
            const {
                id,
                locations,
                region
            } = location;
            console.log(locations);
            const cities = locations.find(location => {
                const currentCity = location.cities.find(c => c.id == city_id);
                return currentCity;
            });
            console.log(cities);
            const currentCity = cities.cities.find(c => c.id == city_id);
            res.send({
                _id: id,
                locations: currentCity,
                region: region
            })
        } else {
            res.status(500).send({
                msg: "Error finding city"
            });
        }
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const update = async(req, res) => {
    try {
        const location = await Location.findOneAndUpdate(
            { _id: req.params.location },
            {
                $set: req.body
            }
        );
        if (location) {
            res.send({
                _id: location.id,
                locations: location.locations,
                region: location.region
            })
        } else {
            res.status(500).send({
                msg: "Invalid locations data"
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

const destroy = async (req, res) => {
    try {
        const location = await Location.deleteOne({
            _id: req.params.location
        });
        if (location) {
            res.status(200).send({
                msg: "Location Deleted"
            });
        } else {
            res.status(500).send({
                msg: "Invalid locations data"
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

export {
    index,
    storeRegion,
    storeCountry,
    storeCity,
    showRegion,
    showCountry,
    showCity,
    update,
    destroy
}