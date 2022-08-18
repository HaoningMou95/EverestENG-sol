const { OFFERS, WEIGHT_UNIT_PRICE, DISTANCE_UNIT_PRICE } = require('./constants')
const prompt = require('prompt')

// todo: offer code to Upper case
const calculateDiscount = (offerCode, distance, weight, BASE_COST) => {
  let offerObj = null
  let discount = 0
  const originalCost = BASE_COST + weight * WEIGHT_UNIT_PRICE + distance * DISTANCE_UNIT_PRICE

  if (validateOffer(offerCode)) {
    offerObj = OFFERS[offerCode]

    if (validateDistanceAndWeight(offerObj, distance, weight)) {
      discount = originalCost * offerObj.discount
    }
  }
  return {
    discount,
    totalCost: originalCost - discount
  }
}

const commandLineInput = () => {
    prompt.start()
}

const validateOffer = (offerCode) => {
  const valid = offerCode in OFFERS
  return valid
}

const validateDistanceAndWeight = (offerObj, distance, weight) => {
  const valid = offerObj.distanceMin <= distance && offerObj.distanceMax >= distance && offerObj.weightMin <= weight && offerObj.weightMax >= weight
  return valid
}

console.log(calculateDiscount('OFR003', 100, 10, 100))
