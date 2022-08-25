const { OFFERS, WEIGHT_UNIT_PRICE, DISTANCE_UNIT_PRICE } = require('./constants')
const prompt = require('prompt')
const { getPackageOrder } = require('./algorithm')

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
  } else {
    console.log('Invalid Offer Code. Inputted code: ', offerCode)
    return {
      discount: 0,
      totalCost: _floorNumber(originalCost - discount) 
    }
  }
  return {
    discount,
    totalCost: _floorNumber(originalCost - discount) 
  }
}

const commandLineInput = () => {
  prompt.start()

  let pkgs = []
  let moneyCostResult = []
  let timeCostResult = []
  // get base cost and number of packages
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

    //get each packages info
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

        if (!PKG_ID || isNaN(WEIGHT) || isNaN(DISTANCE) || !OFFER_CODE || WEIGHT < 1 || DISTANCE < 1) {
          return onStep2Err(`Invalid Inputs For Package${i}: `, result[`PKG_${i}_INFO`])
        }
        OFFER_CODE_UPPERCASE = OFFER_CODE.toUpperCase()
        pkgs.push({ id: PKG_ID, weight: WEIGHT, distance: DISTANCE, offerCode: OFFER_CODE_UPPERCASE })
        moneyCostResult.push({
          id: PKG_ID,
          ...calculateDiscount(OFFER_CODE_UPPERCASE, DISTANCE, WEIGHT, BASE_COST)
        })
      }

      // get delivery time info and calculate delivery time
      prompt.get(['VEHICLE_NO&MAX_SPEED&MAX_WEIGHT'], function (err, result) {
        if (err) {
          return onStep1Err('Invalid Inputs For VEHICLE_NO&MAX_SPEED&MAX_WEIGHT: ', result)
        }

        const formatStep3ToArray = result['VEHICLE_NO&MAX_SPEED&MAX_WEIGHT'].split(' ')
        const VEHICLE_NO = parseFloat(formatStep3ToArray[0])
        const MAX_SPEED = parseInt(formatStep3ToArray[1])
        const MAX_WEIGHT = parseInt(formatStep3ToArray[2])

        if (isNaN(VEHICLE_NO) || isNaN(MAX_SPEED) || isNaN(MAX_WEIGHT) || VEHICLE_NO < 1 || MAX_SPEED < 1 || MAX_WEIGHT < 1) {
          console.log('step 3')
          return onStep1Err('Invalid Inputs For VEHICLE_NO&MAX_SPEED&MAX_WEIGHT: ', result)
        }

        timeCostResult = getTimeCost(pkgs, MAX_WEIGHT, MAX_SPEED)

        // get package delivery time
        const pkgTimeAndMoneyCost = getOrderTimeAndMoneyCost(timeCostResult, moneyCostResult)
        const finalResult = getDeliveryTime(pkgTimeAndMoneyCost, VEHICLE_NO)
        
        displayResult(finalResult)
      })
    })
  })
}

const _floorNumber = (num) => {
  return Math.floor(num * 100) / 100
}

const displayResult = (finalResult) => {
  const sortedResult = finalResult.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
  for (item of sortedResult) {
    console.log(item.id, ' ', _floorNumber(item.discount), ' ', _floorNumber(item.totalCost), ' ', _floorNumber(item.arriveTime))
  }
}

const getDeliveryTime = (pkgTimeAndMoneyCost, VEHICLE_NO) => {
  const vehicles = new Array(VEHICLE_NO).fill({ currentTime: 0 })
  let pkgTimeAndMoneyCostCopy = []

  // assign each package to a vehicle
  while (pkgTimeAndMoneyCost.length > 0) {
    // find available vehicle
    minIndex = findMinTimeVehicle(vehicles)
    if (pkgTimeAndMoneyCost && pkgTimeAndMoneyCost.length > 0) {
      vehicles[minIndex] = { ...vehicles[minIndex], info: pkgTimeAndMoneyCost.shift() }
      let maxPackageTime = getMaxTime(vehicles[minIndex].info)
      // update vehicle time & package arrive time
      if (vehicles[minIndex].info) {
        for (package of vehicles[minIndex].info) {
          if (package.time < maxPackageTime) {
            pkgTimeAndMoneyCostCopy.push({
              ...package,
              arriveTime: package.time + vehicles[minIndex].currentTime
            })
          } else {
            pkgTimeAndMoneyCostCopy.push({
              ...package,
              arriveTime: maxPackageTime + vehicles[minIndex].currentTime
            })
          }
        }
      }
      vehicles[minIndex].currentTime += maxPackageTime * 2
    }
  }
  return pkgTimeAndMoneyCostCopy
}

const getMaxTime = (info) => {
  return info.reduce((acc, cur) => {
    return acc.distance > cur.distance ? acc : cur
  }).time
}

const findMinTimeVehicle = (vehicles) => {
  let min = -1
  for (let i = 0; i < vehicles.length; i++) {
    if (min === -1 || vehicles[i].currentTime < vehicles[min].currentTime) {
      min = i
    }
  }
  return min
}

const getOrderTimeAndMoneyCost = (timeCostResult, moneyCostResult) => {
  for (let i = 0; i < timeCostResult.length; i++) {
    for (item in timeCostResult[i]) {
      const pkg = moneyCostResult.find((listItem) => listItem.id === timeCostResult[i][item].id)
      timeCostResult[i][item] = { ...timeCostResult[i][item], ...pkg }
    }
  }
  const pkgTimeAndMoneyCost = timeCostResult
  return pkgTimeAndMoneyCost
}

const getTimeCost = (pkgs, limit, speed) => {
  const pkgs_order = getPackageOrder(pkgs, limit)
  for (let i = 0; i < pkgs_order.length; i++) {
    for (let j = 0; j < pkgs_order[i].length; j++) {
      pkgs_order[i][j] = {
        ...pkgs_order[i][j],
        time: _floorNumber(pkgs_order[i][j].distance / speed)
      }
    }
  }

  return pkgs_order
}

onStep1Err = (err, result) => {
  console.log(err + result['BASE_COST_&_PACKAGE_NO'])
  return 1
}

onStep2Err = (err, result) => {
  console.log(err + result)
  return 1
}

commandLineInput()
