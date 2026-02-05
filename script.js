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
      fimDeJogo();
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

// Inicia o jogo
function iniciarJogo() {
  pontuacao = 0;
  velocidadeBase = 1;
  jogoAtivo = true;
  pontuacaoEl.textContent = 'Pontuação: 0';
  pontuacaoEl.style.display = 'block';
  telaInicial.style.display = 'none';
  telaFim.style.display = 'none';
  intervaloBaloes = setInterval(criarBalao, 1000);
}

// Finaliza o jogo
function fimDeJogo() {
  jogoAtivo = false;
  clearInterval(intervaloBaloes);
  document.querySelectorAll('.balao').forEach(b => b.remove());
  telaFim.style.display = 'block';
  resultado.textContent = `Você estourou ${pontuacao} balões!`;
  pontuacaoEl.style.display = 'none';
}

// Botões
document.getElementById('btn-jogar').addEventListener('click', iniciarJogo);
document.getElementById('btn-reiniciar').addEventListener('click', iniciarJogo);