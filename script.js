let phrasebookData = {};
const container = document.getElementById('phrasebook-container');
const leftLangSelect = document.getElementById('leftLang');
const rightLangSelect = document.getElementById('rightLang');

let lastLeftLang = leftLangSelect.value;
let lastRightLang = rightLangSelect.value;

function updateSelectOptions(changedSide) {
  const leftLang = leftLangSelect.value;
  const rightLang = rightLangSelect.value;

  if (changedSide === 'left') {
    if (leftLang === rightLang) {
      rightLangSelect.value = lastLeftLang;
    }
    lastLeftLang = leftLang;
    lastRightLang = rightLangSelect.value;
  } else if (changedSide === 'right') {
    if (rightLang === leftLang) {
      leftLangSelect.value = lastRightLang;
    }
    lastRightLang = rightLang;
    lastLeftLang = leftLangSelect.value;
  }
}

function renderPhraseForLang(phrases, lang) {
  const mainText = phrases[lang] || '';
  const transcriptionLang = lang + '-lat';
  const transcription = phrases[transcriptionLang] || null;

  const containerDiv = document.createElement('div');
  
  const mainP = document.createElement('div');
  mainP.textContent = mainText;
  containerDiv.appendChild(mainP);

  if (transcription) {
    const transP = document.createElement('div');
    transP.textContent = transcription;
    transP.style.fontStyle = 'italic';
    transP.style.color = '#555';
    transP.style.fontSize = '0.9em';
    transP.style.marginTop = '3px';
    containerDiv.appendChild(transP);
  }

  return containerDiv;
}

function renderPhraseForLang(phrases, lang, key) {
  const mainText = phrases[lang] && phrases[lang][key];
  const transcriptionLang = lang + '-lat';
  const transcription = phrases[transcriptionLang] && phrases[transcriptionLang][key];

  const containerDiv = document.createElement('div');

  if (typeof mainText === 'string') {
    const mainP = document.createElement('div');
    mainP.textContent = mainText;
    containerDiv.appendChild(mainP);
  } else {
    const mainP = document.createElement('div');
    mainP.textContent = '[missing]';
    containerDiv.appendChild(mainP);
  }

  if (transcription) {
    const transP = document.createElement('div');
    transP.textContent = transcription;
    transP.style.fontStyle = 'italic';
    transP.style.color = '#555';
    transP.style.fontSize = '0.9em';
    transP.style.marginTop = '2px';
    containerDiv.appendChild(transP);
  }

  return containerDiv;
}

function renderPhrasebook() {
  const leftLang = leftLangSelect.value;
  const rightLang = rightLangSelect.value;

  container.innerHTML = '';

  for (const topic in phrasebookData) {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic';

    const topicTitle = document.createElement('h2');
    topicTitle.textContent = topic;
    topicDiv.appendChild(topicTitle);

    const headers = document.createElement('div');
    headers.className = 'headers';

    const leftHeader = document.createElement('div');
    leftHeader.className = 'language';
    leftHeader.textContent = leftLang;

    const rightHeader = document.createElement('div');
    rightHeader.className = 'language';
    rightHeader.textContent = rightLang;

    headers.appendChild(leftHeader);
    headers.appendChild(rightHeader);
    topicDiv.appendChild(headers);

    const phrases = phrasebookData[topic];

    const phraseKeys = Object.keys(phrases[leftLang] || phrases[rightLang] || {});

    for (const key of phraseKeys) {
      const row = document.createElement('div');
      row.className = 'phrase-row';

      const leftCell = document.createElement('div');
      leftCell.className = 'language';
      leftCell.appendChild(renderPhraseForLang(phrases, leftLang, key));

      const rightCell = document.createElement('div');
      rightCell.className = 'language';
      rightCell.appendChild(renderPhraseForLang(phrases, rightLang, key));

      row.appendChild(leftCell);
      row.appendChild(rightCell);
      topicDiv.appendChild(row);
    }

    container.appendChild(topicDiv);
  }
}

leftLangSelect.addEventListener('change', () => {
  updateSelectOptions('left');
  renderPhrasebook();
});

rightLangSelect.addEventListener('change', () => {
  updateSelectOptions('right');
  renderPhrasebook();
});

fetch('phrasebook.json')
  .then(response => response.json())
  .then(data => {
    phrasebookData = data;
    updateSelectOptions();
    renderPhrasebook();
  })
  .catch(err => console.error('Error loading phrasebook:', err));

  const switchLangBtn = document.getElementById('switchLangBtn');

switchLangBtn.addEventListener('click', () => {
  const leftValue = leftLangSelect.value;
  const rightValue = rightLangSelect.value;

  leftLangSelect.value = rightValue;
  rightLangSelect.value = leftValue;

  updateSelectOptions();
  renderPhrasebook();
});
