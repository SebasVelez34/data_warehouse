import Location from './model';
import mongoose from 'mongoose';
const index = async (req, res) => {
    try {
        const locations = await Location.find();
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

const store = async (req, res) => {
    try {
        const location = new Location({
            region: req.body.region,
            locations: req.body.locations
        });
        if (location) {
            const newLocation = await location.save();
            if (newLocation) {
                res.send({
                    _id: newLocation.id,
                    locations: newLocation.name,
                })
            } else {
                res.status(401).send({
                    msg: "Invalid locations data"
                });
            }
        }
    } catch (error) {
        res.status(401).send({
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
            res.status(401).send({
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
            res.status(401).send({
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
            res.status(401).send({
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
            res.status(401).send({
                msg: "Invalid locations data"
            });
        }
    } catch (error) {
        res.status(401).send({
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
            res.status(401).send({
                msg: "Invalid locations data"
            });
        }
    } catch (error) {
        res.status(401).send({
            msg: error.message
        });
    }
}

export {
    index,
    store,
    showRegion,
    showCountry,
    showCity,
    update,
    destroy
}