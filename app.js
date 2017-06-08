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
        this.ids = localStorage.getItem('ids');
        this.likes = localStorage.getItem('likes');
        //If localStorage has data (isn't null), parse it and update list and data array
        if(this.names != null) {
            let namesArr = this.names.split('&');
            let idsArr = this.ids.split('&');
            let likesArr = this.likes.split('&');
            for(let i = 0; i < namesArr.length-1; i++) {
                const dino = {name: namesArr[i],
                            id: idsArr[i],
                            liked: likesArr[i]};
                this.dinos.push(dino);
                this.list.insertBefore(this.renderListItem(dino), this.list.firstChild);
                this.addEventListeners(dino.id);
            }
        } else {
            this.names = '';
            this.ids = '';
            this.likes = '';
        }
    },

    updateStorage() {
        this.names = '';
        this.ids = '';
        this.likes = '';
        for(let i = 0; i < this.dinos.length; i++) {
            this.names += `${this.dinos[i].name}&`;
            this.ids += `${this.dinos[i].id}&`;
            this.likes += `${this.dinos[i].liked}&`;
        }
        localStorage.setItem('names', this.names);
        localStorage.setItem('ids', this.ids);
        localStorage.setItem('likes', this.likes);
    },

    renderListItem(dino) {
        //Creates list item with unique IDs for each button
        const item = document.createElement('li');
        item.innerHTML =`
            <div class="input-group">
                <div class="input-group-field">${dino.name}</div>
                <div class="input-group-button">
                    <button type="button" id="${'like'+dino.id}" class="button">${dino.liked == 'true' ? 'Unlike' : 'Like'}</button>
                </div>
                <div class="input-group-button">
                    <button type="button" id="${'del'+dino.id}" class="button">Delete</button>
                </div>
                <div class="input-group-button">
                    <button type="button" id="${'up'+dino.id}" class="button">Up</button>
                </div>  
                <div class="input-group-button">
                    <button type="button" id="${'down'+dino.id}" class="button">Down</button>
                </div>
            </div>
        `;
        item.id = 'item'+dino.id;
        if(dino.liked == 'true') {
            item.style.backgroundColor = '#F0F3BD';
        }

        return item;
    },

    addEventListeners(id) {
        document.querySelector('#like'+id).addEventListener('click', this.like.bind(this));
        document.querySelector('#del'+id).addEventListener('click', this.delete.bind(this));
        document.querySelector('#up'+id).addEventListener('click', this.moveUp.bind(this));
        document.querySelector('#down'+id).addEventListener('click', this.moveDown.bind(this));
    },

    like(event) {
        const button = event.target;
        const listItem = document.querySelector(`#${button.id.replace('like','item')}`);
        let dino;
        //Find dino in array
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                dino = this.dinos[i];
                break;
            }
        }
        //Toggles button text and background color
        if(button.textContent == 'Like') {
            listItem.style.backgroundColor = '#F0F3BD';
            button.textContent = 'Unlike';
            dino.liked = true;
        } else {
            listItem.style.backgroundColor = 'white';
            button.textContent = 'Like';
            dino.liked = false;
        }
        this.updateStorage();
    },

    delete(event) {
        const listItem = document.querySelector(`#${event.target.id.replace('del','item')}`);
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
        const listItem = document.querySelector(`#${event.target.id.replace('up','item')}`);
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
        const listItem = document.querySelector(`#${event.target.id.replace('down','item')}`);
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

        //Update names and ids string (for localStorage)
        this.names +=  `${dino.name}&`;
        this.ids +=     `${dino.id}&`;
        this.likes +=  `${dino.liked}&`
        localStorage.setItem('names', this.names);
        localStorage.setItem('ids', this.ids);
        localStorage.setItem('likes', this.likes);

        /*
            Add a promote/fav button 
            Edit button
        */
        this.max++;
    },
};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});