import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { PokemonCreateComponent } from './components/pokemon-create/pokemon-create.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PokemonStatRatingPipe } from './pipes/pokemon-stat-rating.pipe';
import { PokemonTypeColorDirective } from './directives/pokemon-type-color.directive';

@NgModule({
  declarations: [
    AppComponent,
    PokemonComponent,
    PokedexComponent,
    PokemonCreateComponent,
    LoginComponent,
    RegisterComponent,
    ToastsComponent,
    ConfirmDialogComponent,
    PokemonStatRatingPipe,
    PokemonTypeColorDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
