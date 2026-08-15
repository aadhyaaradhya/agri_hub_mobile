# Agri Hub — Add Crop Listing Specification

## 1. Overview
The **Add Crop Listing** feature enables registered **Suppliers** to list their agricultural harvest, seeds, fertilizers, or tools onto the **Agri Hub Marketplace**.

---

## 2. Form Specifications & Field Validation

| Field Name | Input Type | Requirement | Validation Rules | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Produce / Crop Name** | Text Input | Required | Min 2 characters | *Sharbati Premium Wheat* |
| **Category** | Chip Selector | Required | Must select 1 category | *Grains & Pulses 🌾* |
| **Price per Unit (₹)** | Numeric Input | Required | Positive integer | `2450` |
| **Unit Type** | Dropdown / Chips | Required | Must select unit | *Quintal*, *Kg*, *Bag*, *Day* |
| **Total Stock Available** | Numeric Input | Required | Positive integer | `250` |
| **Minimum Order Qty (MOQ)** | Text Input | Required | Text description | *10 Quintals* |

---

## 3. Form Lifecycle & State Flow

```mermaid
sequenceDiagram
    autonumber
    actor Supplier
    participant App as Supplier Dashboard
    participant Inventory as Active Inventory
    participant Feed as Buyer Marketplace
    
    Supplier->>App: 1. Tap "+ Add New Crop Listing"
    App->>Supplier: 2. Open Animated Add Crop Bottom Sheet
    Supplier->>App: 3. Fill crop details, category, price, stock
    Supplier->>App: 4. Tap "Publish Crop Listing →"
    App->>App: 5. Validate inputs (show errors if invalid)
    App->>Inventory: 6. Add new produce item to Supplier Inventory
    App->>Feed: 7. Instantly display new crop in Buyer Marketplace Feed
    App-->>Supplier: 8. Show "Listing Published Successfully!" toast
```

---

## 4. Immediate Inventory & Marketplace Sync
When a supplier clicks **Publish Crop Listing**:
1. The new item is added to the **Supplier's Active Inventory list** (`SupplierDashboardScreen`).
2. The `activeListings` stat counter increments (`12` → `13`).
3. The crop becomes searchable in the **Buyer Marketplace Feed** under its selected category!
