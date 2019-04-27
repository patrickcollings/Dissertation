import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedAppsComponent } from './authorized-apps.component';

describe('AuthorizedAppsComponent', () => {
  let component: AuthorizedAppsComponent;
  let fixture: ComponentFixture<AuthorizedAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
