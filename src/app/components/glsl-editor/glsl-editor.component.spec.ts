import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlslEditorComponent } from './glsl-editor.component';


describe('GlslEditorComponent', () => {
  let component: GlslEditorComponent;
  let fixture: ComponentFixture<GlslEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlslEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlslEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
