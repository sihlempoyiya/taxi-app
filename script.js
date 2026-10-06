// Bare minimum - NO dollar signs, old way with +

let fare = 18;
let payments = [];

const fareInput = document.getElementById('fareInput');
const form = document.getElementById('paymentForm');
const rowInput = document.getElementById('rowInput');
const amountInput = document.getElementById('amountInput');
const peopleInput = document.getElementById('peopleInput');
const list = document.getElementById('paymentList');
const emptyMsg = document.getElementById('emptyMsg');

const totalCollectedEl = document.getElementById('totalCollected');
const totalChangeEl = document.getElementById('totalChangeOwed');
const totalPeopleEl = document.getElementById('totalPeople');

fareInput.addEventListener('input', function() {
  fare = parseFloat(fareInput.value) || 18;
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  let row = rowInput.value.trim();
  let amount = parseFloat(amountInput.value);
  let people = parseInt(peopleInput.value);

  if (!row || amount <= 0 || people <= 0) {
    alert("Please fill all fields correctly");
    return;
  }

  let cost = people * fare;
  let change = amount - cost;

  let payment = {
    id: Date.now(),
    row: row,
    amount: amount,
    people: people,
    cost: cost,
    change: change > 0 ? change : 0,
    short: change < 0 ? Math.abs(change) : 0,
    done: false
  };

  payments.push(payment);
  form.reset();
  peopleInput.value = 1;

  showPayments();
  showTotals();
});

function showPayments() {
  list.innerHTML = "";

  if (payments.length === 0) {
    emptyMsg.classList.remove('d-none');
    return;
  }
  emptyMsg.classList.add('d-none');

  payments.forEach(function(p) {
    let div = document.createElement('div');
    div.className = "payment-item";

    // Build status using old + way
    let status = "";
    if (p.short > 0) {
      status = "SHORT R" + p.short;
    } else if (p.change > 0) {
      status = "OWE R" + p.change;
    } else {
      status = "Exact";
    }
    if (p.done) {
      status = "Done";
    }

    // Build HTML using old + way
    let giveButton = "";
    if (p.change > 0 && !p.done) {
      giveButton = "<br><button onclick='giveChange(" + p.id + ")' class='btn btn-sm btn-dark mt-1'>Give</button>";
    }

    div.innerHTML = 
      "<div>" +
        "<b>" + p.row + "</b> (" + p.people + " x R" + fare + ")<br>" +
        "<small>Gave R" + p.amount + " | Cost R" + p.cost + "</small>" +
      "</div>" +
      "<div>" +
        "<span class='change-badge'>" + status + "</span>" +
        giveButton +
      "</div>";

    list.appendChild(div);
  });
}

function showTotals() {
  let collected = payments.reduce(function(sum, p) { return sum + p.cost; }, 0);
  let changeOwed = payments.reduce(function(sum, p) { return sum + (p.done ? 0 : p.change); }, 0);
  let peopleCount = payments.reduce(function(sum, p) { return sum + p.people; }, 0);

  totalCollectedEl.textContent = "R" + collected;
  totalChangeEl.textContent = "R" + changeOwed;
  totalPeopleEl.textContent = peopleCount;
}

function giveChange(id) {
  let found = payments.find(function(p) { return p.id === id; });
  if (found) {
    found.done = true;
  }
  showPayments();
  showTotals();
}

window.giveChange = giveChange;