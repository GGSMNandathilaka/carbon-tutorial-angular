import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

    @Input() heading;
    @Input() content;
    splitHeading;

    constructor() {
    }

    ngOnInit(): void {
        // create the split title to get bold styles
        this.splitHeading = this.createArrayFromPhrase(this.heading);
    }

    createArrayFromPhrase(phrase) {
        const splitPhrase = phrase.split(" ");
        const thirdWord = splitPhrase.pop();
        return [splitPhrase.join(" "), thirdWord];
    }
}
