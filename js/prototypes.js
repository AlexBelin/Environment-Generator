function ENV(Dimension){
    this.Dimension = Dimension;
    this.Elements = [];
    this.ElementSelected = null;
    
    this.MakePlan = function(){
        this.EnvRotX = 0;
        this.EnvRotZ = 0;
        this.EnvTransX = 0;
        this.EnvTransY = 0;
        this.EnvTransZ = 0;
        this.Environment = document.createElement('div');
        this.Environment.classList.add('environment');
        this.Environment.style.width = this.Dimension + 'px';
        this.Environment.style.height = this.Dimension + 'px';
        this.Environment.style.top = (document.getElementById('environment-container').getBoundingClientRect().height / 2) - (this.Dimension / 2) + 'px';
        this.Environment.style.left = (document.getElementById('environment-container').getBoundingClientRect().width / 2) - (this.Dimension / 2) + 'px';

        document.getElementById('environment-container').appendChild(this.Environment);
    };

    this.UpdateGroundMesh = function(){
        this.GroundMesh.style.backgroundImage = 'url("../images/env_items/' + document.getElementById('texture-ground').value + '")';
    };

    this.MakePlan();

    this.MakeGround = function(DefX, DefY){
        this.GroundMesh = document.createElement('div');
        this.GroundMesh.classList.add('ground');
        this.VirtualGround = document.createElement('div');
        this.VirtualGround.classList.add('virtual-ground');
        this.Environment.appendChild(this.GroundMesh);
        this.Environment.appendChild(this.VirtualGround);
    };

    this.InsertItem2D = function(ItemJSON){
        var NewItem = new Item2D(ItemJSON, this);
        this.Elements.push(NewItem);
        this.GroundMesh.appendChild(NewItem.MakeItemMesh());
    };

    this.InsertItem3D = function(ItemJSON){
        var NewItem = new Item3D(ItemJSON, this);
        this.Elements.push(NewItem);
        this.GroundMesh.appendChild(NewItem.MakeItemMesh());
    };

    this.UpdateItems2d = function(){
        for(var i = 0 ; i < this.Elements.length ; i++){
            if(this.Elements[i].__proto__.constructor.name == 'Item2D'){
                this.Elements[i].UpdateItemMesh();
            }
        }
    };

    this.UpdateEnvironment = function(){
        this.Environment.style.transform = 'translate3d(' + this.EnvTransX + 'px, ' + this.EnvTransY + 'px, ' + this.EnvTransZ + 'px)  rotate3d(1, 0, 0, ' + this.EnvRotX + 'deg) rotate3d(0, 0, 1, ' + this.EnvRotZ + 'deg)';
        this.UpdateItems2d();
    };
}

function Item(JsonItem, Env){
    this.JsonItem = JsonItem;
    this.Env = Env;
    this.ItemClick = false;

    this.DeleteItem = function(){
        this.ItemElement.remove();
        var _Index = 0;
        while(this.Env.Elements[_Index] !== this){
            _Index++;
        }
        this.Env.Elements.splice(_Index, 1);
    };

    this.MoveGizmo = function(event){
        if(this.ItemClick){
            var deltaX = this.ItemElement.getBoundingClientRect().width / 2;
            var deltaY = this.ItemElement.getBoundingClientRect().height / 2;
            var ElementX = event.offsetX;
            var ElementY = event.offsetY;
            this.ItemElement.style.left = ElementX - deltaX + 'px';
            this.ItemElement.style.top = ElementY - deltaY + 'px';
        }
    };
}

function Item2D(JsonItem, Env){
    Item.call(this, JsonItem, Env);
    this.ItemMeshRotateX = -90;
    this.ItemMeshRotateY = 0;
    this.ItemMeshTrans = 'translate3d(-50%, -100%, 0)';

    this.MakeItemMesh = function(){
        this.ItemMesh = document.createElement('div');
        this.ItemMesh.classList.add('item-mesh');
        this.ItemMesh.style.width = (this.JsonItem.width * this.JsonItem.scale) + 'px';
        this.ItemMesh.style.height = (this.JsonItem.height * this.JsonItem.scale) + 'px';
        this.ItemMesh.style.background = 'url("../images/env_items/' + this.JsonItem.background + '") bottom center no-repeat';
        this.ItemMesh.style.backgroundSize = 'cover';
        this.UpdateItemMesh();

        this.ItemDel = document.createElement('div');
        this.ItemDel.classList.add('item-elem-del');

        this.ItemElement = document.createElement('div');
        this.ItemElement.classList.add('item-element');
        this.ItemElement.style.top = this.Env.Dimension / 2 + 'px';
        this.ItemElement.style.left = this.Env.Dimension / 2 + 'px';
        this.ItemElement.appendChild(this.ItemMesh);
        this.ItemElement.appendChild(this.ItemDel);

        this.ItemDel.addEventListener('click', this.DeleteItem.bind(this), false);
        this.ItemDel.addEventListener('mouseup', this.DeleteItem.bind(this), false);
        this.ItemElement.addEventListener('mousedown', this.MouseDownItem.bind(this), false);
        this.ItemElement.addEventListener('mouseup', this.MouseUpItem.bind(this), false);
        this.Env.VirtualGround.addEventListener('mousemove', this.MoveGizmo.bind(this), false);
        this.Env.VirtualGround.addEventListener('mouseup', this.MouseUpItem.bind(this), false);
        return this.ItemElement;
    }

    this.UpdateItemMesh = function(){
        this.ItemMesh.style.transform = 'rotate3d(1, 0, 0, ' + this.ItemMeshRotateX + 'deg)' + this.ItemMeshTrans + 'rotate3d(0, 1, 0, ' + this.Env.EnvRotZ + 'deg)';
    };

    this.MouseDownItem = function(){
        this.ItemClick = true;
        this.ItemMesh.style.transform = 'rotate3d(1, 0, 0, ' + this.ItemMeshRotateX + 'deg) translate3d(-50%, calc(-100% - 120px), 0) rotate3d(0, 1, 0, ' + this.Env.EnvRotZ + 'deg)';
    };

    this.MouseUpItem = function(){
        this.ItemClick = false;
        this.UpdateItemMesh();
        this.ItemElement.style.transform = '';
    };
}
Item2D.prototype = Object.create(Item.prototype);
Item2D.prototype.constructor = Item2D;

