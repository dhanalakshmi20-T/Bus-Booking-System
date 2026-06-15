import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBusesComponent } from './search-buses.component';

describe('SearchBusesComponent', () => {
  let component: SearchBusesComponent;
  let fixture: ComponentFixture<SearchBusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
