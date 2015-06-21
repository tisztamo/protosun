void 0===Function.prototype.name&&void 0!==Object.defineProperty&&Object.defineProperty(Function.prototype,"name",{get:function(){var a=/function\s([^(]{1,})\(/.exec(this.toString());return a&&1<a.length?a[1].trim():""}});function GameEngine(a){this.fps=a||30}GameEngine.prototype.start=function(){setInterval(this.oneStep.bind(this),1E3/this.fps)};GameEngine.prototype.oneStep=function(){console.log("Default oneStep, you have to override it")};function Simulation(a){GameEngine.call(this,a);this.spaceObjects=[];this.renderer=null}Simulation.prototype=new GameEngine;Simulation.prototype.constructor=Simulation;Simulation.prototype.start=function(){this.setUpModel();GameEngine.prototype.start.call(this)};Simulation.prototype.setRenderer=function(a){this.renderer=a};Simulation.prototype.setUpModel=function(){console.log("Default setUpModel, you have to override it!")};
Simulation.prototype.addSpaceObject=function(a){this.spaceObjects.push(a);this.renderer&&this.renderer.spaceObjectAdded(a)};Simulation.prototype.oneStep=function(){for(var a=this.spaceObjects.length,b=this.spaceObjects,c=0;c<a;c++){for(var d=c+1;d<a;d++)SpaceObject.actGravityForce(b[c],b[d]);b[c].oneStep()}this.renderer.oneStepTaken()};function Vector(a,b){this.x=a;this.y=b}Vector.prototype.add=function(a){this.x+=a.x;this.y+=a.y;return this};Vector.prototype.multiply=function(a){this.x*=a;this.y*=a;return this};Vector.prototype.distanceFrom=function(a){var b=a.y-this.y;return Math.sqrt(Math.pow(a.x-this.x,2)+Math.pow(b,2))};Vector.prototype.length=function(){return this.distanceFrom(Vector.zero)};Vector.prototype.substractToNew=function(a){return new Vector(this.x-a.x,this.y-a.y)};
Vector.prototype.toUnitVector=function(){return this.multiply(1/this.length())};Vector.prototype.toString=function(){return"("+this.x+", "+this.y+")"};Vector.zero=new Vector(0,0);function SpaceObject(a,b,c){this.pos=a;this.v=b;this.mass=c||1;this.reciprocalMass=1/this.mass;this.stepForce=new Vector(0,0);this.id=SpaceObject.prototype.getNextId()}SpaceObject.G=100;SpaceObject.actGravityForce=function(a,b){var c=a.pos.distanceFrom(b.pos);2>c||(c=a.mass*b.mass*SpaceObject.G/Math.pow(c,2),c=a.pos.substractToNew(b.pos).toUnitVector().multiply(c),b.stepForce.add(c),a.stepForce.add(c.multiply(-1)))};SpaceObject.prototype.nextId=1;
SpaceObject.prototype.getNextId=function(){var a="SO"+SpaceObject.prototype.nextId;SpaceObject.prototype.nextId+=1;return a};SpaceObject.prototype.oneStep=function(){this.v.add(this.stepForce.multiply(this.reciprocalMass));this.pos.add(this.v);this.stepForce=new Vector(0,0)};function Star(a,b,c){SpaceObject.call(this,a,b,c)}Star.prototype=new SpaceObject;Star.prototype.constructor=Star;function Planet(a,b,c){SpaceObject.call(this,a,b,c)}Planet.prototype=new SpaceObject;Planet.prototype.constructor=Planet;function Moon(a,b,c){SpaceObject.call(this,a,b,c)}Moon.prototype=new SpaceObject;Moon.prototype.constructor=Moon;function Renderer(a){this.simulation=a;this.redrawNeeded=!0;a&&a.setRenderer(this)}Renderer.prototype.start=function(){window.requestAnimationFrame(this.tick.bind(this))};Renderer.prototype.tick=function(){this.redrawNeeded&&(this.redraw(),this.redrawNeeded=!1);window.requestAnimationFrame(this.tick.bind(this))};Renderer.prototype.redraw=function(){console.log("Override redraw!")};Renderer.prototype.oneStepTaken=function(){this.redrawNeeded=!0};
Renderer.prototype.spaceObjectAdded=function(a){this.redrawNeeded=!0};Renderer.prototype.spaceObjectRemoved=function(a){this.redrawNeeded=!0};function DOMRenderer(a,b){Renderer.call(this,a);this.targetElement=b;this.views=[]}DOMRenderer.prototype=new Renderer;DOMRenderer.prototype.redraw=function(){for(var a=this.views.length,b=0;b<a;b++)this.updateView(this.views[b])};DOMRenderer.prototype.spaceObjectAdded=function(a){Renderer.prototype.spaceObjectAdded.call(this,a);a=this.createView(a.constructor.name.toLowerCase(),a);this.views.push(a);this.targetElement.appendChild(a)};
DOMRenderer.prototype.createView=function(a,b){var c=document.getElementById(a).cloneNode(!0);c.id=b.id;c.model=b;c.classList.remove("template");return c};DOMRenderer.prototype.updateView=function(a){var b=a.model;a.style.top=b.pos.y+"px";a.style.left=b.pos.x+"px"};
