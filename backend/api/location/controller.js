import Location from './model';

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
        const location = await Location.findOne({
            "locations.country_id": parseInt(req.params.country)
        });
        if (location) {
            const {
                id,
                locations,
                region
            } = location;
            res.send({
                _id: id,
                locations: locations.find(l => l.country_id == req.params.country),
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
        const city = parseInt(req.params.city);
        const location = await Location.findOne({
            "locations.cities.city_id": city
        });

        if (location) {
            const {
                id,
                locations,
                region
            } = location;
            const cities = locations.find(location => {
                const currentCity = location.cities.find(c => c.city_id === city);
                return currentCity;
            });
            const currentCity = cities.cities.find(c => c.city_id === city);
            res.send({
                _id: id,
                locations: currentCity,
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

const update = (req, res) => {
    requestErrors(req, res);
    try {
        const update = product.update(req.params, req.body);
        update.then(response => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send({
                error: error
            });
        });
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const destroy = (req, res) => {
    requestErrors(req, res);
    try {
        const destroy = product.destroy(req.params);
        destroy.then(response => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send({
                error: error
            });
        });
    } catch (error) {
        res.status(500).send({
            error: error
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