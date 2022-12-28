class Edge {
  from: Node;
  to: Node;
  char: string;

  constructor(from: Node, to: Node, char: string) {
    this.from = from;
    this.to = to;
    this.char = char;
  }
}

class Node {
  id: number;
  edges: Map<string, Edge> = new Map();
  terminal: boolean = false;

  static nextId = 1;

  constructor() {
    this.id = Node.nextId;
    Node.nextId += 1;
  }

  key(): string {
    const keys = [];
    keys.push(+this.terminal);
    for (const [char, edge] of this.edges) {
      keys.push(char);
      keys.push(edge.to.id);
    }
    return keys.join('');
  }

  addEdge(char: string, node: Node) {
    this.edges.set(char, new Edge(this, node, char));
  }
}

class Dawg {
  count: number = 0;
  previous: string = '';
  minimizedNodes: Map<string, Node> = new Map();
  uncheckedEdges: Edge[] = [];
  root: Node = new Node();

  minimize(edge: Edge) {
    const key = edge.to.key();
    if (this.minimizedNodes.has(key)) {
      edge.from.addEdge(edge.char, this.minimizedNodes.get(key));
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
      this.uncheckedEdges.push(new Edge(node, next, char));
      node = next;
      index += 1;
    }

    node.terminal = true;
    this.previous = word;
    this.count += 1;
  }

  includesWord(word: string): boolean {
    const stack = [];
    stack.push({node : this.root, path : []});

    while (stack.length) {
      const current = stack.pop();
      const currentChar = word[current.path.length];
      const isLastCharInWord = current.path.length === word.length - 1;

      // // path is longer than word
      // if (currentChar === undefined) {
      //   return false;
      // }

      if (current.node.edges.has(currentChar.toUpperCase())) {
        const edge = current.node.edges.get(currentChar.toUpperCase());
        if (isLastCharInWord) {
          return edge.to.terminal;
        }

        stack.push({node: edge.to, path: [...current.path, current.node ]});
      }
    }

    return false;
  }

  // includesPrefix(prefix: string): boolean {}

  wordCount(): number { return this.count; }
}

import {createReadStream, readFileSync} from 'node:fs';
async function main() {
  const dawg = new Dawg();

  const file = readFileSync('./src/word-list.txt', 'utf8');
  const words = file.split('\n');

  const start = performance.now();
  for (const word of words) {
    dawg.pushWord(word);
  }
  console.log(performance.now() - start);


  console.log(dawg.includesWord('dog'));
  console.log(dawg.includesWord('xyz'));
  console.log(dawg.includesWord('zymologies'));
}

main().catch(console.error);
