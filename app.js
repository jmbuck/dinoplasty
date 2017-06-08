const app = {
    init(selectors) {
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this));
        this.max = 0;
        this.list = document.querySelector(selectors.listSelector);
        this.dinos = [];
    
    },

    renderListItem(dino) {
        const item = document.createElement('li');
        item.innerHTML =`
            <div class="input-group">
                <div class="input-group-field">${dino.name}</div>
                <div class="input-group-button">
                    <button type="button" id="${'like'+dino.id}" class="button">Like</button>
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

        return item;
    },

    addEventListeners() {
        document.querySelector('#like'+this.max).addEventListener('click', this.like.bind(this));
        document.querySelector('#del'+this.max).addEventListener('click', this.delete.bind(this));
        document.querySelector('#up'+this.max).addEventListener('click', this.moveUp.bind(this));
        document.querySelector('#down'+this.max).addEventListener('click', this.moveDown.bind(this));
    },

    like(event) {
        const button = event.target;
        const listItem = document.querySelector(`#${button.id.replace('like','item')}`);
        console.log(button.textContent);
        if(button.textContent == 'Like') {
            listItem.backgroundColor = '#F0F3BD';
            button.textContent = 'Unlike';
        } else {
            listItem.backgroundColor = 'white';
            button.textContent = 'Like';
        }
    },

    delete(event) {
        const listItem = document.querySelector(`#${event.target.id.replace('del','item')}`);
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                this.dinos.splice(i, 1);
            }
        }
        listItem.parentElement.removeChild(listItem);
    },

    moveUp(event) {
        const listItem = document.querySelector(`#${event.target.id.replace('up','item')}`);
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                if(i < this.dinos.length-1) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i+1];
                    this.dinos[i+1] = temp;
                    listItem.parentNode.insertBefore(listItem, listItem.previousSibling);
                }
                break;
            }
        }
    },

    moveDown(event) {
        const listItem = document.querySelector(`#${event.target.id.replace('down','item')}`);
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id == listItem.id.substr(4)) {
                if(i > 0) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i-1];
                    this.dinos[i-1] = temp;
                    listItem.parentNode.insertBefore(listItem.nextSibling, listItem);
                }
                break;
            }
        }
    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value,
            id: this.max,
        };
        form.dinoName.value = '';

        this.list.insertBefore(this.renderListItem(dino), this.list.firstChild); 
        this.dinos.push(dino);

        this.addEventListeners();


        /*
            Add a promote/fav button 
            Add a delete button
            Add buttons to move a dinosaur up and down the list.
            Persist the dinosaur data using `window.localStorage`. The dinosaurs should stay
            in the list even when the page is refreshed.
            Edit button
        */
        this.max++;
    },
};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});