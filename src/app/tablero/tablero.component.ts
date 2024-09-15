import { Component } from '@angular/core';
import { JuegoService } from "../juego.service";
import {NgIf, NgFor, NgClass} from "@angular/common";

@Component({
  selector: 'app-tablero',
  standalone: true,
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.css',
  imports: [NgIf, NgFor, NgClass],
})
export class TableroComponent {
  ganador: string | null = null;
  showWinnerModal = false;
  gameMusic = new Audio();
  winMusic = new Audio();

  constructor(public juegoService: JuegoService) {}

  ngOnInit(): void {
    this.startGameMusic();
  }

  startGameMusic(): void {
    this.gameMusic.src = '/assets/game-music.mp3';
    this.gameMusic.loop = true;
    this.gameMusic.play().catch(error => console.error('Error al reproducir música:', error));
  }

  stopGameMusic(): void {
    this.gameMusic.pause();
    this.gameMusic.currentTime = 0;
  }

  playWinMusic(): void {
    this.winMusic.src = '/assets/win-music.mp3';
    this.winMusic.play().catch(error => console.error('Error al reproducir música de victoria:', error));
  }

  //Manejar clic en una columna
  handleColumnClick(column: number): void {
    if(this.gameMusic.paused){
      this.startGameMusic();
    }

    if(this.juegoService.dropDisc(column)) {
      const winner = this.juegoService.checkWinner();
      if (winner) {
        this.stopGameMusic();
        this.playWinMusic();

        this.ganador = winner;

        setTimeout(() => {
          this.showWinnerModal = true;
        }, 500);

        this.juegoService.registerWinner(winner as 'Red' | 'Yellow');
      } else {
        this.juegoService.switchPlayer();
      }
    } else {
      alert('Está llena la columna, elige otra');
    }
  }

  closeWinnerModal(): void {
    this.showWinnerModal = false;
    this.juegoService.resetGame();
  }

  resetGame(): void {
    this.winMusic.pause();
    this.winMusic.currentTime = 0;
    this.startGameMusic();
    this.juegoService.resetGame();
  }

  resetScore(): void {
    this.juegoService.resetScore();
  }
}
