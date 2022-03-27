export interface Line {
  indexes: Array<number>;
  line: {
    perspective: Perspective;
    position?: string;
  };
}

export enum Perspective {
  DIOGANAL = 'diagonal',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

const lines: Line[] = [
  {
    indexes: [0, 1, 2],
    line: { perspective: Perspective.HORIZONTAL, position: '1' },
  },
  {
    indexes: [3, 4, 5],
    line: { perspective: Perspective.HORIZONTAL, position: '2' },
  },
  {
    indexes: [6, 7, 8],
    line: { perspective: Perspective.HORIZONTAL, position: '3' },
  },
  {
    indexes: [0, 3, 6],
    line: { perspective: Perspective.VERTICAL, position: '1' },
  },
  {
    indexes: [1, 4, 7],
    line: { perspective: Perspective.VERTICAL, position: '2' },
  },
  {
    indexes: [2, 5, 8],
    line: { perspective: Perspective.VERTICAL, position: '3' },
  },
  {
    indexes: [0, 4, 8],
    line: { perspective: Perspective.DIOGANAL, position: 'left' },
  },
  {
    indexes: [2, 4, 6],
    line: { perspective: Perspective.DIOGANAL, position: 'right' },
  },
];

const calculateWinner = (squares: Array<Partial<string>>) => {
  let line: Line = lines[0];
  let winner = lines.reduce((memo, iline) => {
    const {
      indexes: [a, b, c],
    } = iline;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      memo = squares[a] as string;
      line = iline;
    }
    return memo;
  }, '');
  if (!winner && squares.every((s) => s)) {
    winner = 'tie';
  }
  return { winner, line };
};

export default calculateWinner;
