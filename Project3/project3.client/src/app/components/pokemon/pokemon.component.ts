import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Pokemon, UpdatePokemonDto, PokemonTypeModel } from '../../models/pokemon.model';
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
    types: [],
    level: 1,
    hp: 1
  };
  currentType: string = '';
  editCaughtDate: NgbDateStruct | null = null;
  editCaughtTime: NgbTimeStruct = { hour: 12, minute: 0, second: 0 };

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
        types: [...this.pokemon.types],
        level: this.pokemon.level,
        hp: this.pokemon.hp
      };

      // Parse the caught date/time from ISO string
      if (this.pokemon.caughtAt) {
        const caughtDateTime = new Date(this.pokemon.caughtAt);
        this.editCaughtDate = {
          year: caughtDateTime.getFullYear(),
          month: caughtDateTime.getMonth() + 1,
          day: caughtDateTime.getDate()
        };
        this.editCaughtTime = {
          hour: caughtDateTime.getHours(),
          minute: caughtDateTime.getMinutes(),
          second: caughtDateTime.getSeconds()
        };
      }
    }
  }

  addType(): void {
    if (this.currentType.trim() && !this.editForm.types.some(t => t.name === this.currentType.trim())) {
      this.editForm.types.push({
        id: 0,
        name: this.currentType.trim(),
        pokemonId: this.pokemon?.id || 0
      });
      this.currentType = '';
    }
  }

  removeType(index: number): void {
    this.editForm.types.splice(index, 1);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetEditForm();
      this.currentType = '';
    }
  }

  savePokemon(): void {
    if (!this.pokemon || this.editForm.types.length === 0) {
      if (this.editForm.types.length === 0) {
        this.toastService.error('Please add at least one type.');
      }
      return;
    }

    if (!this.editCaughtDate) {
      this.toastService.error('Please select a caught date.');
      return;
    }

    // Convert NgbDateStruct and NgbTimeStruct to ISO 8601 UTC string
    const caughtDateTime = new Date(
      this.editCaughtDate.year,
      this.editCaughtDate.month - 1,
      this.editCaughtDate.day,
      this.editCaughtTime.hour,
      this.editCaughtTime.minute,
      this.editCaughtTime.second
    );

    const updateData: UpdatePokemonDto = {
      ...this.editForm,
      caughtAt: caughtDateTime.toISOString()
    };

    this.pokemonService.updatePokemon(this.pokemon.id, updateData).subscribe({
      next: () => {
        this.loadPokemon(this.pokemon!.id);
        this.isEditing = false;
        this.currentType = '';
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
