class Node:
    def __init__(self, value, parent=None, route=[]):
        self.value = value
        self.left = None
        self.right = None
        self.parent = parent
        self.route = route
        
    def __repr__(self):
        return str(self.value)


def max_sum_below_number(lst, limit):
    lst = sorted(lst)
    root = Node(0, route=[0])
    node_lst = []
    node_lst.append([root])
    max_node = root
    max_distance = root
    for i in range(len(lst)):
        level = []
        nodes = node_lst[i]
        # print('nodes',nodes)
        for node in nodes:
            # print('route', node.route)
            if node.value > max_node.value:
                # print('max', max_node)
                max_node = node
                # node.route.append(max_node.weight)

            if node.value + lst[i] > limit:
                continue

            node.left = Node(node.value, parent=node, route=node.route+[0])
            level.append(node.left)
            # print(node.route)
            node.right = Node(node.value + lst[i], parent=node, route=node.route+[lst[i]])
            


            level.append(node.right)
        node_lst.append(level)
        # print(node_lst)
    # print('parent', max_node.parent.weight)
    print(max_node.route, max_node.value)


if __name__ == '__main__':
    l = [50, 75, 175, 110, 155]
    max_sum_below_number(l, 200)
