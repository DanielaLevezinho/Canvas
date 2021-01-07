'use strict';

let app = null;

function main() {
    let cnv = document.getElementById('canvas');
    drawCanvasRect(cnv);
    changeBackgroundColor(document.getElementById("input").value);
    app = new FotoPrint();
    app.drawObj(cnv);
    showRange();
    cnv.addEventListener('mousedown', drag, false);
    cnv.addEventListener('dblclick', makenewitem, false);
    initSelect();
   
}



function showRange(){
    const button = document.getElementById("toggleRange");
    if(!(app.shpinDrawing.stuff[app.selectObjectCanvas] instanceof Rect) && app.selectObjectCanvas !== undefined){
        let cnv = document.getElementById("canvas");
        const newinput = document.createElement("input");
        newinput.type = "range";
        newinput.min = 0.25;
        newinput.max = 4;
        newinput.step = 0.05;
        button.removeAttribute('disabled');
        newinput.value = app.shpinDrawing.stuff[app.selectObjectCanvas].rs;
        newinput.id = "rangeInput";
        newinput.addEventListener("input", (e) =>{
            console.log(e.target.value);
            app.resizeSliderObj("rs", e.target.value);
            drawCanvasRect(cnv);
            changeBackgroundColor(document.getElementById("input").value);
        });
    
        tippy('#toggleRange', {
            placement: 'bottom',
            trigger: 'click',
            hideOnClick: true,
            interactive: true,
            content: newinput,
            allowHTML: true,
        });
    
    }

    else{
        button.setAttribute('disabled', true);
    }
        
    
}

function drawCanvasRect(cnv) {
    
    let ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
    
    
}

//Drag & Drop operation
//drag
function drag(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;
    if(app.clickDeleteIcon(mx, my)){
        app.removeObj();
    }

    else if(app.clickPaintIcon(mx, my) && !(app.shpinDrawing.stuff[app.selectObjectCanvas] instanceof Picture)){
        app.shpinDrawing.stuff[app.selectObjectCanvas].color = document.getElementById("mudaCor").value;
        drawCanvasRect(cnv);
        changeBackgroundColor(document.getElementById("input").value);
        app.drawObj(cnv);
    }

    else if(app.shpinDrawing.stuff[app.selectObjectCanvas] instanceof Rect && app.clickResizeIcon(mx, my)){   
        cnv.addEventListener('mousemove', initResize, false);
        cnv.addEventListener('mouseup', endResize, false);
    }

    else if(app.dragObj(mx, my)) {
        cnv.style.cursor = "pointer";
        app.clickObj(mx, my);
        cnv.addEventListener('mousemove', move, false);
        cnv.addEventListener('mouseup', drop, false);
    }

    else{
        app.selectObjectCanvas = undefined;
        drawCanvasRect(cnv);
        showRange();
        changeBackgroundColor(document.getElementById("input").value);
        app.drawObj(cnv);

    }



}

//Drag & Drop operation
//move
function move(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    app.moveObj(mx, my);
    drawCanvasRect(cnv);
    changeBackgroundColor(document.getElementById("input").value);
    app.drawObj(cnv);
}

function initResize(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;
    cnv.style.cursor = "se-resize"
    app.resizeObj(mx, my);
    drawCanvasRect(cnv);
    changeBackgroundColor(document.getElementById("input").value);
    app.drawObj(cnv);
}

//Drag & Drop operation
//drop
function drop() {
    let cnv = document.getElementById('canvas');

    cnv.removeEventListener('mousemove', move, false);
    cnv.removeEventListener('mouseup', drop, false);
    cnv.style.cursor = "crosshair";
}

function endResize() {
    let cnv = document.getElementById('canvas');

    cnv.removeEventListener('mousemove', initResize, false);
    cnv.removeEventListener('mouseup', endResize, false);
    cnv.style.cursor = "crosshair";
}


//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;


    if (app.insertObj(mx, my)) {
        drawCanvasRect(cnv);
        changeBackgroundColor(document.getElementById("input").value);
        app.drawObj(cnv);
    }

    else if(app.selectedObject){
        
        let insertObject = new app.selectedObject({
        px : mx,
        py : my,
        c : app.objectColor,
        r : 50,
        w : 50,
        h : 50,
    })
    app.shpinDrawing.insert(insertObject);
    drawCanvasRect(cnv);
    changeBackgroundColor(document.getElementById("input").value);
    // insertObject.addEventListener('click', (e) => {console.log(e)}, false);
    app.drawObj(cnv);
    // console.log(app.shpinDrawing);
    }
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('canvas');

    app.removeObj();
    drawCanvasRect(cnv);
    changeBackgroundColor(document.getElementById("input").value);
    app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
    try {
        const cnv = document.getElementById('canvas');
        const link = document.getElementById("link");
        const image = cnv.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.setAttribute('href', image); 
        link.setAttribute('download', 'myFilename.png');  
        link.click();
    }
    catch(err) {
        // alert("You need to change browsers OR upload the file to a server.");
        console.log(err);
    }
}


//Mouse Coordinates for all browsers
function getMouseCoord(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            let yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return [xPos,yPos];
}

function insertText(){
    let cnv = document.getElementById("canvas");
    let text = prompt("Insert text here");
    let texto = new Text({
        text, 
        fontsize: 30,
        px: 50, 
        py: 50, 
        c: app.objectColor});
    app.shpinDrawing.insert(texto);
    app.drawObj(cnv);
}


function insertImage(e){

    let fileReader = new FileReader();
        fileReader.readAsDataURL(e.files[0]);
        fileReader.onload = function (e) {
            let cnv = document.getElementById("canvas");
          
            let imagem = new Picture({
                px: 50, 
                py: 50, 
                w: 70, 
                h: 70, 
                impath: e.target.result});

            app.shpinDrawing.insert(imagem);
            app.drawObj(cnv);
        };

}

function changeObjectColor(color){
    app.objectColor = color;
    initSelect(app.selectedObject);
}


function changeBackgroundColor(color){ 
    let cnv = document.getElementById("canvas");
    
    let background = new Rect({
        px: cnv.width/2,
        py: cnv.height/2,
        w: cnv.width - 4,
        h: cnv.height - 4,
        c: color
    });
    background.draw(cnv);
    if(app){
        app.drawObj(cnv);
    }
}


function initSelect(selectedObject){
    let select = document.getElementById("selectItem");
    drawCanvasRect(select);
    const canvasWidth = select.getBoundingClientRect().width;
    const objWidth = (canvasWidth - 20)/app.objs.length;

    if(selectedObject !== undefined){ 
        let background = new Rect({
            px: 10 + selectedObject*objWidth + objWidth/2,
            py: 90.2,
            w: objWidth, 
            h: 180.4, 
            c: "lightgrey"});
        background.draw(select);
    }
    
    for(let i = 0; i < app.objs.length; i++){
        let parameters = {
            px : 10 + i*objWidth + objWidth/2,
            py : 100,
            c : app.objectColor,
            r : 30,
            w : 30,
            h : 30,
        };
        let obj = new app.objs[i](parameters);
        obj.draw(select);
        
        
    }
    select.addEventListener('click', selectObj, false); 
    
}

function selectObj(e){
    let select = document.getElementById("selectItem");
    const canvasWidth = select.getBoundingClientRect().width;
    const objWidth = (canvasWidth - 20)/app.objs.length;
    const mx = e.pageX;
    let index = Math.floor((mx - getMouseCoord(select)[0] - 10)/objWidth);
    app.selectedObject = app.objs[index];
    initSelect(index);

}





