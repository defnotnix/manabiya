# Field Documentation - WODA & Statement Documents

## Table of Contents
1. [WODA Document Fields](#woda-document-fields)
2. [Statement Document Fields](#statement-document-fields)

---

## WODA Document Fields

### General Information
| Field | Type | Description |
|-------|------|-------------|
| `wodadoc_refno` | `string` | Document reference number |
| `wodadoc_date` | `Date \| null` | Document date |
| `spokesperson_name` | `string` | Name of spokesperson |
| `spokesperson_post` | `string` | Position/post of spokesperson |
| `spokesperson_contact` | `string` | Contact information of spokesperson |

### Relationship Verification (signature_issued_act_relationship)
| Field | Type | Description |
|-------|------|-------------|
| `signature_issued_act_relationship` | `string` | Signature/issued act for relationship verification |
| `extra_relation` | `boolean` | Flag for extra relation |
| `relation_extra_honorific` | `string` | Honorific title for extra relation |
| `relation_extra_name` | `string` | Name of extra relation |
| `relation_extra_relation` | `string` | Relationship type of extra person |

### Fiscal Year Details
| Field | Type | Description |
|-------|------|-------------|
| `fiscal_1_bs` | `string` | First fiscal year in Bikram Sambat |
| `fiscal_1_ad` | `string` | First fiscal year in Anno Domini |
| `fiscal_fullfiscal_1` | `string` | Full text of first fiscal year |
| `fiscal_2_bs` | `string` | Second fiscal year in Bikram Sambat |
| `fiscal_2_ad` | `string` | Second fiscal year in Anno Domini |
| `fiscal_fullfiscal_2` | `string` | Full text of second fiscal year |
| `fiscal_3_bs` | `string` | Third fiscal year in Bikram Sambat |
| `fiscal_3_ad` | `string` | Third fiscal year in Anno Domini |
| `fiscal_fullfiscal_3` | `string` | Full text of third fiscal year |

### Occupation & Income Verification
| Field | Type | Description |
|-------|------|-------------|
| `applicant_earning_guardian` | `string` | Earning guardian details |
| `occupations` | `Array<{name: string, income1: number, income2: number, income3: number}>` | List of occupations with income for 3 fiscal years |
| `occupation_note` | `string` | Additional notes about occupation |

### Date of Birth Verification
| Field | Type | Description |
|-------|------|-------------|
| `signature_issued_act_dob` | `string` | Signature/issued act for DOB verification |

### Income Verification
| Field | Type | Description |
|-------|------|-------------|
| `usd_rate` | `number` | USD exchange rate |
| `rate_date` | `Date \| null` | Date of exchange rate |

### Tax Clearance Certificate
| Field | Type | Description |
|-------|------|-------------|
| `tax` | `number` | Tax amount/percentage |
| `tax_clearance_issuer` | `string` | Organization issuing tax clearance |
| `signature_tax` | `string` | Signature/issued act for tax |

### Migration Certificate
| Field | Type | Description |
|-------|------|-------------|
| `initial_address` | `string` | Initial/previous address |
| `migration_date` | `Date \| null` | Date of migration |
| `signature_migration_alongwith` | `string` | Signature/issued act for migration |

### Surname Change Certificate
| Field | Type | Description |
|-------|------|-------------|
| `applicant_surname_reference` | `string` | Reference for surname change |
| `applicant_parents_surname` | `string` | Parent's surname |
| `applicant_surname` | `string` | Current surname of applicant |

### Address Change Certificate
| Field | Type | Description |
|-------|------|-------------|
| `initial_address_name` | `string` | Initial/previous address name |
| `address_name_change_date` | `Date \| null` | Date of address change |
| `address_name_change_date_bs` | `string` | Date of address change in Bikram Sambat |

### Applicant Personal Details
| Field | Type | Description |
|-------|------|-------------|
| `applicant_gender` | `string` | Gender of applicant |
| `applicant_honorific` | `string` | Honorific title (Mr., Mrs., etc.) |
| `applicant_name` | `string` | Full name of applicant |
| `applicant_permanent_address` | `string` | Permanent address of applicant |
| `applicant_dob` | `Date \| null` | Date of birth |
| `applicant_dob_bs` | `string` | Date of birth in Bikram Sambat |
| `applicant_birth_address` | `string` | Birth address |
| `applicant_citizenship` | `string` | Citizenship number/type |
| `applicant_citizenship_issuer` | `string` | Issuing authority for citizenship |
| `applicant_father_honorific` | `string` | Father's honorific title |
| `applicant_father_name` | `string` | Father's name |
| `applicant_mother_honorific` | `string` | Mother's honorific title |
| `applicant_mother_name` | `string` | Mother's name |

### Metadata
| Field | Type | Description |
|-------|------|-------------|
| `applicantName` | `string` (optional) | Applicant name (metadata) |
| `documentType` | `string` (optional) | Type of WODA document |
| `municipality` | `string` (optional) | Municipality/district name |
| `notes` | `string` (optional) | Additional notes |

---

## Statement Document Fields

### Document Configuration
| Field | Type | Description |
|-------|------|-------------|
| `bank_template` | `string` | Name/identifier of bank template |

### Account Details
| Field | Type | Description |
|-------|------|-------------|
| `statement_ref_no` | `string` | Statement reference number |
| `statement_ref_no_statement` | `string` | Alternative statement reference |
| `statement_account_no` | `string` | Bank account number |
| `statement_member_id` | `string` | Member/customer ID |
| `statement_account_holder` | `string` | Name of account holder |
| `statement_account_address` | `string` | Address of account holder |
| `statement_account_type` | `string` | Type of account (savings, current, etc.) |
| `statement_account_status` | `string` | Current status of account |

### Statement Period
| Field | Type | Description |
|-------|------|-------------|
| `statement_start_date` | `Date \| null` | Statement period start date |
| `statement_end_date` | `Date \| null` | Statement period end date |

### Interest Details
| Field | Type | Description |
|-------|------|-------------|
| `statement_interest_calculation` | `string` | Interest calculation method |
| `statement_interest` | `number` | Total interest amount |
| `statement_interest_method` | `string` | Method used for interest calculation |
| `statement_interest_post` | `string` | Posted/credited interest |

### Tax & Charges
| Field | Type | Description |
|-------|------|-------------|
| `statement_tax` | `number` | Tax amount deducted |

### Balance Information
| Field | Type | Description |
|-------|------|-------------|
| `statement_opening_balance` | `number` | Opening balance |
| `statements_opening_bal` | `number` | Alternative opening balance |
| `statement_total_balance_words` | `string` | Balance in words (local currency) |
| `statement_total_balance_words_usd` | `string` | Balance in words (USD) |

### Currency Exchange
| Field | Type | Description |
|-------|------|-------------|
| `statement_usdrate` | `number` | USD exchange rate |
| `statement_usdrate_equiv` | `number` | Equivalent USD amount |

### Representative Information
| Field | Type | Description |
|-------|------|-------------|
| `statement_spokesperson` | `string` | Name of authorized spokesperson |
| `statement_spokesperson_post` | `string` | Position of spokesperson |

### Statement Table Configuration
| Field | Type | Description |
|-------|------|-------------|
| `statements_opening_date` | `Date \| null` | Opening date for statement table |
| `statements_has_code` | `boolean` | Whether statements have transaction codes |
| `statements_has_cheque` | `boolean` | Whether statements have cheque numbers |

### Transaction Records
| Field | Type | Description |
|-------|------|-------------|
| `statements` | `Array<StatementRow>` | List of transaction records |

**StatementRow Structure:**
```typescript
{
  date: string;              // Transaction date
  description: string;       // Transaction description
  debit: number;            // Debit amount
  credit: number;           // Credit amount
  code: string;             // Transaction code
  cheque: string;           // Cheque number
  key: string;              // Unique identifier
  highlight?: boolean;      // Flag to highlight row
}
```

### Processed Statements
| Field | Type | Description |
|-------|------|-------------|
| `workedStatements` | `Array<StatementRow>` (optional) | Processed/formatted statement records |

### Summary Calculations
| Field | Type | Description |
|-------|------|-------------|
| `intrestStartIndex` | `number` | Starting index for interest calculation |
| `pastIntrestStartIndex` | `number[]` | Array of past interest start indices |
| `statement_debit_total` | `number` (optional) | Total debit amount |
| `statement_credit_total` | `number` (optional) | Total credit amount |

### Legacy Fields (for compatibility)
| Field | Type | Description |
|-------|------|-------------|
| `bank` | `string` (optional) | Bank name (legacy) |
| `accountHolderName` | `string` (optional) | Account holder name (legacy) |
| `accountNumber` | `string` (optional) | Account number (legacy) |
| `accountType` | `"savings" \| "current"` (optional) | Account type (legacy) |

---

## Usage Notes

### Date Fields
- Date fields can be `Date | null` - always check for null values before using
- Bikram Sambat (BS) date fields store date in Nepali calendar format
- Anno Domini (AD) date fields store date in Gregorian calendar format

### Array Fields
- `occupations` - Contains up to 3 fiscal years of income data
- `statements` - Contains individual transaction records for the statement period
- `workedStatements` - Contains processed statements used for template rendering

### Type Conversions
- When converting dates to strings, use `.toISOString()` or format as needed
- Numeric fields (income, balance, tax) should be properly typed as numbers
- String fields should validate for empty values before saving

### Document References
- WODA documents support 9 different document types (relationship, occupation, DOB, etc.)
- Statement documents support multiple bank templates
- Both document types maintain audit trails via DocumentContext
