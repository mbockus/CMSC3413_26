import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePokemonDto, PokemonTypeModel } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pokemon-create',
  templateUrl: './pokemon-create.component.html',
  styleUrl: './pokemon-create.component.css'
})
export class PokemonCreateComponent implements OnInit {

  createForm!: FormGroup;
  isSubmitting: boolean = false;
  types: string[] = [];
  currentType: string = '';

  constructor(
    private fb: FormBuilder,
    private pokemonService: PokemonService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      hp: [50, [Validators.required, Validators.min(1)]]
    });
  }

  addType(): void {
    if (this.currentType.trim() && !this.types.includes(this.currentType.trim())) {
      this.types.push(this.currentType.trim());
      this.currentType = '';
    }
  }

  removeType(index: number): void {
    this.types.splice(index, 1);
  }

  createPokemon(): void {
    if (this.createForm.invalid || this.types.length === 0) {
      this.createForm.markAllAsTouched();
      if (this.types.length === 0) {
        this.toastService.error('Please add at least one type.');
      }
      return;
    }

    this.isSubmitting = true;
    const pokemonData: CreatePokemonDto = {
      ...this.createForm.value,
      types: this.types.map((typeName, index) => ({
        id: 0,
        name: typeName,
        pokemonId: 0
      }))
    };

    this.pokemonService.createPokemon(pokemonData).subscribe({
      next: (pokemon) => {
        this.toastService.success(`${pokemon.name} created successfully!`);
        this.router.navigate(['/pokemon', pokemon.id]);
      },
      error: (error) => {
        console.error('Error creating pokemon:', error);
        this.toastService.error('Failed to create Pokemon. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
