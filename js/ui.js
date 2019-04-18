var ActiveSelect = null;

/*==== Items Choice ====*/
function ItemChoiceComponent(SourceJsonElement, SelectComponentObject){
    this.SourceJsonElement = SourceJsonElement;
    this.SelectComponentObject = SelectComponentObject;

    this.MakeItemChoiceComponent = function(){
        this.ItemChoiceComponentElem = document.createElement('div');
        this.ItemChoiceComponentElem.classList.add('item-choice');

        this.ItemChoiceIMG = document.createElement('img');
        this.ItemChoiceIMG.src = 'images/env_items/' + this.SourceJsonElement.background;

        this.ItemChoiceComponentElem.appendChild(this.ItemChoiceIMG);

        this.ItemChoiceComponentElem.addEventListener('click', this.addSelectedItem.bind(this));
        return this.ItemChoiceComponentElem;
    };

    this.addSelectedItem = function(){
        var _Index = 0;
        this.SelectComponentObject.ResetAllItems();
        while(this.SelectComponentObject.SourceJson[_Index].Id != this.SourceJsonElement.Id){
            _Index++;
        }
        Land.InsertItem2D(this.SelectComponentObject.SourceJson[_Index]);
    };
}
/*=======================*/

/*==== Select ====*/
function SelectComponent(ButtonCreation, SelectName, SourceJson){
    this.ButtonCreation = ButtonCreation;
    this.SelectName = SelectName;
    this.SourceJson = SourceJson;

    this.MakeSelect = function(){
        this.CloseSelectContainerElem = document.createElement('div');
        this.CloseSelectContainerElem.classList.add('close-button');

        this.SelectContainerElem = document.createElement('div');
        this.SelectContainerElem.classList.add('select-container');

        this.SelectInnerElem = document.createElement('div');
        this.SelectInnerElem.classList.add('select-inner');

        for(var i = 0 ; i < SourceJson.length ; i++){
            this.SelectInnerElem.appendChild(new ItemChoiceComponent(SourceJson[i], this).MakeItemChoiceComponent());
        }

        document.getElementById(SelectName).addEventListener('click', this.RevealSelect.bind(this));
        this.CloseSelectContainerElem.addEventListener('click', this.HideSelect.bind(this));

        this.SelectContainerElem.appendChild(this.CloseSelectContainerElem);
        this.SelectContainerElem.appendChild(this.SelectInnerElem);
        this.SelectInnerElem.appendChild(this.CloseSelectContainerElem);

        document.getElementById(this.ButtonCreation).addEventListener('click', this.addItem.bind(this));

        return this.SelectContainerElem;
    };

    this.ResetAllItems = function(){
        var _ItemChildren = this.SelectInnerElem.children;
        for(var i = 0 ; i < _ItemChildren.length ; i++){
            _ItemChildren[i].classList.remove('selected-item');
        }
    };
    
    this.RevealSelect = function(){
        if(ActiveSelect != null){
            ActiveSelect.HideSelect();
        }
        this.SelectContainerElem.classList.add('revealed');
        ActiveSelect = this;
    }

    this.HideSelect = function(){
        if(ActiveSelect != null){
            ActiveSelect.SelectContainerElem.classList.remove('revealed');
            ActiveSelect.ResetAllItems();
        }
        ActiveSelect = null;
    }

    this.addItem = function(){
        var _Index = Math.floor(Math.random() * (this.SourceJson.length));
        Land.InsertItem2D(this.SourceJson[_Index]);
    };
}
/*=======================*/

/*==== Textures Select Content ====*/
function TexturesSelect(){
    for(var i = 0 ; i < ItemsTextures.length ; i++){
        var _Option = document.createElement('option');
        _Option.value = ItemsTextures[i];
        _Option.appendChild(document.createTextNode(ItemsTextures[i]));
        document.getElementById('texture-top').appendChild(_Option);
        document.getElementById('texture-front').appendChild(_Option.cloneNode(true));
        document.getElementById('texture-back').appendChild(_Option.cloneNode(true));
        document.getElementById('texture-left').appendChild(_Option.cloneNode(true));
        document.getElementById('texture-right').appendChild(_Option.cloneNode(true));
    }
}
/*=======================*/

/*==== Textures Environment Content ====*/
function TexturesEnvSelect(){
    for(var i = 0 ; i < EnvironmentTextures.length ; i++){
        var _Option = document.createElement('option');
        _Option.value = EnvironmentTextures[i];
        _Option.appendChild(document.createTextNode(EnvironmentTextures[i]));
        document.getElementById('texture-ground').appendChild(_Option);
    }
}
/*=======================*/