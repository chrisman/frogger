const compose = (...fs) => x => fs.reduce((y, f) => f(y), x);

// TODO: collision. combine with observer?
const withCollision = obj => Object.assign(obj, {
});

const withID = ({ id = 0 } = {}) => obj => Object.assign(obj, { id });

const withVisible = ({
  color = 'limegreen',
  height = 50,
  width = 50,
  x = 100,
  y = 100,
} = {}) => o => Object.assign(o, {
  color, height, width, x, y,
  draw (c) {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  },
});

// TODO: implement a command object?
const withControls = () => opts => Object.assign(opts, {
  eventHandlers: {
    keydown (e) {
      switch (e.keyCode) {
        case 37:
          this.x -= this.width;
          break;
        case 39:
          this.x += this.width;
          break;
        case 38:
          this.y -= this.height;
          break;
        case 40:
          this.y += this.height;
          break;
        default:
          break;
      }
    }
  },
  update (opt) {
    return true;
  }
});

const withAI = ({
  velocity = 1,
} = {}) => obj => Object.assign(obj, {
  velocity,
  update (opts) {
    this.x += this.velocity;
    if (this.x > opts.width) this.x = 0 - this.width;
    if (this.x + this.width < 0) this.x = opts.width;
    if (this.y > opts.height) this.y = 0 - this.height;
    if (this.y + this.height < 0) this.y = opts.height;
  }
});



const createPlayer = ({
  id = 0,
  color = 'green',
  height = 50,
  width = 50,
  x = 400 / 2 - 25,
  y = 400 - 50,
} = {}) => compose(
  withID({ id }),
  withVisible({ color, height, width, x, y }),
  withControls()
)({});

const createCar = ({
  color = 'green',
  height = 50,
  velocity = 1,
  width = 50,
  x = 100,
  y = 100,
} = {}) => compose(
  withID(),
  withVisible({ color, height, width, x, y }),
  withAI({ velocity })
)({});


const opts = {
  width: 400,
  height: 400
};

const canvas = document.getElementById('canvas');
canvas.setAttribute('width', opts.width);
canvas.setAttribute('height', opts.height);
const ctx = canvas.getContext('2d');

const laneOne = Array.from({length: 5})
  .map((_,i) => createCar({
    color: 'hotpink',
    velocity: 1.2,
    x: (i * 50) + (i * 10),
    y: opts.height - 100,
  }));
const laneTwo = Array.from({length: 3})
  .map((_,i) => createCar({
    color: 'red',
    velocity: -1,
    x: opts.width - ((i * 50) + (i * 20)),
    y: opts.height - 150,
  }));
const laneThree = Array.from({length: 2})
  .map((_,i) => createCar({
    color: 'tomato',
    velocity: -1.5,
    x: opts.width - ((i * 50) + (i * 100)),
    y: opts.height - 200,
  }));
const laneFour = [createCar({
  color: 'darkred',
  velocity: 5,
  x: 0,
  y: opts.height - 250,
})];
const player = createPlayer({ id: 1 });

Object.keys(player.eventHandlers).forEach(handler => {
  document.addEventListener(handler, player.eventHandlers[handler].bind(player), false);
});

const entities = [
  ...laneOne,
  ...laneTwo,
  ...laneThree,
  ...laneFour,
  player
];

function update(){
  entities.forEach(entity => {
    entity.update(opts);
  });
}
function draw(){
  ctx.clearRect(0, 0, opts.width, opts.height);
  entities.forEach(entity => {
    entity.draw(ctx);
  });
}
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
