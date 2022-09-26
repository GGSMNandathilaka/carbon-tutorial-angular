import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InfoCardComponent} from './info-card/info-card.component';
import {InfoSectionComponent} from './info-section/info-section.component';
import {GridModule, IconModule, IconService} from "carbon-components-angular";
import PersonFavorite32 from "@carbon/icons/lib/person--favorite/32";
import Globe32 from "@carbon/icons/lib/globe/32";
import Application32 from "@carbon/icons/lib/application/32";


@NgModule({
    declarations: [
        InfoCardComponent,
        InfoSectionComponent
    ],
    exports: [
        InfoSectionComponent
    ],
    imports: [
        CommonModule,
        GridModule,
        IconModule
    ]
})
export class InfoModule {
    constructor(private iconService: IconService) {
        this.iconService.registerAll([PersonFavorite32, Globe32, Application32]);
    }
}
