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
  constructor(public juegoService: JuegoService) {}

  //Manejar clic en una columna
  handleColumnClick(column: number): void {
    if(this.juegoService.dropDisc(column)) {
      const winner = this.juegoService.checkWinner();
      if (winner) {
        alert(`${winner} ha ganado! Gaaaaa`);
        this.juegoService.registerWinner(winner as 'Red' | 'Yellow');
        this.juegoService.resetGame();
      } else {
        this.juegoService.switchPlayer();
      }
    } else {
      alert('Está llena la columna, elige otra');
    }
  }

  resetGame(): void {
    this.juegoService.resetGame();
  }

  resetScore(): void {
    this.juegoService.resetScore();
  }
}
