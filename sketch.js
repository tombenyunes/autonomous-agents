/*
GENERATIVE ART PROJECT 2
AUTONOMOUS AGENTS
*/

var passiveCells = []
var passiveQuantity = 50;
var passiveCellLimit = 15;
var passiveSizeRange = [6, 9];
var passiveSpeedRange = [0.12, 0.23];

var aggressiveCells = [];
var aggressiveQuantity = 1;
var aggressiveSize = 12;
var aggressiveSpeed = 0.28;

var foodCells = []
var foodQuantity = 200;

var trailTimer = 255;
var strokeTimer = 255;

var sizeMult = speedMult = ageMult = 1;

let debugSlider;
var debugStats = false;

function setup() {
  createCanvas(1280, 800);
  
  // Populate arrays of passive, aggressive, and food cells
  for (let i = 0; i < passiveQuantity; i++) {
    passiveCells.push(new Passive(random(width), random(height), round(random(passiveSizeRange[0], passiveSizeRange[1])), max(random(passiveSpeedRange[0], passiveSpeedRange[1]), random(passiveSpeedRange[0], passiveSpeedRange[1]))));
  }
  for (let i = 0; i < aggressiveQuantity; i++) {
    aggressiveCells.push(new Aggressive(random(width), random(height), aggressiveSize, aggressiveSpeed));
  }
  for (let i = 0; i < foodQuantity; i++) {
    foodCells.push(new Food(random(5, width - 5), random(5, height - 5)));
  }

  // UI debug slider
  debugSlider = createSlider(0, 1, 0);
  debugSlider.position(width - 40, 10);
  debugSlider.style('width', '25px');
}


