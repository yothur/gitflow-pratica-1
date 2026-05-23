const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.querySelector('.task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

function applyFilter() {
    taskList.querySelectorAll('.task-item').forEach(item => {
        const done = item.querySelector('.task-check').checked;
        const show =
            currentFilter === 'all' ||
            (currentFilter === 'done' && done) ||
            (currentFilter === 'pending' && !done);

        item.style.display = show ? '' : 'none';
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilter();
    });
});

function createTask(text) {
    const item = document.createElement('div');
    item.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    checkbox.addEventListener('change', applyFilter);

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.classList.add('btn-del');
    delBtn.innerHTML = '&#x2715;';
    delBtn.addEventListener('click', () => item.remove());

    item.appendChild(checkbox);
    item.appendChild(span);
    item.appendChild(delBtn);
    taskList.appendChild(item);
}

addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    createTask(text);
    taskInput.value = '';
});

document.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.task-item').remove());
});