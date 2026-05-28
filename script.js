const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.querySelector('.task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const statsText = document.querySelector('.stats-text');
const clearBtn = document.querySelector('.clear-btn');
const errorMsg = document.getElementById('error-msg');
let currentFilter = 'all';

function updateStats() {
    const all = taskList.querySelectorAll('.task-item');
    const done = taskList.querySelectorAll('.task-item.done');
    statsText.textContent = `${done.length} de ${all.length} concluída${all.length !== 1 ? 's' : ''}`;
}

function applyFilter() {
    taskList.querySelectorAll('.task-item').forEach(item => {
        const done = item.classList.contains('done');
        const show =
            currentFilter === 'all' ||
            (currentFilter === 'done' && done) ||
            (currentFilter === 'pending' && !done);
        item.style.display = show ? '' : 'none';
    });
    updateStats();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilter();
    });
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add('visible');
    taskInput.classList.add('input-error');
    taskInput.focus();
    setTimeout(() => {
        errorMsg.classList.remove('visible');
        taskInput.classList.remove('input-error');
    }, 2500);
}

function showSpinner() {
    addBtn.disabled = true;
    addBtn.innerHTML = '<span class="spinner"></span>';
}

function hideSpinner() {
    addBtn.disabled = false;
    addBtn.innerHTML = '+';
}

function createTask(text) {
    const item = document.createElement('div');
    item.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            item.classList.add('done');
        } else {
            item.classList.remove('done');
        }
        applyFilter();
    });

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.classList.add('btn-del');
    delBtn.title = 'Remover tarefa';
    delBtn.innerHTML = '&#x2715;';
    delBtn.addEventListener('click', () => {
        item.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            item.remove();
            applyFilter();
        }, 200);
    });

    item.appendChild(checkbox);
    item.appendChild(span);
    item.appendChild(delBtn);
    taskList.appendChild(item);
}

function handleAdd() {
    const raw = taskInput.value;
    const text = raw.trim();

    if (!text) {
        showError(raw.length === 0 ? 'Digite uma tarefa antes de adicionar.' : 'A tarefa não pode conter apenas espaços.');
        return;
    }

    showSpinner();

    setTimeout(() => {
        createTask(text);
        taskInput.value = '';
        hideSpinner();
        applyFilter();
        taskInput.focus();
    }, 600);
}

addBtn.addEventListener('click', handleAdd);

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAdd();
    if (errorMsg.classList.contains('visible')) {
        errorMsg.classList.remove('visible');
        taskInput.classList.remove('input-error');
    }
});

clearBtn.addEventListener('click', () => {
    const doneTasks = taskList.querySelectorAll('.task-item.done');
    if (doneTasks.length === 0) return;
    doneTasks.forEach(item => {
        item.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            item.remove();
            applyFilter();
        }, 200);
    });
});

document.querySelectorAll('.task-item').forEach(item => {
    const checkbox = item.querySelector('.task-check');
    const delBtn = item.querySelector('.btn-del');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            item.classList.add('done');
        } else {
            item.classList.remove('done');
        }
        applyFilter();
    });

    delBtn.addEventListener('click', () => {
        item.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            item.remove();
            applyFilter();
        }, 200);
    });
});

updateStats();