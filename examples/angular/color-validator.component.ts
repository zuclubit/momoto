/**
 * Momoto Engine — Angular: ColorValidatorComponent
 * Uses MomotoService with reactive signals
 */
import { Component, OnInit, signal, computed, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MomotoService } from './momoto.service'

interface ValidationResult {
  ratio: number
  level: string
  passesAA: boolean
  passesAAA: boolean
  apcaLc: number
  cvd: Array<{ type: string; color: string; deltaE: number }>
}

@Component({
  selector: 'app-color-validator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="validator">
      <h2>Color Validator</h2>

      <p *ngIf="!momoto.ready()">Loading WASM engine…</p>

      <ng-container *ngIf="momoto.ready()">
        <!-- Color Pickers -->
        <div class="controls">
          <label>
            Foreground
            <div class="picker-row">
              <input type="color" [(ngModel)]="fg" (ngModelChange)="onColorChange()" />
              <input type="text"  [(ngModel)]="fg" (ngModelChange)="onColorChange()" maxlength="7" />
            </div>
          </label>
          <label>
            Background
            <div class="picker-row">
              <input type="color" [(ngModel)]="bg" (ngModelChange)="onColorChange()" />
              <input type="text"  [(ngModel)]="bg" (ngModelChange)="onColorChange()" maxlength="7" />
            </div>
          </label>
          <div class="preview" [style.background]="bg" [style.color]="fg">
            Aa — Sample Text
          </div>
        </div>

        <!-- Results -->
        <ng-container *ngIf="result()">
          <!-- WCAG -->
          <section>
            <h3>WCAG 2.1 — {{ result()!.ratio | number:'1.2-2' }}:1</h3>
            <span class="badge" [class.pass]="result()!.passesAA" [class.fail]="!result()!.passesAA">
              {{ result()!.passesAA ? '✓' : '✗' }} AA
            </span>
            <span class="badge" [class.pass]="result()!.passesAAA" [class.fail]="!result()!.passesAAA">
              {{ result()!.passesAAA ? '✓' : '✗' }} AAA
            </span>
            <span class="level">{{ result()!.level }}</span>
          </section>

          <!-- APCA -->
          <section>
            <h3>APCA-W3 — {{ result()!.apcaLc | number:'1.1-1' }} Lc</h3>
            <span class="badge" [class.pass]="result()!.apcaLc >= 75" [class.fail]="result()!.apcaLc < 75">
              {{ result()!.apcaLc >= 75 ? '✓' : '✗' }} Body (≥75 Lc)
            </span>
            <span class="badge" [class.pass]="result()!.apcaLc >= 60" [class.fail]="result()!.apcaLc < 60">
              {{ result()!.apcaLc >= 60 ? '✓' : '✗' }} Heading (≥60 Lc)
            </span>
          </section>

          <!-- CVD -->
          <section>
            <h3>CVD Simulation (Viénot 1999)</h3>
            <div class="cvd-row">
              <div class="swatch-item">
                <div class="swatch" [style.background]="fg"></div>
                <span>Original</span>
              </div>
              <div class="swatch-item" *ngFor="let sim of result()!.cvd">
                <div class="swatch" [style.background]="sim.color"></div>
                <span>{{ sim.type }}</span>
                <span class="de">ΔE {{ sim.deltaE | number:'1.1-1' }}</span>
              </div>
            </div>
          </section>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [`
    .validator  { font-family: system-ui; max-width: 600px; margin: 0 auto; padding: 24px;
                  background: #0f0f1a; color: #e8eaf6; border-radius: 16px; }
    h2          { color: #a78bfa; }
    .controls   { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
    .picker-row { display: flex; gap: 8px; align-items: center; }
    .preview    { padding: 12px 20px; border-radius: 10px; font-size: 18px; font-weight: 600; }
    section     { margin-bottom: 20px; border-top: 1px solid #1e293b; padding-top: 16px; }
    h3          { font-size: 14px; color: #c4b5fd; margin-bottom: 10px; }
    .badge      { display: inline-block; border-radius: 6px; padding: 4px 10px; font-size: 12px; margin-right: 8px; }
    .pass       { background: #166534; color: #4ade80; }
    .fail       { background: #7f1d1d; color: #f87171; }
    .level      { font-size: 13px; color: #94a3b8; }
    .cvd-row    { display: flex; gap: 16px; flex-wrap: wrap; }
    .swatch-item{ display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; color: #94a3b8; }
    .swatch     { width: 48px; height: 48px; border-radius: 8px; }
    .de         { color: #64748b; }
    input[type="text"] { width: 80px; background: #1e1e2e; border: 1px solid #334155;
                         border-radius: 6px; padding: 4px 8px; color: #e8eaf6; font-family: monospace; }
  `]
})
export class ColorValidatorComponent implements OnInit {
  fg = '#c8d4ff'
  bg = '#07070e'
  result = signal<ValidationResult | null>(null)

  constructor(public momoto: MomotoService) {
    // Subscribe to wasm$ to trigger initialization
    this.momoto.wasm$.subscribe()
  }

  ngOnInit() {
    this.momoto.wasm$.subscribe(() => this.compute())
  }

  onColorChange() { this.compute() }

  private compute() {
    if (!this.momoto.ready()) return
    const v = this.momoto.validatePair(this.fg, this.bg)
    if (!v) { this.result.set(null); return }
    this.result.set({
      ...v,
      cvd: this.momoto.cvdSimulate(this.fg),
    })
  }
}
