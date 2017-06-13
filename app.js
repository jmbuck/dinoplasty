//categorize into different lists (eras)

class App {
    constructor(selectors) {
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.handleSubmit.bind(this));
        document
            .querySelector(selectors.dropDownSelector)
            .addEventListener('change', this.changeList.bind(this));
        this.max = 0;
        this.triassic = document.querySelector(selectors.listSelector1);
        this.jurassic = document.querySelector(selectors.listSelector2);
        this.cretaceous = document.querySelector(selectors.listSelector3);
        this.jurassic.style.display = 'none';
        this.cretaceous.style.display = 'none';
        this.currList = this.triassic;
        this.load();
    }

    load() {       
        //If localStorage has data (isn't null), parse it and update list and data array,
        //Reassign IDs so they remain unique
        this.dinos = JSON.parse(localStorage.getItem('dinos'));
        if(this.dinos) {
            this.currList = this.triassic;
            this.dinos.triassic.map((dino) => {
                dino.id = this.max;
                this.addDino(dino, 'triassic');
                const icon = document.querySelector(`[data-id="${dino.id}"] .like>i`)
                if(dino.liked === true) {
                    icon.textContent = 'favorite';
                }
            });
            this.currList = this.jurassic;
            this.dinos.jurassic.map((dino) => {
                dino.id = this.max;
                this.addDino(dino, 'jurassic');
                const icon = document.querySelector(`[data-id="${dino.id}"] .like>i`)
                if(dino.liked === true) {
                    icon.textContent = 'favorite';
                }
            });
            this.currList = this.cretaceous;
            this.dinos.cretaceous.map((dino) => {
                dino.id = this.max;
                this.addDino(dino, 'cretaceous');
                const icon = document.querySelector(`[data-id="${dino.id}"] .like>i`)
                if(dino.liked === true) {
                    icon.textContent = 'favorite';
                }
            });
        }
        else {
             this.dinos = {};
             this.dinos.triassic = [];
             this.dinos.jurassic = [];
             this.dinos.cretaceous = [];
        }
        this.currArr = this.dinos.triassic;
    }

    save() {
        localStorage.setItem('dinos', JSON.stringify(this.dinos));
    }

    changeList(e) {
        const era = e.target.value;
        if(era === 'triassic') {
            this.currList = this.triassic;
            this.currArr = this.dinos.triassic;
            this.jurassic.style.display = 'none';
            this.cretaceous.style.display = 'none';
            this.triassic.style.display = 'initial';
        }
        else if(era === 'jurassic') {
            this.currList = this.jurassic;
            this.currArr = this.dinos.jurassic;
            this.triassic.style.display = 'none';
            this.cretaceous.style.display = 'none';
            this.jurassic.style.display = 'initial';
        }
        else {
            this.currList = this.cretaceous;
            this.currArr = this.dinos.cretaceous;
            this.jurassic.style.display = 'none';
            this.triassic.style.display = 'none';
            this.cretaceous.style.display = 'initial';
        }
    }

    createListItem(dino) {
        //Creates list item with unique IDs for each button
        const listItem = document.createElement('li');
        listItem.innerHTML =`
            <div class="input-group">
                <div class="input-group-field name">${dino.name}</div>
                <div class="input-group-button">
                    <div class="editName">
                        <i class="material-icons" style="font-size: 36px">edit</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="like">
                        <i class="material-icons" style="font-size: 36px">favorite_border</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="delete">
                        <i class="material-icons" style="font-size: 36px">delete</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="up">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_up</i>
                    </div>
                </div>  
                <div class="input-group-button">
                      <div class="down">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners(listItem);
        listItem.dataset.id = dino.id;
        if(dino.liked === true) {
            listItem.style.backgroundColor = '#EDCB96';
        }
        return listItem;
    }

    addEventListeners(listItem) {
        //click events
        listItem.querySelector('.like').addEventListener('click', this.like.bind(this));
        listItem.querySelector('.delete').addEventListener('click', this.delete.bind(this));
        listItem.querySelector('.up').addEventListener('click', this.moveUp.bind(this));
        listItem.querySelector('.down').addEventListener('click', this.moveDown.bind(this));
        listItem.querySelector('.editName').addEventListener('mousedown', this.edit.bind(this));

        //hover events on delete
        listItem.querySelector('.delete').addEventListener('mouseover', function(event) {
            event.target.innerHTML = 'delete_forever';
        } );
        listItem.querySelector('.delete').addEventListener('mouseout', function(event) {
            event.target.innerHTML = 'delete';
        });
    }

    edit(e) {
        e.preventDefault();
        const icon = e.target;
        const listItem = icon.closest('li');
        const field = listItem.querySelector(`.name`);
        
        if(icon.textContent === 'edit') {
            //Change button icon, store original text, and focus user on textbox
            icon.textContent = 'check'
            this.oldName = field.textContent;
            field.contentEditable = true;
            field.textContent = '';
            field.focus();

            field.addEventListener('keydown', (e) => {
                if(e.keyCode === 13 || e.keyCode === 9) { //Enter or Tab keypress
                    //Complete editing
                    this.finishEditing(field, icon, true);
                } 
                if(e.keyCode === 27) { //Escape keypress
                    //Cancel editing
                    this.finishEditing(field, icon, false);
                }
            })

            field.addEventListener('blur', (e) => {
                //If user clicks out of textbox, cancel editing
                if(field.isContentEditable) {
                     this.finishEditing(field, icon, true);
                }
            })
        } else {
            //User clicks button to complete editing
            this.finishEditing(field, icon, true);
        }
        
    }

    finishEditing(field, icon, changed) {
        if(field.textContent === '' || !changed) {
            field.textContent = this.oldName;
        } 
        icon.textContent = 'edit';
        field.contentEditable = false;
        if(changed) {
            const listItem = icon.closest('li');
            for(let i = 0; i < this.currArr.length; i++) {
                if(this.currArr[i].id === parseInt(listItem.dataset.id)) {
                    this.currArr[i].name = field.textContent; 
                    this.save();
                    break;
                }
            }
        }
    }

    like(event) {
        const icon = event.target;
        const listItem = icon.closest('li');
        let dino;
        //Searches the dinos array for id matching listItem id
        for(let i = 0; i < this.currArr.length; i++) {
            if(this.currArr[i].id === parseInt(listItem.dataset.id)) {
                dino = this.currArr[i];
                break;
            }
        }

        //Toggles button text and background color
        if(icon.innerHTML === 'favorite_border') {
            listItem.style.backgroundColor = '#EDCB96';
            icon.textContent = 'favorite';
            dino.liked = true;
        } else {
            listItem.style.backgroundColor = '#9E7682';
            icon.textContent = 'favorite_border';
            dino.liked = false;
        }
        this.save();
    }

    delete(event) {
        const icon = event.target;
        const listItem = icon.closest('li');
        //Searches the dinos array for id matching listItem id
        for(let i = 0; i < this.currArr.length; i++) {
            if(this.currArr[i].id === parseInt(listItem.dataset.id)) {
                this.currArr.splice(i, 1);
                this.save();
                listItem.remove();
                break;
            }
        }
    }

    moveUp(event) {      
        const listItem = event.target.closest('li');
        //Searches the dinos array for id matching listItem id
        //and swaps the element with the next in the array (up in the list)
        for(let i = 0; i < this.currArr.length; i++) {
            if(this.currArr[i].id === parseInt(listItem.dataset.id)) {
                if(i < this.currArr.length-1) {
                    let temp = this.currArr[i];
                    this.currArr[i] = this.currArr[i+1];
                    this.currArr[i+1] = temp;
                    this.currList.insertBefore(listItem, listItem.previousSibling)
                    this.save();
                    break;
                }
            }
        }
    }

    moveDown(event) {
        const listItem = event.target.closest('li');
        //Searches the dinos array for id matching listItem id
        //and swaps the element with the previous in the array (down in the list)
        for(let i = 0; i < this.currArr.length; i++) {
            if(this.currArr[i].id === parseInt(listItem.dataset.id)) {
                if(i > 0) {
                    let temp = this.currArr[i];
                    this.currArr[i] = this.currArr[i-1];
                    this.currArr[i-1] = temp;
                    this.currList.insertBefore(listItem.nextSibling, listItem);
                    this.save();
                    break;
                }
            }
        }
    }

    handleSubmit(event) {
        //Create dino object
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value.trim(),
            era: form.dinoEra.value.trim(),
            id: this.max,
            liked: false,
        };

        if(dino.era) {
             //Add dino onto array and list
            this.dinos[dino.era].push(dino);
            this.addDino(dino, dino.era);
            form.reset();
        }
    }

    addDino(dino, era) {
        //Insert into start of list and dinos array
        const listItem = this.createListItem(dino)
        if(era === 'jurassic') {
            this.jurassic.insertBefore(listItem, this.jurassic.firstChild); 
        } else if(era === 'triassic') {
            this.triassic.insertBefore(listItem, this.triassic.firstChild); 
        } else {
            this.cretaceous.insertBefore(listItem, this.cretaceous.firstChild); 
        }
        
        //Save data in local storage
        this.save();
        this.max++;
    }
};

const app = new App({
    formSelector: '#dino-form',
    listSelector1: '#triassic-list',
    listSelector2: '#jurassic-list',
    listSelector3: '#cretaceous-list',
    dropDownSelector: '#showEra',
});