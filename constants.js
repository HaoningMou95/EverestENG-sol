const OFFERS = {
  OFR001: {
    discount: 0.1,
    distanceMin: 0,
    distanceMax: 200,
    weightMin: 70,
    weightMax: 200
  },
  OFR002: {
    discount: 0.07,
    distanceMin: 50,
    distanceMax: 150,
    weightMin: 100,
    weightMax: 250
  },
  OFR003: {
    discount: 0.05,
    distanceMin: 50,
    distanceMax: 250,
    weightMin: 10,
    weightMax: 150
  }
}

const WEIGHT_UNIT_PRICE = 10
const DISTANCE_UNIT_PRICE = 10
module.exports = { OFFERS, WEIGHT_UNIT_PRICE, DISTANCE_UNIT_PRICE }
