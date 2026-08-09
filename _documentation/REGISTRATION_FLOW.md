# Agri Hub — User Registration & Onboarding Specification

## 1. Overview
After a user selects their role (**Buyer**, **Supplier**, or **Both**), they are presented with the Profile Setup & Verification form to collect business and contact details.

---

## 2. Onboarding Flow Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Agri Hub Mobile App
    
    User->>App: 1. Select Role (Buyer / Supplier / Both)
    User->>App: 2. Click "Continue"
    App->>User: 3. Render Profile Registration Form
    User->>App: 4. Enter Full Name, Company Name, Mobile No, GST No
    User->>App: 5. Submit Registration
    App->>User: 6. Store Profile & Navigate to Dashboard
```

---

## 3. Form Field Specifications

| Field Name | Type | Requirement | Keyboard Type | Validation Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Full Name** | `string` | **Required** | Default | Minimum 2 characters |
| **Company / Business Name** | `string` | Optional | Default | Optional string |
| **Mobile Number** | `string` | **Required** | Phone / Numeric | 10-digit valid mobile number |
| **GST Number** | `string` | Optional | Alphanumeric (Uppercase) | 15-character GSTIN format |

---

## 4. Role-Based Field Adaptations

* **Buyer Role:** Full Name & Mobile Number required. Company Name & GST optional.
* **Supplier Role:** Full Name, Company Name, & Mobile required. GST recommended for tax invoice generation.
* **Both Role:** Full profile required.

---

## 5. Next Steps
1. Create reusable styled `AppInput` component for clean design system integration.
2. Build multi-step flow or screen transition from Role Selection -> Profile Form.
3. Validate inputs and store registration state.
