class Node {
  constructor(weight = 0, parent = null, route = []) {
    this.weight = weight
    this.parent = parent
    this.route = route
    this.left = null
    this.right = null
  }
}

class Package {
  constructor(id, weight, distance) {
    this.id = id
    this.weight = weight
    this.distance = distance
  }
}

const getPackageOrder = (list, limit) => {
  const pkgs = []

  for (let i = 0; i < list.length; i++) {
    pkgs.push(new Package(list[i].id, list[i].weight, list[i].distance))
  }

  // create an extra package to represent the limit
  const extraPkg = new Package('extra', limit + 1, 999)
  pkgs.push(extraPkg)

  // sort by weight and distance
  let sortedPkgs = sortByWeightAndDistance(pkgs)

  let pkgOrder = []

  // create a tree to implement the knapsack algorithm
  while (sortedPkgs.length > 1) {
    const root = new Node(0, null, [])
    const nodeLst = []
    nodeLst.push([root])
    let maxNode = root

    for (let i = 0; i < sortedPkgs.length; i++) {
      const level = []
      const nodes = nodeLst[i]

      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].weight > maxNode.weight) {
          maxNode = nodes[j]
        }
        if (nodes[j].weight + sortedPkgs[i].weight > limit) continue

        nodes[j].left = new Node(nodes[j].weight, nodes[j], nodes[j]['route'])
        level.push(nodes[j].left)

        const route = nodes[j].route.concat([sortedPkgs[i].id])
        nodes[j].right = new Node(nodes[j].weight + sortedPkgs[i].weight, nodes[j], route)

        level.push(nodes[j].right)
      }
      nodeLst.push(level)
    }
    pkgOrder.push(maxNode.route)
    // remove the packages that have been picked
    sortedPkgs = sortedPkgs.filter((pkg) => !maxNode.route.includes(pkg.id))
  }
  pkgOrder = getDistanceForEachPkg(pkgOrder, list)
  return pkgOrder
}

const getDistanceForEachPkg = (pkgOrder, list) => {
  const pkgListWithDistance = []
  for (let i = 0; i < pkgOrder.length; i++) {
    const pkgList = []
    for (item in pkgOrder[i]) {
      const pkg = list.find((listItem) => listItem.id === pkgOrder[i][item])
      pkgList.push({
        id: pkg.id,
        distance: pkg.distance
      })
    }
    pkgListWithDistance.push(pkgList)

  }
  return pkgListWithDistance
}

const sortByWeightAndDistance = (pkgs) => {
  pkgs.sort((a, b) => {
    if (a.weight === b.weight) {
      return a.distance - b.distance
    }
    return a.weight - b.weight
  })

  return pkgs
}

module.exports = { getPackageOrder }