function draw() {
  background(0, trailTimer); // trailTimer sets the alpha value of the background to be triggered when a cell is eaten

  // Updates cells and removes dead food cells from their arrays
  for (let i = foodCells.length - 1; i >= 0; i--) {
    foodCells[i].update();
    if ((!foodCells[i].isAlive) || (foodCells[i].pos.x > width) || (foodCells[i].pos.x < 0) || (foodCells[i].pos.y > height) || (foodCells[i].pos.y < 0)) {
      foodCells.splice(i, 1);
    }
  }

  for (let i = aggressiveCells.length - 1; i >= 0; i--) {
    // As aggressive cells get bigger, they obtain less mass, are slower, and age faster
    sizeMult = constrain(map(aggressiveCells[i].radius, 0, 100, 1.2, 0.9), 0.9, 1.2);
    speedMult = constrain(map(aggressiveCells[i].radius, 0, 100, 1.2, 0.5), 0.5, 1.2);
    ageMult = constrain(map(aggressiveCells[i].radius, 0, 75, 0.5, 2), 0.5, 2);

    // Updates cells and removes dead aggressive and passive cells from their arrays
    aggressiveCells[i].update();
    if ((!aggressiveCells[i].isAlive) || (aggressiveCells[i].radius <= 0)) {
      aggressiveCells.splice(i, 1);
    }
  }
  for (let i = passiveCells.length - 1; i >= 0; i--) {
    passiveCells[i].update();
    if ((!passiveCells[i].isAlive) || (passiveCells[i].radius <= 0)) {
      passiveCells.splice(i, 1);
    }
  }


  // Fade and constrain the aggressive cell outline, and background alpha changes (when aggressive cells eat passive cells)
  trailTimer += 3;
  trailTimer = constrain(trailTimer, 0, 255);   // alpha
  strokeTimer -= 4;
  strokeTimer = constrain(strokeTimer, 0, 255);   // stroke


  debugStats = map(debugSlider.value(), 0, 1, false, true);   // Allows the slider value to toggle debugStats 'on' and 'off'


  // Provide dynamic info about agents
  for (let i = 0; i < passiveCells.length; i++) {
    if (debugSlider.value() == 1) {
      // Mass info text next to every passive agent
      fill(255);
      textSize(12);
      textStyle(NORMAL);
      text(round(passiveCells[i].radius), passiveCells[i].pos.x - 12 - passiveCells[i].radius, passiveCells[i].pos.y + 6);
    }
    // Ellipse to highlight the agent the mouse is over
    let d = dist(passiveCells[i].pos.x, passiveCells[i].pos.y, mouseX, mouseY);
    if (d <= passiveCells[i].radius) {
      noFill();
      strokeWeight(3);
      stroke(255);
      ellipse(passiveCells[i].pos.x, passiveCells[i].pos.y, (passiveCells[i].radius * 2) + 16);
      // Resize text margins when mouse is too close to canvas edges
      var marginX = 16;
      var marginY = 32;
      if (mouseX >= width - 110) {
        marginX = -110;
      } else {
        marginX = 16;
      }
      if (mouseY >= height - 75) {
        marginY = -16;
      } else {
        marginY = 16;
      }
      // Info when hovering mouse over passive agents
      fill(255);
      textSize(12);
      textStyle(NORMAL);
      stroke(0);
      text('Agent type: ' + passiveCells[i].type, mouseX + marginX, mouseY + marginY - 16);
      text('Agent mass: ' + round(passiveCells[i].radius), mouseX + marginX, mouseY + marginY);
      text('Agent max speed: ' + passiveCells[i].maxspeed.toFixed(3), mouseX + marginX, mouseY + marginY + 16);
      text('Agent pos: ' + round(passiveCells[i].pos.x) + ', ' + round(passiveCells[i].pos.y), mouseX + marginX, mouseY + marginY + 32);
    }
  }   // Aggressive agents
  for (let j = 0; j < aggressiveCells.length; j++) {
    if (debugSlider.value() == 1) {
      fill(255);
      textSize(12);
      textStyle(NORMAL);
      text(round(aggressiveCells[j].radius), aggressiveCells[j].pos.x - 12 - aggressiveCells[j].radius, aggressiveCells[j].pos.y + 6);
    }
    // Ellipse to highlight the agent the mouse is over
    let d = dist(aggressiveCells[j].pos.x, aggressiveCells[j].pos.y, mouseX, mouseY);
    if (d <= aggressiveCells[j].radius) {
      noFill();
      strokeWeight(3);
      stroke(255);
      ellipse(aggressiveCells[j].pos.x, aggressiveCells[j].pos.y, (aggressiveCells[j].radius * 2) + 16);
      // Resize text margins when mouse is too close to canvas edges
      var marginX = 16;
      var marginY = 32;
      if (mouseX >= width - 125) {
        marginX = -110;
      } else {
        marginX = 16;
      }
      if (mouseY >= height - 75) {
        marginY = -80;
      } else {
        marginY = 16;
      }
      // Info when hovering mouse over passive agents
      fill(255);
      textSize(12);
      textStyle(NORMAL);
      stroke(0);
      text('Agent type: ' + aggressiveCells[j].type, mouseX + marginX, mouseY + marginY - 8);
      text('Agent mass: ' + round(aggressiveCells[j].radius), mouseX + marginX, mouseY + marginY + 8);
      text('Agent max speed: ' + (aggressiveCells[j].maxspeed * speedMult).toFixed(3), mouseX + marginX, mouseY + marginY + 24);
      text('Agent pos: ' + round(aggressiveCells[j].pos.x) + ', ' + round(aggressiveCells[j].pos.y), mouseX + marginX, mouseY + marginY + 40);
      text('Agent mass multiplier: ' + sizeMult.toFixed(3), mouseX + marginX, mouseY + marginY + 56);
      text('Agent speed multiplier: ' + speedMult.toFixed(3), mouseX + marginX, mouseY + marginY + 72);
      text('Agent age multiplier: ' + ageMult.toFixed(3), mouseX + marginX, mouseY + marginY + 88);
    }
  }

  // Entity statistics UI
  fill(255);
  strokeWeight(5);
  stroke(0);
  textSize(12);
  textStyle(NORMAL);
  if (debugStats) {
    text('Aggressive Cell Quantity: ' + aggressiveCells.length, 0 + 10, 0 + 20);
    text('Passive Cell Quantity: ' + passiveCells.length, 0 + 10, 0 + 35);
    text('Food Quantity: ' + foodCells.length, 0 + 10, 0 + 50);
    text('Collective Cell Quantity: ' + (passiveCells.length + aggressiveCells.length + foodCells.length), 0 + 10, 0 + 65);
    text('Framerate: ' + round(frameRate()), 0 + 10, 0 + 95);
  }
  if (debugSlider.value() == 1) { var s1 = 'True'; } else { var s1 = 'False'; };
  text('Show stats: ' + s1, width - 40 - 110, 10 + 16);
}










    // PASSIVE CONSTRUCTOR FUNCTION //
