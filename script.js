"use strict";

const gameFieldBloqueado = document.querySelector('#gameField');

gameFieldBloqueado.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // Impede a ação padrão
});
document.addEventListener("DOMContentLoaded", function () {  
  let linhas = document.getElementById("rowsSelected");
  let colunas = document.getElementById("colsSelected");
  let minas = document.getElementById("minesSelected");
  linhas = linhas == null ? (linhas = 10) : linhas.value;
  colunas = colunas == null ? (colunas = 10) : colunas.value;
  minas = minas == null ? (minas = 25) : minas.value;

  let campo = criarCampo(linhas, colunas, minas);
  let cellsClicadas = [];

  function iniciarMatrizClicadas(linhas, colunas) {
    cellsClicadas = Array.from({ length: linhas }, () =>
      Array(colunas).fill(false)
    );
  }

  function criarCampo(linhas, colunas, minas) {
    let campo = [];

    // Inicializa o campo com zeros (sem minas)
    for (let i = 0; i < linhas; i++) {
      campo[i] = [];
      for (let j = 0; j < colunas; j++) {
        campo[i][j] = 0;
      }
    }

    // Adiciona minas aleatoriamente
    let minasAdicionadas = 0;

    while (minasAdicionadas < minas) {
      let linha = Math.floor(Math.random() * linhas);
      let coluna = Math.floor(Math.random() * colunas);

      if (campo[linha][coluna] !== -1) {
        campo[linha][coluna] = -1;
        minasAdicionadas++;
      }
    }

    for (let i = 0; i < linhas; i++) {
      for (let j = 0; j < colunas; j++) {
        if (campo[i][j] === -1) {
          incrementarCelulasAdjacentes(campo, i, j, linhas, colunas);
        }
      }
    }

    return campo;
  }

  function incrementarCelulasAdjacentes(campo, linha, coluna, linhas, colunas) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const novaLinha = linha + i;
        const novaColuna = coluna + j;

        if (
          novaLinha >= 0 &&
          novaLinha < linhas &&
          novaColuna >= 0 &&
          novaColuna < colunas &&
          campo[novaLinha][novaColuna] !== -1
        ) {
          campo[novaLinha][novaColuna]++;
        }
      }
    }
  }

  function revelarCelulasAdjacentesSemBomba(
    campo,
    linha,
    coluna,
    linhas,
    colunas
  ) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const novaLinha = linha + i;
        const novaColuna = coluna + j;

        if (
          novaLinha >= 0 &&
          novaLinha < linhas &&
          novaColuna >= 0 &&
          novaColuna < colunas &&
          campo[novaLinha][novaColuna] !== -1
        ) {
          if (
            !cellsClicadas[novaLinha][novaColuna] &&
            campo[linha][coluna] != -1
          ) {
            cellsClicadas[novaLinha][novaColuna] = true;
            revelarCelula(novaLinha, novaColuna);
          }
        }
      }
    }
  }

  function mostrarCampo() {
    iniciarMatrizClicadas(linhas, colunas);
    let gameField = document.getElementById("gameField");
    let minasFaltantes = document.getElementById("status");
    for (let i = 0; i < linhas; i++) {
      const cellRow = document.createElement("div");
      cellRow.classList.add("line");
      for (let j = 0; j < colunas; j++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.row = i;
        cellElement.dataset.col = j;
        cellElement.addEventListener("click", function () {
          if (!cellsClicadas[i][j]) {
            cellsClicadas[i][j] = true;
            revelarCelula(i, j);
          }
          // assim que a função de colocar bandeira for criada, a condição desse if devera ser alterada
          if (cellsClicadas[i][j] && campo[i][j] == -1) {
            contadorMinasFaltantes();
          }
        });
        cellRow.appendChild(cellElement);
        gameField.appendChild(cellRow);
        minasFaltantes.textContent = minas;
      }
    }
  }

  function contadorMinasFaltantes() {
    minas = minas - 1;
    console.log(minas);
    const minasFaltantes = document.getElementById("status");
    minasFaltantes.textContent = minas;
  }

  function revelarCelula(linha, coluna) {
    const cellElement = document.querySelector(
      `.cell[data-row="${linha}"][data-col="${coluna}"]`
    );

    const value = document.createElement("p");
    switch (campo[linha][coluna]) {
      case -1:
        value.textContent = "💥";
        cellElement.appendChild(value);
        finishGame();
      break;
      case 0:
        cellElement.classList.add("blankSpace");
        revelarCelulasAdjacentesSemBomba(campo, linha, coluna, linhas, colunas);
        break;
      case 1:
        value.textContent = "1";
        cellElement.appendChild(value);
        break;
      case 2:
        value.textContent = "2";
        cellElement.appendChild(value);
        break;
      case 3:
        value.textContent = "3";
        cellElement.appendChild(value);
        break;
      case 4:
        value.textContent = "4";
        cellElement.appendChild(value);
        break;
      case 5:
        value.textContent = "5";
        cellElement.appendChild(value);
        break;
      case 6:
        value.textContent = "6";
        cellElement.appendChild(value);
        break;
      case 7:
        value.textContent = "7";
        cellElement.appendChild(value);
        break;
      case 8:
        value.textContent = "8";
        cellElement.appendChild(value);
        break;
    }
    campo[linha][coluna] == "-1"
      ? cellElement.classList.add("reveledCellBomb")
      : cellElement.classList.add("reveledCell");
  }

  function validarPrimeiraCelulaClicada(linhas, colunas) {
    for (let i = 0; i < linhas; i++) {
      for (let j = 0; j < colunas; j++) {
        if (cellsClicadas[i][j] == true) return true;
      }
    }
  }

  function limparCampo(){
    let cleaningGameField = document.getElementById("gameField");
    while (cleaningGameField.firstChild) {
      cleaningGameField.removeChild(cleaningGameField.firstChild);
    }
  }

  function finishGame() {
    alert("Parece que você encontrou uma bomba :( ");
    limparCampo();
    mostrarCampo();
  }
  document.getElementById("start").addEventListener("click", function () {
    limparCampo();
    mostrarCampo();
  });
  mostrarCampo();
});
