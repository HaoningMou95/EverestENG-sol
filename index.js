const { OFFERS, WEIGHT_UNIT_PRICE, DISTANCE_UNIT_PRICE } = require('./constants')
const prompt = require('prompt')

const validateOffer = (offerCode) => {
  const valid = offerCode in OFFERS
  return valid
}

const validateDistanceAndWeight = (offerObj, distance, weight) => {
  const valid = offerObj.distanceMin <= distance && offerObj.distanceMax >= distance && offerObj.weightMin <= weight && offerObj.weightMax >= weight
  return valid
}

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
  else {
    console.log('Invalid Offer Code for below package. Inputted code: ', offerCode)
    return {
        discount: 0,
        totalCost: originalCost - discount
    }
  }
  return {
    discount,
    totalCost: originalCost - discount
  }
}

// todo: offer code to Upper case
const commandLineInput = () => {
  prompt.start()

  prompt.get(['BASE_COST_&_PACKAGE_NO'], function (err, result) {
    if (err) {
      return onStep1Err('Invalid Inputs For BASE_COST_&_PACKAGE_NO: ', result)
    }
    //get and validate BASE_COST / PACKAGE_NO
    const formatStep1ToArray = result['BASE_COST_&_PACKAGE_NO'].split(' ')
    const BASE_COST = parseFloat(formatStep1ToArray[0])
    const PACKAGE_NO = parseInt(formatStep1ToArray[1])
    if (isNaN(BASE_COST) || isNaN(PACKAGE_NO) || PACKAGE_NO < 1 || BASE_COST <= 0) {
                console.log('step 2')
      return onStep1Err('Invalid Inputs For BASE_COST_&_PACKAGE_NO: ', result)
    }
    //get all packages command instruction
    const getStep2Key = () => {
      let arr = []
      for (let i = 1; i <= PACKAGE_NO; i++) {
        arr.push(`PKG_${i}_INFO`)
      }
      return arr
    }
    //input each packages info
    prompt.get(getStep2Key(), function (err, result) {
      if (err) {
        return onStep2Err(`Invalid Inputs For Package Info: `, result)
      }
      // calculate each package discount and total cost
      for (let i = 1; i <= PACKAGE_NO; i++) {
        const formatStep2ToArray = result[`PKG_${i}_INFO`].split(' ')
        const PKG_ID = formatStep2ToArray[0]
        const WEIGHT = parseFloat(formatStep2ToArray[1])
        const DISTANCE = parseFloat(formatStep2ToArray[2])
        const OFFER_CODE = formatStep2ToArray[3]
        //todo handle err
        if ((!PKG_ID || isNaN(WEIGHT) || isNaN(DISTANCE) || !OFFER_CODE)
            || (WEIGHT < 1 || DISTANCE < 1)
        ) {
          return onStep2Err(`Invalid Inputs For Package${i}: `, result[`PKG_${i}_INFO`])
        }
        OFFER_CODE_UPPERCASE = OFFER_CODE.toUpperCase()
        const calculationResult = calculateDiscount(OFFER_CODE_UPPERCASE, DISTANCE, WEIGHT, BASE_COST)
        console.log(`${PKG_ID} ${calculationResult.discount} ${calculationResult.totalCost}`)
      }
    })
  })

  function onStep1Err(err, result) {
    console.log(err + result['BASE_COST_&_PACKAGE_NO'])
    return 1
  }

  function onStep2Err(err, result) {
    console.log(err + result)
    return 1
  }
}

commandLineInput()