function Item3D(JsonItem, Env){
    Item.call(this, JsonItem, Env);
    this.MeshWidth = this.JsonItem.width;
    this.MeshHeight = this.JsonItem.height;
    this.MeshDepth = this.JsonItem.depth;
    this.MeshTextureTOP = this.JsonItem.TextureTOP;
    this.MeshTextureFRONT = this.JsonItem.TextureFRONT;
    this.MeshTextureBACK = this.JsonItem.TextureBACK;
    this.MeshTextureLEFT = this.JsonItem.TextureLEFT;
    this.MeshTextureRIGHT = this.JsonItem.TextureRIGHT;
    this.ZTranslation = 0;
    this.ZRotation = 0;
    this.MIDDLEItemClick = false;

    this.SetItemMesh = function(){
        this.ItemMesh.style.width = this.MeshWidth + 'px';
        this.ItemMesh.style.height = this.MeshDepth + 'px';

        this.ItemDel.style.top = (this.MeshDepth - 14) + 'px';
        this.ItemDel.style.left = (this.MeshWidth - 20) + 'px';

        this.ItemMeshFRONT.style.height = this.MeshHeight + 'px';
        this.ItemMeshFRONT.style.backgroundImage = 'url("../images/env_items/' + this.MeshTextureFRONT + '")';

        this.ItemMeshBACK.style.height = this.MeshHeight + 'px';
        this.ItemMeshBACK.style.backgroundImage = 'url("../images/env_items/' + this.MeshTextureBACK + '")';
        this.ItemMeshBACK.style.transform = 'rotate3d(1, 0, 0, -90deg) rotate3d(0, 1, 0, 180deg) translateY(-50%) translateZ(' + (this.MeshHeight / 2) + 'px)';

        this.ItemMeshTOP.style.transform = 'translateZ(' + this.MeshHeight + 'px)';
        this.ItemMeshTOP.style.backgroundImage = 'url("../images/env_items/' + this.MeshTextureTOP + '")';

        this.ItemMeshLEFT.style.width = this.MeshDepth + 'px';
        this.ItemMeshLEFT.style.height = this.MeshHeight + 'px';
        this.ItemMeshLEFT.style.backgroundImage = 'url("../images/env_items/' + this.MeshTextureLEFT + '")';

        this.ItemMeshRIGHT.style.width = this.MeshDepth + 'px';
        this.ItemMeshRIGHT.style.height = this.MeshHeight + 'px';
        this.ItemMeshRIGHT.style.backgroundImage = 'url("../images/env_items/' + this.MeshTextureRIGHT + '")';
    };
    
    this.MakeItemMesh = function(){
        this.ItemElement = document.createElement('div');
        this.ItemElement.className = 'item-element item-element-3d';
        this.ItemElement.style.top = this.Env.Dimension / 2 + 'px';
        this.ItemElement.style.left = this.Env.Dimension / 2 + 'px';

        this.ItemGizmoZ = document.createElement('div');
        this.ItemGizmoZ.classList.add('z-move');

        this.ItemMesh = document.createElement('div');
        this.ItemMesh.classList.add('item-mesh-3d');

        this.ItemDel = document.createElement('div');
        this.ItemDel.classList.add('item-elem-del');

        this.ItemMeshFRONT = document.createElement('div');
        this.ItemMeshFRONT.className = 'wall wall-front';

        this.ItemMeshBACK = document.createElement('div');
        this.ItemMeshBACK.className = 'wall wall-back';

        this.ItemMeshTOP = document.createElement('div');
        this.ItemMeshTOP.className = 'wall wall-top';

        this.ItemMeshLEFT = document.createElement('div');
        this.ItemMeshLEFT.className = 'wall wall-left';

        this.ItemMeshRIGHT = document.createElement('div');
        this.ItemMeshRIGHT.className = 'wall wall-right';
        
        this.SetItemMesh();

        this.ItemMesh.appendChild(this.ItemMeshFRONT);
        this.ItemMesh.appendChild(this.ItemMeshBACK);
        this.ItemMesh.appendChild(this.ItemMeshTOP);
        this.ItemMesh.appendChild(this.ItemMeshLEFT);
        this.ItemMesh.appendChild(this.ItemMeshRIGHT);

        this.ItemElement.appendChild(this.ItemGizmoZ);
        this.ItemElement.appendChild(this.ItemMesh);
        this.ItemElement.appendChild(this.ItemDel);

        this.ItemElement.addEventListener('click', this.SelectItem.bind(this), false);
        this.ItemDel.addEventListener('click', this.DeleteItem.bind(this), false);
        this.ItemElement.addEventListener('mousedown', this.MouseDownItem.bind(this), false);
        this.ItemDel.addEventListener('mouseup', this.DeleteItem.bind(this), false);
        this.Env.VirtualGround.addEventListener('mousemove', this.MoveGizmo.bind(this), false);
        this.ItemElement.addEventListener('mouseup', this.MouseUpItem.bind(this), false);
        this.ItemElement.addEventListener('mousedown', this.MIDDLEMouseDownItem.bind(this), false);
        this.ItemElement.addEventListener('mouseup', this.MIDDLEMouseUpItem.bind(this), false);
        this.ItemElement.addEventListener('mousemove', this.RotateGizmoZ.bind(this), false);

        return this.ItemElement;
    };

    this.SelectItem = function(event){
        this.Env.ElementSelected = this;
        document.getElementById('item-mesh-3d-width').value = this.MeshWidth;
        document.getElementById('item-mesh-3d-height').value = this.MeshHeight;
        document.getElementById('item-mesh-3d-depth').value = this.MeshDepth;
        document.getElementById('texture-top').value = this.MeshTextureTOP;
        document.getElementById('texture-front').value = this.MeshTextureFRONT;
        document.getElementById('texture-back').value = this.MeshTextureBACK;
        document.getElementById('texture-left').value = this.MeshTextureLEFT;
        document.getElementById('texture-right').value = this.MeshTextureRIGHT;
    };

    this.DeleteItem = function(){
        this.ItemElement.remove();
        var _Index = 0;
        while(this.Env.Elements[_Index] !== this){
            _Index++;
        }
        this.Env.Elements.splice(_Index, 1);
        document.getElementById('item-mesh-3d-width').value = '';
        document.getElementById('item-mesh-3d-height').value = '';
        document.getElementById('item-mesh-3d-depth').value = '';
    };

    this.UpdateItemMesh = function(){
        this.MeshWidth = Number(document.getElementById('item-mesh-3d-width').value);
        this.MeshHeight = Number(document.getElementById('item-mesh-3d-height').value);
        this.MeshDepth = Number(document.getElementById('item-mesh-3d-depth').value);
        this.MeshTextureFRONT = document.getElementById('texture-front').value;
        this.MeshTextureTOP = document.getElementById('texture-top').value;
        this.MeshTextureBACK = document.getElementById('texture-back').value;
        this.MeshTextureLEFT = document.getElementById('texture-left').value;
        this.MeshTextureRIGHT = document.getElementById('texture-right').value;
        this.SetItemMesh();
    };

    this.MouseDownItem = function(){
        if(event.button == 0){
            this.ItemClick = true;
            this.ItemMesh.style.transform = 'translate3d(0, 0, 150px) rotateZ(' + Number(this.ZRotation) + 'deg)';
        }
    };

    this.MouseUpItem = function(){
        if(event.button == 0){
            this.ItemClick = false;
            this.ItemMesh.style.transform = 'translate3d(0, 0, ' + Number(this.ZTranslation) + 'px) rotateZ(' + Number(this.ZRotation) + 'deg)';
        }
    };

    this.MIDDLEMouseDownItem = function(){
        if(event.button == 1){
            this.MIDDLEItemClick = true;
            this.ItemMesh.style.transition = 'all 0s';
        }
    };

    this.MIDDLEMouseUpItem = function(){
        if(event.button == 1){
            this.MIDDLEItemClick = false;
            this.ItemMesh.style.transition = '';
        }
    };

    this.MoveGizmoZ = function(event){
        if(this.MIDDLEItemClick){
            if(event.movementY >= 0){
                this.ZTranslation += event.movementY * -1;
            }
            else{
                this.ZTranslation -= event.movementY;
            }
            this.ItemMesh.style.transform = 'translateZ(' + Number(this.ZTranslation) + 'px)';
        }
    };

    this.RotateGizmoZ = function(event){
        if(this.MIDDLEItemClick){
            console.log(this.ZRotation);
            this.ZRotation += event.movementX * -1;
            this.ItemMesh.style.transform = 'rotateZ(' + Number(this.ZRotation) + 'deg)';
        }
    };
}
Item3D.prototype = Object.create(Item.prototype);
Item3D.prototype.constructor = Item3D;