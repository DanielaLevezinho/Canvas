class DrawingObjects
{
    constructor (px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }

        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }

        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }

        this.posx = px;
        this.posy = py;
        this.name = name;
    }
    
    draw (cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }


    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }
}

class Rect extends DrawingObjects
{

    constructor (parameters) {
        super(parameters.px, parameters.py, 'R');
        this.w = parameters.w;
        this.h = parameters.h;
        this.color = parameters.c;
        this.hs = 1;
        this.vs = 1;
        this.createBox();
    }

    createBox(){
        this.box = {
            posx: this.posx - this.w/2,
            posy: this.posy - this.h/2,
            h: this.h*this.vs,
            w: this.w*this.hs
        }
    }

    resize(){
        this.w *= this.hs;
        this.h *= this.vs;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx - this.w/2, this.posy - this.h/2, this.w, this.h);
        
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx - this.w/2) && (mx <= (this.posx + this.w/2)) && (my >= this.posy - this.h/2) && (my <= (this.posy + this.h/2)));

    }
}

class Picture extends DrawingObjects{

    constructor (parameters) {

        super(parameters.px, parameters.py, 'P');
        let cnv = document.getElementById("canvas");
        this.rs = 1;
        this.w = parameters.w;
        this.impath = parameters.impath;
        this.imgobj = new Image();
        this.imgobj.src = parameters.impath;
        let self = this;
        this.imgobj.onload = function() {

            self.ratio = self.w/this.width
            self.height = this.height * self.ratio;
            self.draw(cnv);
            
        }

        this.resize();
        this.createBox();
    }

    createBox(){
        this.box = {
            posx: this.posx ,
            posy: this.posy ,
            h: this.height,
            w: this.width
        }
    }

    resize(){
        this.width = this.rs* this.w;
        this.height = this.rs * this.imgobj.height * this.ratio;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.width, this.height);
        } 
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.width)) && (my >= this.posy) && (my <= (this.posy + this.height)));
    }
}

class Oval extends DrawingObjects
{
    constructor (parameters) {
        super(parameters.px, parameters.py, 'O');
        this.rs = 1;
        this.r = parameters.r;
        this.radsq = parameters.r * parameters.r;
        this.hor = 1
        this.ver = 1
        this.color = parameters.c;
        this.resize();
        this.createBox();
        

    }

    resize(){
        this.radius = this.r * this.rs;
        this.radsq = this.radius* this.radius;
    }

