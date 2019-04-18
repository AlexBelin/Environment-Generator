var Land = new ENV(1000);
Land.MakeGround(10, 10);

setTimeout(function(){
    Land.EnvRotX = 80;
    Land.UpdateEnvironment();
}, 1000);

/*==== Keyboard Listener ====*/
document.addEventListener('keydown', GetKey);

function GetKey(e){
    switch(event.key){
        case 'ArrowDown':
            if(Land.EnvRotX < 90){
                Land.EnvRotX += 10;
            }
            break
        case 'ArrowUp':
            if(Land.EnvRotX > 0){
                Land.EnvRotX -= 10;
            }
            break
        case 'ArrowRight':
            Land.EnvRotZ -= 10;
            break
        case 'ArrowLeft':
            Land.EnvRotZ += 10;
            break
        case '+':
            Land.EnvTransZ += 10;
            break
        case '-':
            Land.EnvTransZ -= 10;
            break
    }
    Land.UpdateEnvironment();
}
/*=======================*/

/*==== Zomm View Listener ====*/
var ZoomClicked = false;
document.getElementById('zoom-button').addEventListener('mousedown', ZoomDown);
document.getElementById('zoom-button').addEventListener('mouseup', ZoomUp);
document.getElementById('zoom-button').addEventListener('mousemove', ZoomMove);
document.getElementById('zoom-button').addEventListener('mouseleave', ZoomUp);

function ZoomDown(){
    ZoomClicked = true;
}
function ZoomUp(){
    ZoomClicked = false;
    this.style.top = '';
}
function ZoomMove(event){
    var _Top = event.pageY - (document.getElementById('zoom').getBoundingClientRect().top) - (this.getBoundingClientRect().height / 2);
    if(ZoomClicked && (_Top >= 0) && (_Top <= (document.getElementById('zoom').getBoundingClientRect().height - this.getBoundingClientRect().height))){
        this.style.top = _Top + 'px';
        var _ZoomDisp = _Top + (this.getBoundingClientRect().height / 2) - (document.getElementById('zoom').getBoundingClientRect().height / 2);
        Land.EnvTransZ -= _ZoomDisp;
        Land.UpdateEnvironment();
    }
}
/*=======================*/

/*==== Cube View Listener ====*/
document.getElementById('cube-view-front').addEventListener('click', ViewFront);
document.getElementById('cube-view-top').addEventListener('click', ViewTop);
document.getElementById('cube-view-left').addEventListener('click', ViewLeft);

function ViewFront(){
    Land.EnvRotX = 80;
    Land.EnvRotZ = 0;
    Land.UpdateEnvironment();
}

function ViewTop(){
    Land.EnvRotX = 0;
    Land.EnvRotZ = 0;
    Land.UpdateEnvironment();
}

function ViewLeft(){
    Land.EnvRotX = 80;
    Land.EnvRotZ = -90;
    Land.UpdateEnvironment();
}
/*=======================*/

/*==== scatter Trees ====*/
document.getElementById('create-forest').addEventListener('click', ScatterTrees);
function ScatterTrees(){
    if(!isNaN(document.getElementById('create-forest-field').value)){
        var _ForestQty = document.getElementById('create-forest-field').value;
    }
    for(var i = 0 ; i < _ForestQty ; i++){
        var _Index = Math.floor(Math.random() * (ItemsTree.length));
        var _Top = Math.floor(Math.random() * 100);
        var _Left = Math.floor(Math.random() * 100);
        Land.InsertItem2D(ItemsTree[_Index]);
        Land.Elements[Land.Elements.length - 1].ItemElement.style.left = _Left + '%';
        Land.Elements[Land.Elements.length - 1].ItemElement.style.top = _Top + '%';
    }
}
/*=======================*/

document.body.appendChild(new SelectComponent('insert-tree', 'choose-tree', ItemsTree).MakeSelect());
document.body.appendChild(new SelectComponent('insert-building-2d', 'choose-house-2d', ItemsHouse).MakeSelect());

/*=======================*/
document.getElementById('insert-building-3d').addEventListener('click', test);
function test(){
    Land.InsertItem3D(Items3D[0]);
}
/*=======================*/

/*=======================*/
document.getElementById('item-mesh-3d-width').addEventListener('keyup', Update3DElement);
document.getElementById('item-mesh-3d-height').addEventListener('keyup', Update3DElement);
document.getElementById('item-mesh-3d-depth').addEventListener('keyup', Update3DElement);
document.getElementById('texture-top').addEventListener('change', Update3DElement);
document.getElementById('texture-front').addEventListener('change', Update3DElement);
document.getElementById('texture-back').addEventListener('change', Update3DElement);
document.getElementById('texture-left').addEventListener('change', Update3DElement);
document.getElementById('texture-right').addEventListener('change', Update3DElement);
function Update3DElement(){
    if(Land.ElementSelected != null){
        Land.ElementSelected.UpdateItemMesh();
    }
}

/*=======================*/

document.getElementById('texture-ground').addEventListener('change', UpdateGround);
function UpdateGround(){
    Land.UpdateGroundMesh();
}

/*=======================*/

TexturesSelect();
TexturesEnvSelect();