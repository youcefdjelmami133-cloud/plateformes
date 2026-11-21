const weightForm  = document.getElementById('weight-form');
const dateIn      = document.getElementById('date-input');
const weightIn    = document.getElementById('weight-input');
const typeIn      = document.getElementById('type-input');
const notesIn     = document.getElementById('notes-input');
const earIn       = document.getElementById('ear-input');
const tableBody   = document.querySelector('#weights-table tbody');
const STORAGE_KEY = 'animal_weights_DZ0002';

function loadSavedData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.forEach(row => addRowToTable(row.date, row.weight, row.type, row.notes, row.ear));
}

function addRowToTable(date, weight, type, notes, ear) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${date}</td>
    <td>${weight}</td>
    <td>${type}</td>
    <td>${notes || '-'}</td>
    <td>${ear || '-'}</td>
  `;
  tableBody.appendChild(tr);
}

function saveToStorage(date, weight, type, notes, ear) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push({ date, weight, type, notes, ear });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

weightForm.addEventListener('submit', e => {
  e.preventDefault();

  const date   = dateIn.value;
  const weight = weightIn.value;
  const type   = typeIn.value;
  const notes  = notesIn.value.trim();
  const ear    = earIn.value.trim();

  if (!date || !weight) {
    alert('الرجاء تعبئة التاريخ والوزن على الأقل.');
    return;
  }

  addRowToTable(date, weight, type, notes, ear);
  saveToStorage(date, weight, type, notes, ear);
  weightForm.reset();
  dateIn.focus();
});

loadSavedData();
// === 7. أحداث (Events) - نسخة تشخيصية ===
console.log('🔍 بدء تشخيص نموذج الأحداث...');

// 1. التحقق من وجود العناصر
const eventForm = document.getElementById('event-form');
const eventDate = document.getElementById('event-date');
const eventType = document.getElementById('event-type');
const eventNotes = document.getElementById('event-notes');
const eventsTableBody = document.querySelector('#events-table tbody');

console.log('event-form:', eventForm);
console.log('event-date:', eventDate);
console.log('event-type:', eventType);
console.log('event-notes:', eventNotes);
console.log('events-table tbody:', eventsTableBody);

// 2. إذا أي عنصر مفقود → أظهر خطأ واضح في Console
if (!eventForm) console.error('❌ مفقود: <form id="event-form">');
if (!eventDate) console.error('❌ مفقود: <input id="event-date">');
if (!eventType) console.error('❌ مفقود: <select id="event-type">');
if (!eventNotes) console.error('❌ مفقود: <textarea id="event-notes">');
if (!eventsTableBody) console.error('❌ مفقود: <table id="events-table"> مع <tbody>');

const EVENTS_STORAGE_KEY = 'animal_events_DZ0002';

function loadEventsData() {
  const data = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
  if (eventsTableBody) {
    eventsTableBody.innerHTML = '';
    data.forEach(row => addEventRowToTable(row.date, row.type, row.notes));
  }
}

function addEventRowToTable(date, type, notes) {
  if (!eventsTableBody) return;
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${date}</td><td>${type}</td><td>${notes || '-'}</td>`;
  eventsTableBody.appendChild(tr);
}

function saveEventToStorage(date, type, notes) {
  const data = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
  data.push({ date, type, notes });
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(data));
}

if (eventForm) {
  eventForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('✅ تم الضغط على حفظ الحدث');
    
    const date = eventDate?.value;
    const type = eventType?.value;
    const notes = eventNotes?.value.trim();

    if (!date || !type) {
      alert('الرجاء تعبئة التاريخ ونوع الحدث.');
      return;
    }

    addEventRowToTable(date, type, notes);
    saveEventToStorage(date, type, notes);
    eventForm.reset();
    eventDate?.focus();
  });
} else {
  console.error('🚫 لا يمكن إضافة مستمع الحدث: النموذج غير موجود!');
}

