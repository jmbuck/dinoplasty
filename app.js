const app = {
    init(selectors) {
        
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this));
        this.max = 0;
        this.list = document.querySelector(selectors.listSelector);
        this.dinos = [];
        this.load();
    },

    load() {
        this.names = localStorage.getItem('names');
        this.likes = localStorage.getItem('likes');
       
        //If localStorage has data (isn't null), parse it and update list and data array,
        //Reassign IDs so they remain unique
        if(this.names != null) {
            let namesArr = this.names.split('&');
            let likesArr = this.likes.split('&');
            this.max = namesArr.length-1;
            for(let i = 0; i < namesArr.length-1; i++) {
                const dino = {name: namesArr[i],
                            id: i,
                            liked: likesArr[i]};
                this.dinos.push(dino);
                this.list.insertBefore(this.renderListItem(dino), this.list.firstChild);
                const icon = document.querySelector(`#like${dino.id}>i`);

                if(dino.liked == 'true') {
                    icon.textContent = 'favorite';
                } 
                this.addEventListeners(dino.id);
            }
        } else {
            this.names = '';
            this.likes = '';
        }
    },

    updateStorage() {
        this.names = '';
        this.likes = '';
        for(let i = 0; i < this.dinos.length; i++) {
            this.names += `${this.dinos[i].name}&`;
            this.likes += `${this.dinos[i].liked}&`;
        }
        localStorage.setItem('names', this.names);
        localStorage.setItem('likes', this.likes);
    },

    renderListItem(dino) {
        //Creates list item with unique IDs for each button
        const item = document.createElement('li');
        item.innerHTML =`
            <div class="input-group">
                <div class="input-group-field">${dino.name}</div>
                <div class="input-group-button">
                    <div id="${'like'+dino.id}" class="likes">
                        <i class="material-icons" style="font-size: 36px">favorite_border</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div id="${'del'+dino.id}" class="delete">
                        <i class="material-icons" style="font-size: 36px">delete</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div id="${'up'+dino.id}" class="up">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_up</i>
                    </div>
                </div>  
                <div class="input-group-button">
                      <div id="${'down'+dino.id}" class="down">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>
        `;
        /*
             <button type="button" id="${'like'+dino.id}" class="button">${dino.liked == 'true' ? 'Unlike' : 'Like'}</button>
              <button type="button" id="${'del'+dino.id}" class="button">Delete</button>
        */
        item.id = 'item'+dino.id;
        if(dino.liked == 'true') {
            item.style.backgroundColor = '#EDCB96';
        }
        return item;
    },

    addEventListeners(id) {
        document.querySelector('#like'+id+'>i').addEventListener('click', this.like.bind(this));
        document.querySelector('#del'+id+'>i').addEventListener('click', this.delete.bind(this));
        document.querySelector('#up'+id+'>i').addEventListener('click', this.moveUp.bind(this));
        document.querySelector('#down'+id+'>i').addEventListener('click', this.moveDown.bind(this));
    },

    like(event) {
        const icon = event.target;
        const listItem = document.querySelector(`#${icon.parentElement.id.replace('like','item')}`);
        let dino;
        //Find dino in array
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                dino = this.dinos[i];
                break;
            }
        }
        //Toggles button text and background color
        if(icon.innerHTML == 'favorite_border') {
            listItem.style.backgroundColor = '#EDCB96';
            icon.textContent = 'favorite'
            dino.liked = true;
        } else {
            listItem.style.backgroundColor = '#9E7682';
            icon.textContent = 'favorite_border'
            dino.liked = false;
        }
        this.updateStorage();
    },

    delete(event) {
        const icon = event.target;
        const listItem = document.querySelector(`#${icon.parentElement.id.replace('del','item')}`);
        //Searches the dinos array for id matching id # at end of listItem's id
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                this.dinos.splice(i, 1);
                this.updateStorage();
                listItem.parentElement.removeChild(listItem);
            }
        }
    },

    moveUp(event) {      
        const listItem = document.querySelector(`#${event.target.parentElement.id.replace('up','item')}`);
        //Searches the dinos array for id matching id # at end of listItem's id
        //and swaps the element with the next in the array (up in the list)
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                if(i < this.dinos.length-1) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i+1];
                    this.dinos[i+1] = temp;
                    listItem.parentNode.insertBefore(listItem, listItem.previousSibling)
                    this.updateStorage();
                }
                break;
            }
        }
    },

    moveDown(event) {
        const listItem = document.querySelector(`#${event.target.parentElement.id.replace('down','item')}`);
        //Searches the dinos array for id matching id # at end of listItem's id
        //and swaps the element with the previous in the array (down in the list)
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                if(i > 0) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i-1];
                    this.dinos[i-1] = temp;
                    listItem.parentNode.insertBefore(listItem.nextSibling, listItem);
                    this.updateStorage();
                }
                break;
            }
        }
    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value.trim(),
            id: this.max,
            liked: false,
        };
       
        form.dinoName.value = ''; //Clears textbox

        //Insert into start of list and dinos array
        this.list.insertBefore(this.renderListItem(dino), this.list.firstChild); 
        this.dinos.push(dino);

        this.addEventListeners(dino.id);

        //Update names and likes string (for localStorage)
        this.names +=  `${dino.name}&`;
        this.likes +=  `${dino.liked}&`;
        localStorage.setItem('names', this.names);
        localStorage.setItem('likes', this.likes);
        this.max++;
    },
};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});