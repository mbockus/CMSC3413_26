import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
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
  caughtDate: NgbDateStruct | null = null;
  caughtTime: NgbTimeStruct = { hour: 12, minute: 0, second: 0 };

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

    if (!this.caughtDate) {
      this.toastService.error('Please select a date when the Pokemon was caught.');
      return;
    }

    this.isSubmitting = true;

    // Convert NgbDateStruct and NgbTimeStruct to ISO 8601 UTC string
    const caughtDateTime = new Date(
      this.caughtDate.year,
      this.caughtDate.month - 1, // JavaScript months are 0-indexed
      this.caughtDate.day,
      this.caughtTime.hour,
      this.caughtTime.minute,
      this.caughtTime.second
    );

    const pokemonData: CreatePokemonDto = {
      ...this.createForm.value,
      types: this.types.map((typeName, index) => ({
        id: 0,
        name: typeName,
        pokemonId: 0
      })),
      caughtAt: caughtDateTime.toISOString() // Send as ISO 8601 UTC string
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
