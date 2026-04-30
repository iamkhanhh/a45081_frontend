import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/modules/user/services/user-service.service';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  showCountryDropdown = false;
  submitted = false;
  isSubmitting = false; // new: prevent duplicate submissions

  countries: Country[] = [
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  ];

  selectedCountry: Country = this.countries[0];

  interests: string[] = [
    'Pipeline',
    'Analysis flow',
    'Payment Service',
    'Account Management',
    'Report Generation',
    'Other',
  ];

  socialLinks = [
    { icon: 'facebook', url: '#', label: 'Facebook' },
    { icon: 'twitter', url: '#', label: 'X (Twitter)' },
    { icon: 'linkedin', url: '#', label: 'LinkedIn' },
    { icon: 'youtube', url: '#', label: 'YouTube' },
    { icon: 'instagram', url: '#', label: 'Instagram' },
    { icon: 'tiktok', url: '#', label: 'TikTok' },
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      interest: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
  }

  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const form = this.contactForm.value;
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        interestedIn: form.interest,
        message: form.message,
        country: this.selectedCountry?.code,
      };

      this.userService.sendContact(payload).subscribe({
        next: (res) => {
          console.log('Contact sent:', res);
          this.isSubmitting = false;
          this.submitted = false;
          this.contactForm.reset();
          this.selectedCountry = this.countries[0];
        },
        error: (err) => {
          console.error('Failed to send contact:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  get f() {
    return this.contactForm.controls;
  }

  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }
}