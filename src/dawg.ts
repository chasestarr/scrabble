type Edge = {
  from: Node;
  to: Node;
  char: string;
};

class Node {
  id: number;
  edges: Map<string, Node> = new Map();
  terminal: boolean = false;

  static nextId = 1;

  constructor() {
    this.id = Node.nextId;
    Node.nextId += 1;
  }

  key(): string {
    const keys = [];
    keys.push(+this.terminal);
    for (const [char, node] of this.edges) {
      keys.push(char);
      keys.push(node.id);
    }
    return keys.join("");
  }

  addEdge(char: string, node: Node) {
    this.edges.set(char.toUpperCase(), node);
  }

  getEdge(char: string): Node | null {
    const node = this.edges.get(char);
    if (node !== undefined) {
      return node;
    }
    return null;
  }
}

export class Dawg {
  count: number = 0;
  previous: string = "";
  minimizedNodes: Map<string, Node> = new Map();
  uncheckedEdges: Edge[] = [];
  root: Node = new Node();

  minimize(edge: Edge) {
    const key = edge.to.key();
    const nodes = this.minimizedNodes.get(key);
    if (nodes) {
      edge.from.addEdge(edge.char, nodes);
    } else {
      this.minimizedNodes.set(key, edge.to);
    }
  }

  pushWord(word: string) {
    let index = 0;
    while (index < word.length && index < this.previous.length) {
      if (word[index] !== this.previous[index]) {
        break;
      }
      index += 1;
    }

    for (const edge of this.uncheckedEdges.splice(index).reverse()) {
      this.minimize(edge);
    }

    let node = this.root;
    if (this.uncheckedEdges.length > 0) {
      node = this.uncheckedEdges[this.uncheckedEdges.length - 1].to;
    }

    while (index < word.length) {
      const next = new Node();
      const char = word[index];
      node.addEdge(char, next);
      this.uncheckedEdges.push({ from: node, to: next, char });
      node = next;
      index += 1;
    }

    node.terminal = true;
    this.previous = word;
    this.count += 1;
  }

  getPrefixNode(prefix: string): Node | null {
    const stack: Array<{ node: Node; path: Node[] }> = [];
    stack.push({ node: this.root, path: [] });

    while (stack.length) {
      const current = stack.pop();
      if (!current) {
        continue;
      }

      const currentChar = prefix[current.path.length];
      const isLastChar = current.path.length === prefix.length;

      if (isLastChar) {
        return current.node;
      }

      const node = current.node.getEdge(currentChar.toUpperCase());
      if (node !== null) {
        stack.push({ node, path: [...current.path, current.node] });
      }
    }
    return null;
  }

  includesWord(word: string): boolean {
    const node = this.getPrefixNode(word);
    if (node !== null) {
      return node.terminal;
    }
    return false;
  }

  includesPrefix(prefix: string): boolean {
    return this.getPrefixNode(prefix) !== null;
  }

  wordCount(): number {
    return this.count;
  }
}
