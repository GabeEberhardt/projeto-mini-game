/*
  script.js
  Lógica básica do jogo Estoura Balões.
*/

// Variáveis principais
let pontuacao = 0;
let intervaloBaloes;
let velocidadeBase = 1;
let jogoAtivo = false;
let larguraTela = window.innerWidth;

// Elementos HTML
const pontuacaoEl = document.getElementById('pontuacao');
const telaInicial = document.getElementById('tela-inicial');
const telaFim = document.getElementById('tela-fim');
const resultado = document.getElementById('resultado');

// Atualiza a largura da tela ao redimensionar
window.addEventListener('resize', () => {
  larguraTela = window.innerWidth;
});

// Cria um novo balão
function criarBalao() {
  const balao = document.createElement('div');
  balao.classList.add('balao');

  const cor = Math.random() * 360;
  balao.style.background = `hsl(${cor}, 80%, 60%)`;
  balao.style.left = Math.random() * (larguraTela - 60) + 'px';

  const corda = document.createElement('div');
  corda.classList.add('corda');
  balao.appendChild(corda);

  document.body.appendChild(balao);

  let posicao = window.innerHeight;
  let velocidade = velocidadeBase + Math.random() * 2;

  const subir = setInterval(() => {
    if (!jogoAtivo) {
      clearInterval(subir);
      balao.remove();
      return;
    }

    if (posicao < -100) {
      clearInterval(subir);
      balao.remove();
      perderVida();
    } else {
      posicao -= velocidade;
      balao.style.bottom = posicao + 'px';
    }
  }, 10);

  balao.addEventListener('click', () => {
    pontuacao++;
    pontuacaoEl.textContent = `Pontuação: ${pontuacao}`;
    clearInterval(subir);
    balao.style.opacity = '0';
    balao.style.transform = 'scale(1.3)';
    setTimeout(() => balao.remove(), 300);

    if (pontuacao % 5 === 0) {
      velocidadeBase += 0.5;
    }
  });
}

let vidas = 3;
let vidasPerdidas = 0;
const vidasEl = document.getElementById('vidas');
const coracoes = [
  document.getElementById('coracao1'),
  document.getElementById('coracao2'),
  document.getElementById('coracao3')
];

function perderVida() {
  if (!jogoAtivo) return;
  coracoes[vidasPerdidas].classList.add('partido');
  vidasPerdidas++;
  vidas--;
  if (vidas <= 0) {
    fimDeJogo();
  }
}

let intervaloNuvens;
const nuvemM1 = document.getElementById('nuvem-m1');
const nuvemM2 = document.getElementById('nuvem-m2');
let posNuvem1, posNuvem2;
const velNuvem1 = 0.4; // px por tick, esquerda → direita
const velNuvem2 = 0.9; // px por tick, direita → esquerda
const larguraNuvem2 = 130; // precisa saber a largura pra calcular o wrap corretamente

function iniciarNuvens() {
  posNuvem1 = -200;
  posNuvem2 = larguraTela + 50;
  nuvemM1.style.display = 'block';
  nuvemM2.style.display = 'block';
  nuvemM1.style.left = posNuvem1 + 'px';
  nuvemM2.style.left = posNuvem2 + 'px';

 intervaloNuvens = setInterval(() => {
  posNuvem1 += velNuvem1;
  posNuvem2 -= velNuvem2;

  if (posNuvem1 > larguraTela) posNuvem1 = -200;
  if (posNuvem2 < -larguraNuvem2) posNuvem2 = larguraTela + 50; // nome corrigido + condição corrigida

  nuvemM1.style.left = posNuvem1 + 'px';
  nuvemM2.style.left = posNuvem2 + 'px';
}, 20);
}

function pararNuvens() {
  clearInterval(intervaloNuvens);
  nuvemM1.style.display = 'none';
  nuvemM2.style.display = 'none';
}

// Inicia o jogo
function iniciarJogo() {
  pontuacao = 0;
  velocidadeBase = 1;
  jogoAtivo = true;
  vidas = 3;
  vidasPerdidas = 0;
  coracoes.forEach(c => c.classList.remove('partido'));
  vidasEl.style.display = 'flex';
  pontuacaoEl.textContent = 'Pontuação: 0';
  pontuacaoEl.style.display = 'block';
  telaInicial.style.display = 'none';
  telaFim.style.display = 'none';
  intervaloBaloes = setInterval(criarBalao, 1000);
  iniciarNuvens();
}

// Finaliza o jogo
function fimDeJogo() {
  jogoAtivo = false;
  clearInterval(intervaloBaloes);
  pararNuvens();
  document.querySelectorAll('.balao').forEach(b => b.remove());
  telaFim.style.display = 'block';
  resultado.textContent = `Você estourou ${pontuacao} balões!`;
  pontuacaoEl.style.display = 'none';
  vidasEl.style.display = 'none';
}

// Botões
function criarExplosao(x, y) {
  const cores = ['#ff5e5e', '#ffb84d', '#4dd0e1', '#81c784', '#ba68c8'];
  for (let i = 0; i < 12; i++) {
    const particula = document.createElement('div');
    particula.classList.add('particula');
    particula.style.background = cores[Math.floor(Math.random() * cores.length)];
    particula.style.left = x + 'px';
    particula.style.top = y + 'px';

    const angulo = (Math.PI * 2 * i) / 12;
    const distancia = 60 + Math.random() * 30;
    particula.style.setProperty('--dx', Math.cos(angulo) * distancia + 'px');
    particula.style.setProperty('--dy', Math.sin(angulo) * distancia + 'px');

    document.body.appendChild(particula);
    setTimeout(() => particula.remove(), 400);
  }
}

document.getElementById('btn-jogar').addEventListener('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  criarExplosao(rect.left + rect.width / 2, rect.top + rect.height / 2);
  setTimeout(iniciarJogo, 200);
});
document.getElementById('btn-reiniciar').addEventListener('click', iniciarJogo);