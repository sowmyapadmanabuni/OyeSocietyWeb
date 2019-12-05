import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlocksComponent } from './add-blocks.component';

describe('AddBlocksComponent', () => {
  let component: AddBlocksComponent;
  let fixture: ComponentFixture<AddBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
