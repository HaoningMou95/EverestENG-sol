class Node:
    def __init__(self, weight, parent=None, route=[]):
        self.weight = weight
        self.left = None
        self.right = None
        self.parent = parent
        self.route = route

    def __repr__(self):
        return str(self.weight)


class Pkg:
    def __init__(self, id, weight, distance):
        self.weight = weight
        self.distance = distance
        self.id = id

    def __repr__(self):
        return str(self.id)
        

def max_sum_below_number(id, weight, distance, limit):
    pkgs = []

    for i in range(len(id)):
        pkgs.append(Pkg(id[i], weight[i], distance[i]))
    extra_pkg = Pkg('extra', limit+1, 999)
    pkgs.append(extra_pkg)

    pkgs.sort(key=lambda x: (x.weight, x.distance))
    pkg_order = []

    while len(pkgs) > 1:
        root = Node(0, route=[])
        node_lst = []
        node_lst.append([root])
        max_node = root
        for i in range(len(pkgs)):
            level = []
            nodes = node_lst[i]
            for node in nodes:
                if node.weight > max_node.weight:
                    max_node = node

                if node.weight + pkgs[i].weight > limit:
                    continue

                node.left = Node(node.weight, parent=node, route=node.route)
                level.append(node.left)
                node.right = Node(node.weight + pkgs[i].weight, parent=node, route=node.route + [pkgs[i].id])

                level.append(node.right)
            node_lst.append(level)

        pkg_order.append(max_node.route)
        pkgs = [pkg for pkg in pkgs if pkg.id not in max_node.route]
    return pkg_order

if __name__ == '__main__':
    id = ['pkg1', 'pkg2', 'pkg3', 'pkg4', 'pkg5']
    weight = [50, 75, 175, 110, 155]
    distance = [30, 125, 100, 60, 95]
    pkg_order = max_sum_below_number(id, weight, distance, 200)
    print(pkg_order)