    createBox(){
        this.box = {
            posx: this.posx - this.radius,
            posy: this.posy - this.radius,
            h: this.radius*2,
            w: this.radius*2
        }
    }


    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }
    
    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.translate(this.posx,this.posy);
        ctx.scale(this.hor,this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Heart extends DrawingObjects
{
    constructor (parameters) {
        super(parameters.px, parameters.py, 'H');
        this.rs = 1;
        this.h = parameters.w * 0.7;
        this.drx = parameters.w / 4;
        this.radsq = parameters.drx * parameters.drx;
        this.ang = .25 * Math.PI;
        this.color = parameters.c;
        this.w = parameters.w;
        this.resize();
        this.createBox();
    }

    createBox(){
       
        this.box = {
            posx: this.posx - this.width/2,
            posy: this.posy - this.width/2 + this.radius,
            h: this.height + this.radius,
            w: this.width
        }
    }

    outside (x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }
    resize(){
        this.height = this.h * this.rs;
        this.radius = this.drx * this.rs;
        this.width = this.w * this.rs;
        this.radsq = this.radius * this.radius;
    }
    draw (cnv) {
        let leftctrx = this.posx - this.radius;
        let rightctrx = this.posx + this.radius;
        let cx = rightctrx + this.radius * Math.cos(this.ang);
        let cy = this.posy + this.radius * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.radius, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.height);
        ctx.lineTo(cx,cy);
        ctx.arc(rightctrx, this.posy, this.radius, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.radius;
        let rightctrx = this.posx + this.radius;
        let qx = this.posx - 2 * this.radius;
        let qy = this.posy - this.radius;
        let qwidth = 4 * this.radius;
        let qheight = this.radius + this.height;

        let x2 = this.posx;
        let y2 = this.posy + this.height;
        let m = (this.height) / (2 * this.radius);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}

class Bear extends DrawingObjects
{
    constructor (parameters) {
        super(parameters.px, parameters.py, 'B');
        this.rs = 1;
        this.r = parameters.r;
        this.radsq = parameters.r * parameters.r;
        this.hor = 1;
        this.ver = 1;
        this.color = parameters.c;
        this.ang = .25 * Math.PI;
        this.h = parameters.r*2;
        this.w = parameters.r*2;
        this.resize();
        this.createBox();


    }

    createBox(){
       
        this.box = {
            posx: this.posx - this.w/2 - this.radius/8,
            posy: this.posy - this.h/2 - this.radius/2,
            h: this.h + this.radius/2,
            w: this.w + this.radius/4
        }
    }

    

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        let x3 = (mx - this.posx + this.radius/1.6) / this.hor;
        let y3 = (my - this.posy + this.radius) / this.ver;

        let x4 = (mx - this.posx - this.radius/1.6) / this.hor;
        let y4 = (my - this.posy + this.radius) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radius*this.radius)) || (this.sqDist(x1,y1,x3,y3) <= (this.radius/2*this.radius/2) || this.sqDist(x1,y1,x4,y4) <= (this.radius/2*this.radius/2));
    }

    resize(){
        this.radius = this.r * this.rs;
        this.w = this.radius * 2;
        this.h = this.radius * 2;
    }

    draw (cnv) {
        
        let ctx = cnv.getContext("2d");
        
        let circuloPrincipal = new Oval({
            px : this.posx,
            py : this.posy, 
            r : this.radius,
            c : this.color,
        });

        let orelhaEsquerda = new Oval({
            px: this.posx - this.radius/1.6,
            py: this.posy - this.radius, 
            r: this.radius/2, 
            c: this.color,
        });

        let orelhaDireita = new Oval({
            px: this.posx + this.radius/1.6,
            py: this.posy - this.radius, 
            r: this.radius/2,
            c: this.color});

        let orelhaEsquerdaDentro = new Oval({
            px: this.posx - this.radius/1.6,
            py: this.posy - this.radius, 
            r: this.radius/4,
            c: "black"});

        let orelhaDireitaDentro = new Oval({
            px: this.posx + this.radius/1.6,
            py: this.posy - this.radius, 
            r: this.radius/4,
            c: "black"});

        let olhoEsquerdo = new Oval({
            px: this.posx - this.radius/3,
            py: this.posy - this.radius/3, 
            r: this.radius/6, 
            c: "white"});

        let olhoDireito = new Oval({
            px: this.posx + this.radius/3,
            py: this.posy - this.radius/3, 
            r: this.radius/6,
            c: "white"});

        let olhoEsquerdoInterior = new Oval({
            px: this.posx - this.radius/3,
            py: this.posy - this.radius/3, 
            r: this.radius/14,
            c: "black"});

        let olhoDireitoInterior = new Oval({
            px: this.posx + this.radius/3,
            py: this.posy - this.radius/3, 
            r: this.radius/14, 
            c: "black"});

        let nariz = new Oval({
            px: this.posx, 
            py: this.posy + this.radius/8, 
            r: this.radius/6,
            c: "black"});
        
        orelhaEsquerda.draw(cnv);
        orelhaDireita.draw(cnv);
        
        orelhaEsquerdaDentro.draw(cnv);
        orelhaDireitaDentro.draw(cnv);
        circuloPrincipal.draw(cnv);
        olhoEsquerdo.draw(cnv);
        olhoDireito.draw(cnv);
        olhoEsquerdoInterior.draw(cnv);
        olhoDireitoInterior.draw(cnv);

        ctx.beginPath();
        ctx.arc(this.posx - this.radius/3, this.posy + this.radius/6*1.3, this.radius/3, 0, Math.PI - this.ang, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.posx + this.radius/3, this.posy + this.radius/6*1.3, this.radius/3, this.ang, Math.PI, false);
        ctx.stroke();

        nariz.draw(cnv);

    }
}



