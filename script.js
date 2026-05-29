const THEME_KEY = 'tasklist_theme';

function loadTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
        return 'light';
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
        console.warn('localStorage indisponível, tema não será persistido.', err);
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☾' : '☀';
}

applyTheme(loadTheme());

const STORAGE_KEY = 'tasklist_tasks';

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            done: item.classList.contains('done'),
        });
    });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
    }
}

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.querySelector('.task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const statsText = document.querySelector('.stats-text');
const clearBtn = document.querySelector('.clear-btn');
const errorMsg = document.getElementById('error-msg');
let currentFilter = 'all';

function updateStats() {
    const all = taskList.querySelectorAll('.task-item').length;
    const done = taskList.querySelectorAll('.task-item.done').length;
    statsText.textContent = `${done} de ${all} concluída${all !== 1 ? 's' : ''}`;
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

function createTask(text, done = false) {
    const item = document.createElement('div');
    item.classList.add('task-item');
    if (done) item.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    checkbox.checked = done;
    checkbox.addEventListener('change', () => {
        item.classList.toggle('done', checkbox.checked);
        saveTasks();
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
            saveTasks();
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
        showError(raw.length === 0
            ? 'Digite uma tarefa antes de adicionar.'
            : 'A tarefa não pode conter apenas espaços.');
        return;
    }

    showSpinner();
    setTimeout(() => {
        createTask(text);
        saveTasks();
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
    if (!doneTasks.length) return;
    doneTasks.forEach(item => {
        item.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            item.remove();
            saveTasks();
            applyFilter();
        }, 200);
    });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
});

const DEFAULTS = [
    { text: 'Comprar mantimentos na feira', done: false },
    { text: 'Responder e-mails do trabalho', done: false },
];

const persisted = loadTasks();
const initial = persisted.length > 0 ? persisted : DEFAULTS;

initial.forEach(({ text, done }) => createTask(text, done));
applyFilter();