function Passive(x, y, radius, maxspeed) {
  this.pos = createVector(x, y);
  this.radius = radius;
  this.maxspeed = maxspeed;
  this.maxforce = 0.05;
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D(); // determines the cell direction

  this.type = 'Passive';
  this.isAlive = true;
  this.color = color(255);
  this.stroke = color(255);
  
  this.searchDist = 40;   // the distance that the cell will search for food

  this.update = function() {
    
    this.updatePhysics();
    this.boundaryPhysics();
    this.behaviours() // controls all physics based movement (grouping, seeking food, etc)
    
    this.eatFood();
    this.mitosis();

    this.draw();
  }
  
  // Updates and limits the cell's movement physics (acceleration, deceleration)
  this.updatePhysics = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);    // resets acceleration
  }

  // Cells bounce off walls
  this.boundaryPhysics = function() {
    if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.velocity.x *= -1; // reverses the cell speed (moves in opposite direction)
    } 
    else if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.velocity.x *= -1;
    }
    if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.velocity.y *= -1;
    } 
    else if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.velocity.y *= -1;
    }
  }

  // Applies forces from behaviour functions
  this.applyForce = function(force) {
    this.acceleration.add(force);   // adds all inputed forces to acceleration
  }

  // Controls and weights all the cell's behaviours
  this.behaviours = function() {
    let cohesion = this.cohesion();
    let align = this.align();
    let separate = this.separate();
    let seekFood = this.seekFood();
    let avoidThreat = this.avoidThreat();

    // Apply different weighting values (priorities) to forces
    cohesion.mult(0.05);
    align.mult(0.05);
    separate.mult(3.0);
    seekFood.mult(1.0);
    if (aggressiveCells.length > 0) {
      avoidThreat.mult(2);
    }

    // Add the force vectors to cell acceleration
    this.applyForce(cohesion);
    this.applyForce(align);
    this.applyForce(separate);
    if (this.radius < passiveCellLimit) {
      this.applyForce(seekFood);
    }
    this.applyForce(avoidThreat);
  }

  // Steers towards direction of target (eg. food/passive cell)
  this.seekTarget = function(target) {
    let desired = p5.Vector.sub(target, this.pos);

    desired.normalize();
    desired.mult(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;   // returns force as vector, relative to current position
  }

  // Cells strive to form groups and stick together
  this.cohesion = function() {
    let neighbordist = 50; // the distance to the neighbour cell
    let sum = createVector(0, 0);
    let count = 0;
    
    for (let i = 0; i < passiveCells.length; i++) {
      let d = p5.Vector.dist(this.pos, passiveCells[i].pos);

      if ((d > 0) && (d < neighbordist)) {
        sum.add(passiveCells[i].pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // finds average position of cells
      return this.seekTarget(sum);
    } else {
      return createVector(0, 0);
    }
  }

  // Cells will strive to move in the same direction
  this.align = function() {
    let neighbordist = 50; // the distance to the neighbour cell
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < passiveCells.length; i++) {
      let d = p5.Vector.dist(this.pos, passiveCells[i].pos);

      if ((d > 0) && (d < neighbordist)) {
        sum.add(passiveCells[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // finds average position of cells
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity); // recalculates cell direction
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Causes cells to avoid touching each other
  this.separate = function() {
    let steer = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < passiveCells.length; i++) {
      let desiredseparation = (this.radius + passiveCells[i].radius) + 2; // 2 pixels between each cell is desired
      let d = p5.Vector.dist(this.pos, passiveCells[i].pos);
      
      if ((d > 0) && (d < desiredseparation)) {
        let diff = p5.Vector.sub(this.pos, passiveCells[i].pos); // vector pointing away from neighbour
        
        diff.normalize();
        diff.div(d); // weight by distance
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);   // calculate average
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Cells approach the closest food cell to them
  this.seekFood = function() {
    let sum = createVector(0, 0);
    let dists = [];
    let sum2 = [];
    let count = 0;

    for (let i = 0; i < foodCells.length; i++) {
      let d = dist(this.pos.x, this.pos.y, foodCells[i].pos.x, foodCells[i].pos.y);    

      if (d <= (this.radius + this.searchDist)) { // if food cells are within the search distance
        strokeWeight(1);
        stroke(color(125, (map(d, width / 2, 0, 55, 255))));
        line(this.pos.x, this.pos.y, foodCells[i].pos.x, foodCells[i].pos.y); // draws a line to close food cells

        if (debugStats) { noFill(); strokeWeight(0.2); stroke(255, 0, 0); ellipse(foodCells[i].pos.x, foodCells[i].pos.y, foodCells[i].radius * 6); }

        sum2.push(foodCells[i].pos);
        count++;
      }
    }
    if (count > 0) { // if food cells have been counted
      for (let i = 0; i < sum2.length; i++) {
        let d = p5.Vector.dist(this.pos, sum2[i]);
        dists.push(d);

        let m = min(dists);
        var closestFood = dists.indexOf(m); // finds the index of the closest food cell
      }
      return this.seekTarget(sum2[closestFood]);
    } else {
      return createVector(0, 0);
    }
  }

  // Cells will attempt to move in the opposite direction of the aggressive cell
  this.avoidThreat = function() {
    for (let i = 0; i < aggressiveCells.length; i++) {
      let d = dist(this.pos.x, this.pos.y, aggressiveCells[i].pos.x, aggressiveCells[i].pos.y);

      if (d <= (aggressiveCells[i].pullRange + 50)) { // if close to the pull range of the aggressive cell

        let thisPos = createVector(this.pos.x, this.pos.y);
        let predatorPos = createVector(aggressiveCells[i].pos.x, aggressiveCells[i].pos.y);
        let vec = p5.Vector.sub(thisPos, predatorPos); // path away from predator cell

        this.acceleration = vec; // changes cell direction to move away from predator
        
        return createVector(0, 0);
      } else {
        return createVector(0, 0);
      }
    }
  }
  
  // Causes food cells to be eaten when within range
  this.eatFood = function() {
    if (foodCells.length > 0) { // if food cells are present
      for (let i = 0; i < foodCells.length; i++) {
        let d = dist(this.pos.x, this.pos.y, foodCells[i].pos.x, foodCells[i].pos.y); // distance to food cell

        if ((d < (this.radius + foodCells[i].radius)) || (d <= 0)) { // if in contact with cell
          if (this.radius < passiveCellLimit) {
            this.radius = lerp(this.radius, this.radius + 1, 0.9); // interpolates cell growth for a smoother transition
            foodCells[i].isAlive = false;        
          }          

        }
      }
    }
  }

  // Every time the mass of a passive cell reaches a multiple of 10 there is a 10% chance of it multiplying
  this.mitosis = function() {
    var r = random(1, 10);

    if (((round(this.radius) % 10 == 0) && (passiveCells.length <= 150))) { // if multiple of 10
      
      this.radius /= 2;
      passiveCells.push(new Passive(this.pos.x, this.pos.y, this.radius, this.maxspeed)); // new cell is created
    }
  }

  this.draw = function() {
    // Defines dynamically changing colour properties
    strokeWeight(0.5);
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    this.color = color((map(d, width / 2, 0, 25, 100))); // the closer the cell is to the center of the map, the more opaque the colour will be

    // Draws cell body
    stroke(this.stroke)
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, (this.radius * 2));
  }
}










// Serves all aggressive entities
function Aggressive(x, y, radius, maxspeed) {
  this.pos = createVector(x, y);
  this.radius = radius;
  this.maxspeed = maxspeed;
  this.maxforce = 0.05;
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();

  this.type = 'Aggressive';
  this.isAlive = true;
  this.color = color(255);
  this.stroke = color(100);

  this.pullRange = (this.radius + 100);
  this.searchDist = (this.radius + 125);
  this.chasing = false; // if currently persuing a prey cell

  setInterval(ageing, 4000);   // Applies natural ageing to all aggressive cells once every two seconds

  this.update = function() {

    this.pullRange = max((this.radius * 1.4 + 100), this.radius + 100); // the range (subtracting radius) that other cells are pulled in from
    this.searchDist = max((this.radius * 4.5 + 125), this.radius + 125);

    this.updatePhysics();
    this.boundaryPhysics();
    this.behaviours();

    this.absorbCells();
    
    this.draw();
  }

  // Updates and limits the cell's movement physics (acceleration, deceleration)
  this.updatePhysics = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed * speedMult);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Cells bounce off walls
  this.boundaryPhysics = function() {
    if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.velocity.x *= -1; // reverses the cell speed (moves in opposite direction)
    } 
    else if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.velocity.x *= -1;
    }
    if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.velocity.y *= -1;
    } 
    else if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.velocity.y *= -1;
    }
  }

  // Applies forces from behaviour functions
  this.applyForce = function(force) {
    this.acceleration.add(force);   // adds all inputed forces to acceleration
  }
  
  // Controls and weights all the cell's behaviours
  this.behaviours = function() {
    let seekFood = this.seekFood();
    let preferCenter = this.preferCenter();

    // Apply different weighting values (priorities) to forces
    seekFood.mult(1.0);
    if (this.chasing) { // if persuing another cell
      preferCenter.mult(0);
    } else  {
      preferCenter.mult(1.0);
    }
    
    // Add the force vectors to cell acceleration
    this.applyForce(seekFood);
    this.applyForce(preferCenter);
  }

  // Steers towards direction of target (eg. food/passive cell)
  this.seekTarget = function(target) {
    let desired = p5.Vector.sub(target, this.pos);

    desired.normalize();
    desired.mult(this.maxspeed * speedMult);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;   // returns force as vector, relative to current position
  }

  // Search and move towards passive cells
  this.seekFood = function() {
    let dists = [];
    let sum = [];
    let count = 0;

    this.chasing = false;

    if (debugStats) { noFill(); strokeWeight(0.1); stroke(255); ellipse(this.pos.x, this.pos.y, (this.searchDist) * 2); }

    for (let i = 0; i < passiveCells.length; i++) {
      let d = dist(this.pos.x, this.pos.y, passiveCells[i].pos.x, passiveCells[i].pos.y);    

      if (d <= (this.searchDist)) { // if within search distance  
        strokeWeight(1);
        stroke(color(125, (map(d, width / 2, 0, 55, 255))));
        line(this.pos.x, this.pos.y, passiveCells[i].pos.x, passiveCells[i].pos.y); // line towards passive cells in range
        this.chasing = true; // persuing another cell

        if (debugStats) { noFill(); strokeWeight(0.3); stroke(255, 0, 0); ellipse(passiveCells[i].pos.x, passiveCells[i].pos.y, passiveCells[i].radius * 4); }
        
        sum.push(passiveCells[i].pos);
        count++;
      }
    }
    if (count > 0) {
      for (let i = 0; i < sum.length; i++) {
        let d = p5.Vector.dist(this.pos, sum[i]);
        dists.push(d);

        let m = min(dists);
        var closest = dists.indexOf(m);   
      }

      return this.seekTarget(sum[closest]); // move towards closest cell in range
    } else {
      return createVector(0, 0);
    }
  }

  // If no cells are within range, move towards canvas center and search
  this.preferCenter = function() {
    for (let i = 0; i < aggressiveCells.length; i++) {
      let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);

      let thisVec = createVector(this.pos.x, this.pos.y);
      let centerVec = createVector(width / 2, height / 2);
      let vec = p5.Vector.sub(centerVec, thisVec);

      if (d > 250) {
        return vec
      } else {
        return createVector(0, 0);
      }

    }
  }

  // Aggressive cell will pull food cells towards it
  this.absorbCells = function() {
    
    let otherCells = passiveCells.concat(foodCells); // combined array of passive and food cells

    if (debugStats) { noFill(); strokeWeight(0.3); stroke(255, 0, 0); ellipse(this.pos.x, this.pos.y, this.pullRange * 2); }

    for (let i = 0; i < otherCells.length; i++) {
      let d = dist(this.pos.x, this.pos.y, otherCells[i].pos.x, otherCells[i].pos.y);

      if (d <= (this.pullRange)) {
        
        let thisPos = createVector(this.pos.x, this.pos.y);
        let otherPos = createVector(otherCells[i].pos.x, otherCells[i].pos.y);
        let vec = p5.Vector.sub(otherPos, thisPos); // path towards
        
        if (otherCells[i].type == 'Food') {
          otherCells[i].dir = vec;
          otherCells[i].speed--;
        }
        else if (otherCells[i].type == 'Passive') {
          otherCells[i].velocity = vec;
          otherCells[i].maxspeed -= 0.1;   // 'drains' the prey cells and causes them to gradually lose speed
        }          
      }

      if (d < (this.radius + otherCells[i].radius)) {
        otherCells[i].isAlive = false;

        // When a passive cell is eaten, the outline briefly becomes visible and the background alpha shifts (giving a 'tral' effect)
        // When a food cell is eaten, only the outline becomes very briefly visible
        if (otherCells[i].type == 'Passive') {
          strokeTimer = 255;
          trailTimer = 0;
        }
        
        let sum1 = PI * this.radius * this.radius + PI * (otherCells[i].radius * sizeMult) * (otherCells[i].radius * sizeMult); // calculate mass difference in size, rather than adding to the radius
        let sum2 = (sqrt(sum1 / PI));
        this.radius = sum2;
      }
    }
  }

  this.draw = function() {
    // The outline of the cell only appears briefly after the cell has eaten another cell, before fading away
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    this.stroke = color(strokeTimer, (map(d, width / 2, 0, 55, 255)));
    this.color = color(0);
    
    // Draws cell body
    strokeWeight(0.5);
    stroke(this.stroke)
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, (this.radius * 2));
  }
}










