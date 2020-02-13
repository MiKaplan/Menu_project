const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.plates');
const noData = document.querySelector('.no-data');
const items = JSON.parse(localStorage.getItem('items')) || [];
const input = document.querySelector('[name=item]');
const btn = document.querySelector('[type=submit]');

function addItem(event) {
    event.preventDefault();
    const text = this.querySelector('[name=item]').value;
    const item = {
        text,
        done: false
    };
    items.push(item);
    populateList(itemsList, items);
    localStorage.setItem('items', JSON.stringify(items));
    this.reset();
}

function populateList(itemsList, items) {
    itemsList.innerHTML = items.map((item, index) => {
        return `
               <li>
                    <input type="text" id="input${index}" class="edit_input display-none">
                    <input 
                        type="checkbox" 
                        data-index="${index}" 
                        id='item${index}' ${item.done ? 'checked' : null}>
                    <label id="label${index}" for="item${index}">${item.text}</label>
                    <button id="edit${index}" class="edit-item"><i class="fas fa-pen"></i></button>
                    <button id="delete${index}" class="delete-item"><i class="fas fa-trash-alt"></i></button>
                    <button id="save${index}" class="save-item display-none"><i class="far fa-save"></i></button>
               </li>
           `
    }).join('');
}

function toggleDone(event) {
    if(!event.target.matches('input')) return;
    const index = event.target.dataset.index;
    items[index].done = !items[index].done;
    populateList(itemsList, items);
    localStorage.setItem('items', JSON.stringify(items));
}

function editItems(event) {
    const editBtn = event.target.closest('.edit-item');

    if (!editBtn) return;
    const index = editBtn.id.split('edit')[1];
    const editInput = document.getElementById(`input${index}`);
    const item = document.getElementById(`label${index}`);
    const deleteBtn = document.getElementById(`delete${index}`);
    const saveBtn = document.getElementById(`save${index}`);


    editInput.value = item.innerHTML;
    item.classList.add('display-none');
    editInput.classList.remove('display-none');
    editInput.focus();
    editInput.select();
    editBtn.classList.add('display-none');
    deleteBtn.classList.add('display-none');
    saveBtn.classList.remove('display-none');


    function saveChange() {
        items[index].text = editInput.value;
        populateList(itemsList, items);
        localStorage.setItem('items', JSON.stringify(items));
    }

    saveBtn.addEventListener('click', saveChange);
}

function deleteItems(event) {
    const deleteBtn = event.target.closest('.delete-item');

    if (!deleteBtn) return;
    const index = deleteBtn.id.split('delete')[1];
    const blackout = document.querySelector('.blackout');
    const validateDel = document.querySelector('.validate-del');
    const validateOk = document.querySelector('.validate_ok');
    const validateNo = document.querySelector('.validate_no');
    validateDel.classList.remove('display-none');
    blackout.classList.remove('display-none');

    function returnView() {
        validateDel.classList.add('display-none');
        blackout.classList.add('display-none');
    }

    function deleteItem() {
        items.splice(index, 1);
        populateList(itemsList, items);
        localStorage.setItem('items', JSON.stringify(items));
        validateDel.classList.add('display-none');
        blackout.classList.add('display-none');
    }

    validateNo.addEventListener('click', returnView);
    blackout.addEventListener('click', returnView);
    validateOk.addEventListener('click', deleteItem);
}

itemsList.addEventListener('click', toggleDone);
itemsList.addEventListener('click', editItems);
itemsList.addEventListener('click', deleteItems);
addItems.addEventListener('submit', addItem);
input.addEventListener('input', () => {
    if (input.value === '') {
        btn.setAttribute('disabled', 'disabled')
    } else {
        btn.removeAttribute('disabled')
    }
});

if(items.length) {
    populateList(itemsList, items);
} else {
    noData.innerText = 'No Data';
}


