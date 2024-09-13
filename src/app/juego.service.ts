import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  // 7 columnas x 6 filas
  board = signal<Array<Array<string>>>(Array(7).fill([]).map(() => Array(6).fill('')));
  currentPlayer = signal<'Red' | 'Yellow'>('Red');
  score = signal({red:0, yellow:0});

  constructor() {
    this.loadScores();
  }

  // Resetear el tablero
  resetGame(): void {
    this.board.set(Array(7).fill([]).map(() => Array(6).fill('')));
    this.currentPlayer.set('Red');
  }

  // Resetear puntajes
  resetScore(): void {
    this.score.set({red:0, yellow:0});
    localStorage.removeItem('score');
  }

  // Guardar el puntaje
  saveScore(): void {
    localStorage.setItem('score', JSON.stringify(this.score()));
  }

  // Cargar puntajes
  loadScores(): void {
    const savedScore = localStorage.getItem('score');

    // Verificamos si el valor de savedScore es nulo o undefined antes de parsear
    if (savedScore !== null && savedScore !== undefined && savedScore !== 'undefined') {
      try {
        this.score.set(JSON.parse(savedScore));  // Intentamos parsear si es válido
      } catch (e) {
        console.error("Error parsing saved score: ", e);
        // Si el parseo falla, asignamos un valor predeterminado
        this.score.set({ red: 0, yellow: 0 });
      }
    } else {
      // Si no hay nada guardado o es 'undefined', asignamos el valor inicial
      console.log("No valid score found, setting default values.");
      this.score.set({ red: 0, yellow: 0 });
    }
  }

  // Colocar ficha en columna seleccionada
  dropDisc(column:number): boolean{
    const col = this.board()[column];
    const row = col.indexOf('');
    if (row !== -1) {
      col[row] = this.currentPlayer();
      this.board.set(this.board());
      return true;
    }
    return false;  // Si está llena la columna
  }

  //Alternar jugadores después de un turno
  switchPlayer(): void {
    this.currentPlayer.set(this.currentPlayer() === 'Red' ? 'Yellow' : 'Red');
  }

  //Verificar si un jugador ganó
  checkWinner(): string | null {
    const board = this.board();  // Obtenemos el tablero actual

    // Verificar filas horizontales
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = board[col][row];
        if (cell && cell === board[col + 1][row] && cell === board[col + 2][row] && cell === board[col + 3][row]) {
          return cell;  // Retorna el color del ganador
        }
      }
    }

    // Verificar columnas verticales
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        const cell = board[col][row];
        if (cell && cell === board[col][row + 1] && cell === board[col][row + 2] && cell === board[col][row + 3]) {
          return cell;  // Retorna el color del ganador
        }
      }
    }

    // Verificar diagonales descendentes (\)
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        const cell = board[col][row];
        if (cell && cell === board[col + 1][row + 1] && cell === board[col + 2][row + 2] && cell === board[col + 3][row + 3]) {
          return cell;  // Retorna el color del ganador
        }
      }
    }

    // Verificar diagonales ascendentes (/)
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        const cell = board[col][row];
        if (cell && cell === board[col + 1][row - 1] && cell === board[col + 2][row - 2] && cell === board[col + 3][row - 3]) {
          return cell;  // Retorna el color del ganador
        }
      }
    }

    // Si no hay ganador, retornar null
    return null;
  }


  //Registrar ganador y actualizar puntaje
  registerWinner(winner: 'Red' | 'Yellow'): void {
    const newScore = { ...this.score() };  // Creamos una copia del puntaje actual

    if (winner === 'Red') {
      newScore.red++;  // Incrementar puntaje para Red
    } else if (winner === 'Yellow') {
      newScore.yellow++;  // Incrementar puntaje para Yellow
    }

    this.score.set(newScore);  // Actualizamos el puntaje
    this.saveScore();  // Guardamos en LocalStorage
  }

}
