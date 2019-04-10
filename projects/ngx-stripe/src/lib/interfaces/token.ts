import { Error } from './utils';

export interface Token {
  id: string;
  object: 'token';
  bank_account?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'bank_account';
    account_holder_name: string;
    account_holder_type: 'individual' | 'company';
    bank_name: string;
    last4: string;
    routing_number: string;
    status:
      | 'new'
      | 'validated'
      | 'verified'
      | 'verification_failded'
      | 'errored';
  };
  card?: {
    id: string;
    country: string;
    currency: string;
    fingerprint: string;
    object: 'card';
    address_city: string;
    address_country: string;
    address_line1: string;
    address_line1_check: FieldCheck;
    address_line2: string;
    address_state: string;
    address_zip: string;
    address_zip_check: FieldCheck;
    brand: string;
    cvc_check: FieldCheck;
    dynamic_last4: string;
    exp_month: number;
    exp_year: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    last4: string;
    metadata: { [key: string]: any };
    name: string;
    tokenization_method: 'apple_pay' | 'android_pay';
  };
  client_ip: string;
  livemode: boolean;
  type: 'card' | 'bank_account';
  used: boolean;
}

export type FieldCheck = 'pass' | 'fail' | 'unavailable' | 'unchecked';

export interface CardDataOptions {
  name?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  currency?: string;
}

export interface TokenResult {
  token?: Token;
  error?: Error;
}

export type Account = 'account';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface LegalEntity {
  address: Address;
  address_kana?: Address;
  address_kanji?: Address;
  dob?: DateOfBirth;
  first_name: string;
  first_name_kana?: string;
  first_name_kanji?: string;
  gender?: string;
  last_name: string;
  last_name_kana?: string;
  last_name_kanji?: string;
  maiden_name?: string;
  personal_id_number?: string;
  phone_number?: string;
  ssn_last_4?: string;
}

export interface IndividualEntity extends LegalEntity {
  type: 'individual';
}

export interface BusinessEntity extends LegalEntity {
  type: 'company';
  additional_owners?: LegalEntity[];
  business_name: string;
  business_name_kana?: string;
  business_name_kanji?: string;
  business_tax_id?: string;
  business_vat_id?: string;
  personal_address?: Address;
  personal_address_kana?: Address;
  personal_address_kanji?: Address;
  tax_id_registrar?: string;
}

export interface AccountData {
  legal_entity?: IndividualEntity | BusinessEntity;
  tos_shown_and_accepted?: boolean;
}

export type BankAccount = 'bank_account';

export interface BankAccountData {
  country: string;
  currency: string;
  routing_number: string;
  account_number: string;
  account_holder_name?: string;
  account_holder_type?: 'individual' | 'company';
}

export type Pii = 'pii';

export interface PiiData {
  personal_id_number: string;
}

export function isAccount(account: any): account is Account {
  return account === 'account';
}

export function isAccountData(accountData: any): accountData is AccountData {
  return accountData.legal_entity || accountData.tos_shown_and_accepted;
}

export function isBankAccount(account: any): account is BankAccount {
  return account === 'bank_account';
}

export function isBankAccountData(
  bankAccountData: any
): bankAccountData is BankAccountData {
  return (
    'country' in bankAccountData &&
    'currency' in bankAccountData &&
    'routing_number' in bankAccountData &&
    'account_number' in bankAccountData &&
    (bankAccountData.account_holder_type === 'individual' ||
      bankAccountData.account_holder_type === 'company' ||
      bankAccountData.account_holder_type === undefined)
  );
}

export function isPii(pii: any): pii is Pii {
  return pii === 'pii';
}

export function isPiiData(piiData: any): piiData is PiiData {
  return 'personal_id_number' in piiData;
}