class Ghost extends DrawingObjects
{
    constructor (parameters) {
        super(parameters.px, parameters.py, "G");
        this.rs = 1;
        this.w = parameters.w;
        this.h = parameters.h;
        this.r = parameters.w/6;
        this.color = parameters.c;

        this.hor = 1;
        this.ver = 1;

        this.drx = parameters.w /2;
        this.radsq = parameters.drx * parameters.drx;
        this.ang = .25 * Math.PI;
        this.resize();
        this.createBox();

    }


    createBox(){
       
        this.box = {
            posx: this.posx - this.width,
            posy: this.posy - this.height,
            h: this.height + this.drx + 3*this.radius,
            w: 2*this.width
        }
    }




    sign (p1x, p1y, p2x, p2y, p3x, p3y){
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    }
    
    PointInTriangle (ptx, pty, v1x, v1y, v2x, v2y, v3x, v3y){
    
        const d1 = this.sign(ptx, pty, v1x, v1y, v2x, v2y);
        const d2 = this.sign(ptx, pty, v2x, v2y, v3x, v3y);
        const d3 = this.sign(ptx, pty, v3x, v3y, v1x, v1y);
    
        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    
        return !(has_neg && has_pos);
    }

    mouseOver (mx, my) {
        const leftx = this.posx - this.width;
        const topy = this.posy - this.height;
        const rightx = this.posx + this.width;
        const downy = this.posy + this.height;

        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - leftx - this.drx) / this.hor;
        let y2 = (my - topy - this.drx) / this.ver;
        let x3 = (mx - rightx + this.drx) / this.hor;
        let y3 = (my - topy - this.drx) / this.ver;
        let arcEsquerdo = this.sqDist(x1,y1,x3,y3) <= (this.drx*this.drx);
        let arcDireito = this.sqDist(x1,y1,x2,y2) <= (this.drx*this.drx);
        let retangulo = (mx >= leftx) && (mx <= (rightx)) && (my >= topy + this.drx) && (my <= (downy - this.height/2));
        let retanguloTesta = (mx >= leftx + this.drx) && (mx <= (rightx - this.drx)) && (my >= topy) && (my <= (topy + this.drx));
        let triangleEsquerdoDentro = this.PointInTriangle(mx, my, leftx + this.width/3, downy - this.height/2, leftx, downy, leftx, downy - this.height/2);
        let triangleEsquerdo = this.PointInTriangle(mx, my, leftx + 3*this.width/3, downy - this.height/2, leftx + 2*this.width/3, downy, leftx + this.width/3, downy - this.height/2);
        let triangleDireitoDentro = this.PointInTriangle(mx, my, leftx + 5*this.width/3, downy - this.height/2, leftx + 4*this.width/3, downy, leftx + 3*this.width/3, downy - this.height/2);
        let triangleDireito = this.PointInTriangle(mx, my, rightx, downy - this.height/2, rightx, downy, leftx + 5*this.width/3, downy - this.height/2);
        return retangulo 
         || arcDireito 
         || arcEsquerdo
         || retanguloTesta 
         || triangleEsquerdoDentro 
         || triangleEsquerdo 
         || triangleDireitoDentro 
         || triangleDireito;
         
    }
    resize(){
        this.width = this.rs * this.w;
        this.height = this.rs * this.h;
        this.radius = this.rs * this.r;
        this.drx = this.width /2;
    }
    draw (cnv) {
        
        let ctx = cnv.getContext("2d");
        const leftx = this.posx - this.width;
        const topy = this.posy - this.height;
        const rightx = this.posx + this.width;
        const downy = this.posy + this.height;
        
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(leftx + this.drx, topy + this.drx);
        ctx.arc(leftx + this.drx, topy + this.drx, this.drx, 1*Math.PI, 1.5*Math.PI, false);
        ctx.lineTo(rightx - this.drx, topy);
        ctx.arc(rightx - this.drx, topy + this.drx, this.drx, Math.PI*1, 0, false);
        ctx.lineTo(rightx, downy);
        ctx.lineTo(leftx + 5*this.width/3, downy - this.height/2);
        ctx.lineTo(leftx + 4*this.width/3, downy);
        ctx.lineTo(leftx + 3*this.width/3, downy - this.height/2);
        ctx.lineTo(leftx + 2*this.width/3, downy);
        ctx.lineTo(leftx + this.width/3, downy - this.height/2);
        ctx.lineTo(leftx, downy);
        ctx.lineTo(leftx, topy + this.drx);
        ctx.closePath();
        ctx.fill();


        let olhoEsquerdo = new Oval({
            px: leftx + this.width/2,
            py: topy + this.height/1.2, 
            r: this.radius,
            c: "white"});

        let olhoDireito = new Oval({
            px: rightx - this.width/2,
            py: topy + this.height/1.2, 
            r: this.radius, 
            c: "white"});

        let olhoEsquerdoInterno = new Oval({
            px: leftx + this.width/2.2,
            py: topy + this.height/1.1, 
            r: this.radius/3,
            c: "black"})

        let olhoDireitoInterno = new Oval({
            px: rightx - this.width/1.8,
            py: topy + this.height/1.1,
            r: this.radius/3, 
            c: "black"})

        olhoEsquerdo.draw(cnv);
        olhoDireito.draw(cnv);
        olhoEsquerdoInterno.draw(cnv);
        olhoDireitoInterno.draw(cnv);

    }
}

