import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pokemon, UpdatePokemonDto } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent implements OnInit {

  pokemon: Pokemon | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  editForm: UpdatePokemonDto = {
    name: '',
    type: '',
    level: 1,
    hp: 1
  };

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPokemon(+id);
      }
    });
  }

  loadPokemon(id: number): void {
    this.isLoading = true;
    this.pokemonService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.resetEditForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.isLoading = false;
        this.toastService.error('Failed to load Pokemon. Returning to list.');
        this.router.navigate(['/']);
      }
    });
  }

  resetEditForm(): void {
    if (this.pokemon) {
      this.editForm = {
        name: this.pokemon.name,
        type: this.pokemon.type,
        level: this.pokemon.level,
        hp: this.pokemon.hp
      };
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetEditForm();
    }
  }

  savePokemon(): void {
    if (!this.pokemon) return;

    this.pokemonService.updatePokemon(this.pokemon.id, this.editForm).subscribe({
      next: () => {
        this.loadPokemon(this.pokemon!.id);
        this.isEditing = false;
        this.toastService.success('Pokemon updated successfully!');
      },
      error: (error) => {
        console.error('Error updating pokemon:', error);
        this.toastService.error('Failed to update Pokemon.');
      }
    });
  }

  deletePokemon(): void {
    if (!this.pokemon) return;

    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Delete Pokemon';
    modalRef.componentInstance.message = `Are you sure you want to delete ${this.pokemon.name}? This action cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.confirmButtonClass = 'btn-danger';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed && this.pokemon) {
          this.pokemonService.deletePokemon(this.pokemon.id).subscribe({
            next: () => {
              this.toastService.success('Pokemon deleted successfully!');
              this.router.navigate(['/']);
            },
            error: (error) => {
              console.error('Error deleting pokemon:', error);
              this.toastService.error('Failed to delete Pokemon.');
            }
          });
        }
      },
      () => {
        // Modal dismissed, do nothing
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
