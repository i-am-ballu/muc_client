import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/app/core/auth/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(
    private loaderService: LoaderService
  ) { }

  public loading : Subject<boolean> = this.loaderService.isLoading;


  ngOnInit() {

  }

}
