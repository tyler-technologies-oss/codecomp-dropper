import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'tyl-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  @Input() key: string;

  ngOnInit(): void {
  }

  get url() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://challonge.com/${this.key}/module?show_tournament_name=1`);
  }

}
