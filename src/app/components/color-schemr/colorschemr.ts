import { Component, Inject } from '@angular/core';
import { NgStyle } from '@angular/common';

import { MDL } from '../shared/mdl';
import { Header } from '../shared/header';
import { Footer } from '../shared/footer';

import { ColorService } from '../../services/ColorService';
import { StripService } from '../../services/StripService';

import { Defaults } from '../../constants/Defaults';
import { QuoteService } from '../../services/QuoteService';

import { EscapeHtmlTagsPipe } from '../../pipes/EscapeHtmlTagsPipe';
@Component({
  selector: 'app',
  templateUrl: 'app/components/color-schemr/color-schemr.html',
  styleUrls: [
    'app/components/shared/css/style.css',
    'app/components/color-schemr/color-schemr.css'
  ],
  providers: [ ColorService, StripService, QuoteService ],
  directives: [ MDL, Header, Footer ],
  pipes: [ EscapeHtmlTagsPipe ]
})
export class ColorSchemr {
  rangeRGBColor: Array<Object> = [];
  // TS Error: Property 'isLocked' does not exist on type 'Object'.
  // http://stackoverflow.com/questions/18083389/ignore-typescript-errors-property-does-not-exist-on-value-of-type
  colorStrips: Array<any> = [];
  allStrips: any = {};
  hash: string;
  quote: Object = {};

  constructor(
    public colorService: ColorService,
    public stripService: StripService,
    public quoteService: QuoteService
    // @Inject(RouteParams) params: RouteParams
  ) {
    // this.hash = params.get('hash');
  };

  ngOnInit() {
    this.init();
  }
  init() {
    let stripsLength = Defaults.STRIP_INIT_COUNT;
    this.allStrips = {
      areLocked: false,
      isRed: true,
      isGreen: true,
      isBlue: true
    };
    this.getQuote();
    this.colorStrips = this.stripService.init(stripsLength);
    // console.log(this.colorStrips);
  };

  updateStripSettings () {
    this.stripService.updateColor();
    this.getQuote();
  };

  eventHandler (ev) {
    // console.log(ev, ev.keyCode, ev.keyIdentifier);
    if (ev.keyCode === 32) {
      this.updateStripSettings();
    } else if ((ev.keyCode >= 49 && ev.keyCode <= 57)) {
      this.stripService.updateColorByIndex(ev.keyCode - 49);
    } else if ((ev.keyCode >= 97 && ev.keyCode <= 105)) {
      this.stripService.updateColorByIndex(ev.keyCode - 97);
    } else if ((ev.keyCode === 48) || (ev.keyCode === 96)) {
      this.stripService.updateColorByIndex(9);
    }
  };
  onStripClick (ev, index, strip) {
    strip.isLocked = !strip.isLocked;
  };
  addStrip (ev, isInFront) {
    if (this.colorStrips && this.colorStrips.length >= 10) {
        // TODO: show snackbar, notifying user
        return;
    }
    this.colorStrips = this.stripService.addStrip(isInFront);
  };

  removeStrip (ev, index, strip) {
    ev.preventDefault();
    this.colorStrips.splice(index, 1);
  };

  onOpacityChange(ev, index, strip) {
    ev.preventDefault();
    ev.stopPropagation();
    this.stripService.updateOpacity(strip, index);
  };

  getQuote() {
    this.quoteService.getQuote().subscribe((quote) => {
      this.quote = quote;
    });
  };

  toggleStripsLock () {
    this.allStrips.areLocked = !this.allStrips.areLocked;
    for (let i = 0; i < this.colorStrips.length; i++) {
      this.colorStrips[i].isLocked = this.allStrips.areLocked;
    }
  };

  toggleStripsRGBComponents () {
    for (let i = 0; i < this.colorStrips.length; i++) {
      this.colorStrips[i].isRed = this.allStrips.isRed;
      this.colorStrips[i].isGreen = this.allStrips.isGreen;
      this.colorStrips[i].isBlue = this.allStrips.isBlue;
    }
  }
}
