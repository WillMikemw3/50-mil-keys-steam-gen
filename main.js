const keySymbols = [
  'A','B','C','D','E','F','G','H','I','J',
  'K','L','M','N','O','P','Q','R','S','T',
  'U','V','W','X','Y','Z',
  '0','1','2','3','4','5','6','7','8','9'
];
const keys = [];

// Gera uma chave no formato XXXXX-XXXXX-XXXXXX (17 chars contando os dois hífens)
async function genKey() {
  let x = 0;
  let newKey = '';
  while (x < 17) {
    let random = Math.floor(Math.random() * keySymbols.length);
    if (x === 5 || x === 11) {
      newKey += '-';
      x++;
    } else {
      newKey += keySymbols[random];
      x++;
    }
  }
  return newKey;
}

// Gera 50 chaves únicas e retorna o array
async function genUniqueKeys() {
  console.log("Gerando chaves...");
  while (keys.length < 50) {
    const newKey = await genKey();
    if (!keys.includes(newKey)) {
      keys.push(newKey);
    }
    // se já existe, volta ao loop até encontrar uma nova
  }
  return keys;
}

// Funções de ativação e de checagem de página continuam iguais
function isHidden(e) {
  return window.getComputedStyle(e).display === 'none';
}

function activate(key) {
  console.log('\n===== Ativação ' + key + ' =====');
  document.getElementById('product_key').value = key;
  if (!document.getElementById('accept_ssa').checked) {
    document.getElementById('accept_ssa').click();
  }
  setTimeout(() => {
    document.getElementById('register_btn').click();
  }, 100);
}

function checkPage(s) {
  let errorDisplay   = document.getElementById('error_display');
  let receiptForm    = document.getElementById('receipt_form');
  let registerForm   = document.getElementById('registerkey_form');

  if (!isHidden(receiptForm)) {
    s.wait = false;
    console.log(receiptForm.firstElementChild.textContent.trim());
    console.log(document.getElementById('registerkey_productlist').textContent);
    DisplayPage('code'); // mostra o registerkey_form
  }
  else if (!isHidden(registerForm)) {
    if (s.wait && !isHidden(errorDisplay)) {
      s.wait = false;
      console.log(errorDisplay.textContent);
      errorDisplay.style.display = "none";
    }
    if (!s.wait) {
      if (s.index >= s.keys.length) {
        console.log("Todas as chaves testadas.");
        return;
      }
      s.wait = true;
      activate(s.keys[s.index++]);
    }
  }
  setTimeout(() => checkPage(s), 500);
}

// Chama a geração de chaves e, só depois, inicia o loop de checagem
genUniqueKeys()
  .then(generatedKeys => {
    console.log(`${generatedKeys.length} chaves geradas:`);
    console.table(generatedKeys);
    checkPage({
      index: 0,
      wait: false,
      keys: generatedKeys
    });
  })
  .catch(err => console.error("Erro ao gerar chaves:", err));
