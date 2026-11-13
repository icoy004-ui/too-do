// To-Do List sederhana: tambah, centang, hapus, filter, simpan di localStorage
const MAX_LENGTH = 200;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const counter = document.getElementById('counter');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = input.value.trim();
  if (text === '') {
    alert('Tugas tidak boleh kosong');
    return;
  }
  if (text.length > MAX_LENGTH) {
    alert('Tugas maksimal ' + MAX_LENGTH + ' karakter');
    return;
  }
  const isDuplicate = tasks.some(function (t) {
    return t.text.toLowerCase() === text.toLowerCase();
  });
  if (isDuplicate) {
    alert('Tugas tersebut sudah ada');
    return;
  }
  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  save();
  render();
}

function toggleTask(id) {
  const t = tasks.find(function (x) { return x.id === id; });
  t.done = !t.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (x) { return x.id !== id; });
  save();
  render();
}

// Membuat satu baris tugas dengan createElement + textContent (aman dari XSS)
function createTaskItem(t) {
  const li = document.createElement('li');
  if (t.done) li.className = 'done';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = t.done;
  checkbox.setAttribute('aria-label', 'Tandai selesai: ' + t.text);
  checkbox.addEventListener('change', function () { toggleTask(t.id); });

  const span = document.createElement('span');
  span.textContent = t.text;

  const delBtn = document.createElement('button');
  delBtn.className = 'del';
  delBtn.textContent = 'Hapus';
  delBtn.addEventListener('click', function () { deleteTask(t.id); });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  return li;
}

function render() {
  const visible = tasks.filter(function (t) {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'done') return t.done;
    return true;
  });
  list.innerHTML = '';
  visible.forEach(function (t) {
    list.appendChild(createTaskItem(t));
  });
  const left = tasks.filter(function (t) { return !t.done; }).length;
  counter.textContent = left + ' tugas belum selesai';
}

document.getElementById('addBtn').addEventListener('click', addTask);
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});
document.querySelectorAll('.filter').forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    render();
  });
});

render();