class Chicken extends DrawingObjects{
    constructor (parameters) {
        super(parameters.px, parameters.py, 'B');
        this.rs = 1;
        this.r = parameters.r;
        this.radsq = parameters.r * parameters.r;
        this.hor = 1;
        this.ver = 1;
        this.color = parameters.c;
        this.ang = .25 * Math.PI;
        this.w = parameters.r*2;
        this.h = parameters.r*2;
        this.resize();
        this.createBox();

    }

    createBox(){
       
        this.box = {
            posx: this.posx - this.radius*1.6,
            posy: this.posy - this.h/2 - this.radius/2,
            h: this.h + this.radius/2,
            w: 3.1*this.radius
        }
    }


    sign (p1x, p1y, p2x, p2y, p3x, p3y){
        return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
    }
    
    PointInTriangle (ptx, pty, v1x, v1y, v2x, v2y, v3x, v3y){
    
        const d1 = this.sign(ptx, pty, v1x, v1y, v2x, v2y);
        const d2 = this.sign(ptx, pty, v2x, v2y, v3x, v3y);
        const d3 = this.sign(ptx, pty, v3x, v3y, v1x, v1y);
    
        const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    
        return !(has_neg && has_pos);
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        let circuloPrincipal = (this.sqDist(x1,y1,x2,y2) <= (this.radius/1.2*this.radius/1.2));

        let x3 = (mx - this.posx + this.radius/2) / this.hor;
        let y3 = (my - this.posy + this.radius) / this.ver;
        let coroa1 = (this.sqDist(x1,y1,x3,y3) <= (this.radius/2*this.radius/2));

        let x4 = (mx - this.posx - this.radius/3.8) / this.hor;
        let y4 = (my - this.posy + this.radius) / this.ver;
        let coroa2 = this.sqDist(x1,y1,x4,y4) <= (this.radius/2*this.radius/2)

        let x5 = (mx - this.posx - this.radius) / this.hor;
        let y5 = (my - this.posy + this.radius/2) / this.ver;
        let coroa3 = this.sqDist(x1,y1,x5,y5) <= (this.radius/2*this.radius/2)

        let x6 = (mx - this.posx - this.radius) / this.hor;
        let y6 = (my - this.posy - this.radius/2.3) / this.ver;
        let coroa4 = this.sqDist(x1,y1,x6,y6) <= (this.radius/2*this.radius/2)

        let bico = this.PointInTriangle(mx, my, this.posx - this.radius/1.2, this.posy, this.posx - this.radius*1.6, this.posy + this.radius/3, this.posx + this.radius/10, this.posy + this.radius/3);

        return circuloPrincipal || coroa1 || coroa2 ||coroa3 ||coroa4 || bico;
    }
    resize(){
        this.radius = this.rs * this.r;
        this.radsq = this.radius * this.radius;
        this.w = this.radius*2;
        this.h = this.radius*2;
        
    }
    draw (cnv) {
        
        let ctx = cnv.getContext("2d");
        
        
        let circuloPrincipal = new Oval({
            px: this.posx, 
            py: this.posy, 
            r: this.radius/1.2,  
            c: this.color});

        let coroa1 = new Oval({
            px: this.posx - this.radius/2,
            py: this.posy - this.radius, 
            r: this.radius/2,  
            c: "red"});

        let coroa2 = new Oval({
            px: this.posx + this.radius/3.8,
            py: this.posy - this.radius, 
            r: this.radius/2,  
            c: "red"});

        let coroa3 = new Oval({
            px: this.posx + this.radius,
            py: this.posy - this.radius/2,
            r: this.radius/2,  
            c: "red"});

        let coroa4 = new Oval({
            px: this.posx + this.radius,
            py: this.posy + this.radius/2.3, 
            r: this.radius/2,  
            c: "red"});

        let olho = new Oval({
            px: this.posx - this.radius/3, 
            py: this.posy - this.radius/10, 
            r: this.radius/5,  
            c: "white"});

        let olhoDentro = new Oval({
            px: this.posx - this.radius/2.6, 
            py: this.posy - this.radius/12, 
            r: this.radius/12,  
            c: "black"});

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(this.posx - this.radius/1.2, this.posy);
        ctx.lineTo(this.posx - this.radius*1.6 , this.posy + this.radius/3);
        ctx.lineTo(this.posx + this.radius/10, this.posy + this.radius/3);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 0.7;
        ctx.moveTo(this.posx - this.radius*1.6, this.posy + this.radius/3);
        ctx.lineTo(this.posx - this.radius/1.2, this.posy + this.radius/6);
        ctx.stroke();
        ctx.closePath();


        coroa1.draw(cnv);
        coroa2.draw(cnv);
        coroa3.draw(cnv);
        coroa4.draw(cnv);
        circuloPrincipal.draw(cnv);
        olho.draw(cnv);
        olhoDentro.draw(cnv);

    }
}


class Text extends DrawingObjects{

    constructor (parameters) {
        super(parameters.px, parameters.py, 'R');
        this.rs = 1;
        this.fontsize = parameters.fontsize;
        this.color = parameters.c;
        this.text = parameters.text;
        this.resize();
        this.createBox();
    }

    createBox(){
       
        this.box = {
            posx: this.posx,
            posy: this.posy - this.h,
            h: this.h,
            w: this.w
        }
        console.log(this.box);
    }
    resize(){
        this.size = this.fontsize * this.rs;
    }
    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.font = `${this.size.toString()}px Arial`;
        console.log(`${this.size.toString()}px Arial`);
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.posx, this.posy);
        let textWidth = ctx.measureText(this.text);
        this.w = textWidth.width;
        this.h = this.size;
        this.createBox();
        
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy - this.h) && (my <= (this.posy)));

    }
}





