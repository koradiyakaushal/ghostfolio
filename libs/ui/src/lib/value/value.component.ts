import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { DEFAULT_DATE_FORMAT } from '@ghostfolio/common/config';
import { format, isDate } from 'date-fns';
import { isNumber } from 'lodash';

@Component({
  selector: 'gf-value',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnChanges {
  @Input() colorizeSign = false;
  @Input() currency = '';
  @Input() isCurrency = false;
  @Input() isInteger = false;
  @Input() isPercent = false;
  @Input() label = '';
  @Input() locale = '';
  @Input() position = '';
  @Input() size = '';
  @Input() value: number | string = '';

  public absoluteValue = 0;
  public formattedDate = '';
  public formattedValue = '';
  public isDate = false;
  public isNumber = false;
  public useAbsoluteValue = false;

  public constructor() {}

  public ngOnChanges() {
    if (this.value || this.value === 0) {
      if (isNumber(this.value)) {
        this.isDate = false;
        this.isNumber = true;
        this.absoluteValue = Math.abs(<number>this.value);

        if (this.colorizeSign) {
          this.useAbsoluteValue = true;
          if (this.currency || this.isCurrency) {
            try {
              this.formattedValue = this.absoluteValue.toLocaleString(
                this.locale,
                {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                }
              );
            } catch {}
          } else if (this.isPercent) {
            try {
              this.formattedValue = (this.absoluteValue * 100).toLocaleString(
                this.locale,
                {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                }
              );
            } catch {}
          }
        } else if (this.isPercent) {
          try {
            this.formattedValue = (this.value * 100).toLocaleString(
              this.locale,
              {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              }
            );
          } catch {}
        } else if (this.currency || this.isCurrency) {
          try {
            this.formattedValue = this.value?.toLocaleString(this.locale, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            });
          } catch {}
        } else if (this.isInteger) {
          try {
            this.formattedValue = this.value?.toLocaleString(this.locale, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            });
          } catch {}
        }
      } else {
        try {
          if (isDate(new Date(this.value))) {
            this.isDate = true;
            this.isNumber = false;

            this.formattedDate = format(
              new Date(<string>this.value),
              DEFAULT_DATE_FORMAT
            );
          }
        } catch {}
      }
    }
  }
}
