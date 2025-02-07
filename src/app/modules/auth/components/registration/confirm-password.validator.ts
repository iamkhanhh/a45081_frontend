import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cPassword')?.value;

    if (password !== confirmPassword) {
      control.get('cPassword')?.setErrors({ ConfirmPassword: true });
    }
  }

  static MatchPasswordEdit(control: AbstractControl) {
    let password = control.get('password')?.value || '';
    let confirmPassword = control.get('cPassword')?.value || '';

    if (password === confirmPassword) {
      control.get('cPassword')?.setErrors(null);
      return null;
    }

    if (confirmPassword !== '' || (confirmPassword === '' && password !== '')) {
      control.get('cPassword')?.setErrors({ ConfirmPassword: true });
    } else {
      control.get('cPassword')?.setErrors(null);
    }
  }

}
