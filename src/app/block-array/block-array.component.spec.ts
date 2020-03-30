import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockArrayComponent } from './block-array.component';

describe('BlockArrayComponent', () => {
  let component: BlockArrayComponent;
  let fixture: ComponentFixture<BlockArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