// Food cells
function Food(x, y) {
  this.pos = createVector(x, y);
  this.speed = 0.075;
  this.dir = p5.Vector.random2D();
  this.dir.setMag(this.speed);
  this.radius = 2;
  this.color = color(255, 255, 0);
  this.isAlive = true;
  this.isMarked = false;
  this.type = 'Food';

  this.update = function() {
    this.respawnCells();
    this.randomWalk();

    this.draw();
  }

  // Add more food cells over time
  this.respawnCells = function() {
    let r = random(0, 1000);
    // ~0.2% chance of adding a new food cell every frame
    if ((foodCells.length < foodQuantity) && (r < 2)) {
      foodCells.push(new Food(random(0, width), random(0, height)));
    }
  }

  // Moves food cells in random directions
  this.randomWalk = function() {
    let r = round(random(0, 100));
    // 2% chance of changing direction every frame
    if (r < 2) {
      this.dir = p5.Vector.random2D(); // random direction
    }

    this.dir.setMag(this.speed);
    this.pos.add(this.dir);
  }

  this.draw = function() {
    // The color of the food cells appear strongest when near the centre of the canvas, weaker when near the edges
    let d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
    this.color = color(255, 255, 0, (map(d, width / 2, 0, 25, 100)));
    
    // Food cells will be connected by lines when close enough to each other
    for (let i = 0; i < foodCells.length; i++) {
      let d2 = dist(this.pos.x, this.pos.y, foodCells[i].pos.x, foodCells[i].pos.y)
      if (d2 < 20) {
        strokeWeight(0.2);
        line(this.pos.x, this.pos.y, foodCells[i].pos.x, foodCells[i].pos.y)
      }
    }

    strokeWeight(0.5);
    stroke(255, 255, 0);
    fill(this.color);

    ellipse(this.pos.x, this.pos.y, (this.radius * 2));   
  }
}

// The aggressive cells will age over time
function ageing() {   // (called every 4 seconds)
  for (let i = 0; i < aggressiveCells.length; i++) {
    aggressiveCells[i].radius -= (1 * ageMult);   // ageMult scales as the cell grows, meaning the cell will age faster as it gains more mass
  }
}
