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

  const extra_pkg = new Package('extra', limit + 1, 999)
  pkgs.push(extra_pkg)

  let sorted_pkgs = sortByWeightAndDistance(pkgs)

  let pkg_order = []

  while (sorted_pkgs.length > 1) {
    const root = new Node(0, null, [])
    const node_lst = []
    node_lst.push([root])
    let max_node = root

    for (let i = 0; i < sorted_pkgs.length; i++) {
      const level = []
      const nodes = node_lst[i]

      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].weight > max_node.weight) {
          max_node = nodes[j]
        }
        if (nodes[j].weight + sorted_pkgs[i].weight > limit) continue

        nodes[j].left = new Node(nodes[j].weight, nodes[j], nodes[j]['route'])
        level.push(nodes[j].left)

        const route = nodes[j].route.concat([sorted_pkgs[i].id])
        nodes[j].right = new Node(nodes[j].weight + sorted_pkgs[i].weight, nodes[j], route)

        level.push(nodes[j].right)
      }
      node_lst.push(level)
    }
    pkg_order.push(max_node.route)
    sorted_pkgs = sorted_pkgs.filter((pkg) => !max_node.route.includes(pkg.id))
  }
  pkg_order = getDistanceForEachPkg(pkg_order, list)
  return pkg_order
}

const getDistanceForEachPkg = (pkg_order, list) => {
  const pkgListWithDistance = []
  for (let i = 0; i < pkg_order.length; i++) {
    const pkgList = []
    for (item in pkg_order[i]) {
      const pkg = list.find((listItem) => listItem.id === pkg_order[i][item])
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

// pkgs = [
//   {
//     id: 'pkg1',
//     weight: 50,
//     distance: 30
//   },
//   {
//     id: 'pkg2',
//     weight: 75,
//     distance: 125
//   },
//   {
//     id: 'pkg3',
//     weight: 175,
//     distance: 100
//   },
//   {
//     id: 'pkg4',
//     weight: 110,
//     distance: 60
//   },
//   {
//     id: 'pkg5',
//     weight: 155,
//     distance: 95
//   }
// ]

// console.log(getPackageOrder(pkgs, 200))

module.exports = { getPackageOrder }
