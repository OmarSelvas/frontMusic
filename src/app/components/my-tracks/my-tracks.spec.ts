import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as MyTracksModule from './my-tracks';

const MyTracks: any = (MyTracksModule as any).MyTracks || (MyTracksModule as any).default || (MyTracksModule as any).MyTracksComponent;

describe('MyTracks', () => {
  let component: any;
  let fixture: ComponentFixture<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTracks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTracks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
