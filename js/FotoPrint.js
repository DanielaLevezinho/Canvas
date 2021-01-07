'use strict';

class FotoPrint
{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawing = new Pool(100);
        this.objs = [Rect, Oval, Heart, Bear, Ghost, Chicken];
        this.selectedObject = undefined;
        this.selectObjectCanvas = undefined;
        this.objectColor = "#FFFF00";
        this.deleteIcon = undefined;
        this.paintIcon = undefined;
        this.resizeIcon = undefined;
        this.resizeSvg = new Image();
        this.resizeSvg.src = "https://www.flaticon.com/svg/static/icons/svg/2089/2089756.svg";
        this.resizeSvg.setAttribute('crossorigin', 'anonymous');
        this.deleteSvg = new Image();
        this.deleteSvg.src = 'https://img.icons8.com/android/24/fa314a/trash.svg';
        this.deleteSvg.setAttribute('crossorigin', 'anonymous');
        this.paintSvg = new Image();
        this.paintSvg.src = "https://www.flaticon.com/svg/static/icons/svg/815/815478.svg";
        this.paintSvg.setAttribute('crossorigin', 'anonymous');
    }


    drawObj(cnv) {
        let ctx = cnv.getContext("2d");
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
            if(this.selectObjectCanvas === i){ 
                const {posx, posy, w, h} = this.shpinDrawing.stuff[i].box;
                ctx.strokeStyle = "black";
                ctx.setLineDash([2, 2]);
                ctx.lineWidth = 2;
                ctx.strokeRect(posx, posy, w, h);
                ctx.setLineDash([]);
                this.deleteIcon = {
                    posx: posx + w,
                    posy: posy - 12,
                    w: 24, 
                    h: 24
                };
                ctx.fillStyle = "#09f";
                ctx.drawImage(this.deleteSvg, this.deleteIcon.posx, this.deleteIcon.posy, this.deleteIcon.w, this.deleteIcon.h);
                if(this.shpinDrawing.stuff[i] instanceof Rect){
                    this.resizeIcon = {
                        posx: posx + w - 24,
                        posy: posy + h - 24,
                        w: 24, 
                        h: 24
                    };
                    ctx.drawImage(this.resizeSvg, this.resizeIcon.posx, this.resizeIcon.posy, this.resizeIcon.w, this.resizeIcon.h);
                }
                if(!(this.shpinDrawing.stuff[i] instanceof Picture)){
                this.paintIcon = {
                    posx: posx + w,
                    posy: posy + h - 12,
                    w: 24, 
                    h: 24
                };
                
                ctx.drawImage(this.paintSvg, this.paintIcon.posx, this.paintIcon.posy, this.paintIcon.w, this.paintIcon.h);
            }
                
                
            }
        }
    
        }

        clickResizeIcon(mx, my){
            return this.resizeIcon && ((mx >= this.resizeIcon.posx) && (mx <= this.resizeIcon.posx + this.resizeIcon.w) && (my >= this.resizeIcon.posy) && (my <= (this.resizeIcon.posy + this.resizeIcon.h)));
        }


        clickDeleteIcon(mx, my) {
            return this.deleteIcon && ((mx >= this.deleteIcon.posx) && (mx <= (this.deleteIcon.posx + this.deleteIcon.w)) && (my >= this.deleteIcon.posy) && (my <= (this.deleteIcon.posy + this.deleteIcon.h)));
        }

        clickPaintIcon(mx, my) {
            return this.paintIcon && ((mx >= this.paintIcon.posx) && (mx <= (this.paintIcon.posx + this.paintIcon.w)) && (my >= this.paintIcon.posy) && (my <= (this.paintIcon.posy + this.paintIcon.h)));
        }

        
    clickObj(mx, my) {
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                let cnv = document.getElementById("canvas");
                console.log(this.shpinDrawing.stuff[i]);
                this.selectObjectCanvas = i;
                drawCanvasRect(cnv);
                changeBackgroundColor(document.getElementById("input").value);
                app.drawObj(cnv);
                showRange();
                return true;
            }
        }
        return false;
    }



    dragObj(mx, my) {
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }

    moveObj(mx, my) {
        this.shpinDrawing.stuff[this.thingInMotion].posx = mx - this.offsetx;
        this.shpinDrawing.stuff[this.thingInMotion].posy = my - this.offsety;
        this.shpinDrawing.stuff[this.thingInMotion].createBox();
    }

    resizeObj(mx, my) {
        this.shpinDrawing.stuff[this.thingInMotion].hs *= ((mx - this.shpinDrawing.stuff[this.thingInMotion].box.posx)/this.shpinDrawing.stuff[this.thingInMotion].box.w);
        this.shpinDrawing.stuff[this.thingInMotion].vs *= ((my - this.shpinDrawing.stuff[this.thingInMotion].box.posy)/this.shpinDrawing.stuff[this.thingInMotion].box.h);
        this.shpinDrawing.stuff[this.thingInMotion].resize();
        this.shpinDrawing.stuff[this.thingInMotion].createBox();
    }
    
    resizeSliderObj(property, value){
        this.shpinDrawing.stuff[this.thingInMotion][property] = value;
        this.shpinDrawing.stuff[this.thingInMotion].resize();
        this.shpinDrawing.stuff[this.thingInMotion].createBox();

    }

    removeObj () {
        let cnv = document.getElementById("canvas");
        this.shpinDrawing.remove(this.selectObjectCanvas);
        drawCanvasRect(cnv);
        changeBackgroundColor(document.getElementById("input").value);
        this.drawObj(cnv);
    }

    insertObj (mx, my) {
        let item = null;
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.shpinDrawing.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        return false;
    }

    cloneObj (obj) {
 

        let item = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
        item.posx += 20;
        item.posy += 20; 

        return item;
    }
}


class Pool
{
    constructor (maxSize) {
        this.size = maxSize;
        this.stuff = [];

    }

    insert (obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove (removeIndex) {
        if (this.stuff.length !== 0) {
            // this.stuff.pop();
           // console.log(this.selectedObject);
            this.stuff.splice(removeIndex, 1);
        } else {
           alert("There aren't objects in the application to delete");
        }
    }
}

