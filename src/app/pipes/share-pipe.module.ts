import { NgModule } from '@angular/core';
import { AmountDisplayPipe } from './amount-display.pipe';

@NgModule({
    declarations: [
        AmountDisplayPipe
    ],
    exports: [
        AmountDisplayPipe
    ]
})
export class SharePipeModule{
}
