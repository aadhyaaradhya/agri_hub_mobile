# Agri Hub — Frontend Step-by-Step Implementation Guide
*(React Native Client Scope Only)*

This document serves as your complete step-by-step guide for implementing all client-requested frontend changes in the React Native mobile application, based strictly on the finalized transcript and project specifications.

---

## 🚀 Overview of Frontend Tasks

| Step | Feature Area | Key Objective | Targeted File(s) |
| :--- | :--- | :--- | :--- |
| **Step 1** | Form Titles & Context | Dynamic `"New Inquiry"` (Buyer) vs `"New Supply"` (Supplier) titles | [AddCropListingModal.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/supplier/components/AddCropListingModal.tsx) |
| **Step 2** | Form Fields & Options | Purity tabs (`85%`, `95%`, `98%`, `99%`), `kgs`/`Tons` units, & textarea notes | [AddCropListingModal.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/supplier/components/AddCropListingModal.tsx) |
| **Step 3** | Buyer Privacy Dashboard | Aggregated **Available Supply** count summary boxes by purity category | [MarketplaceScreen.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/marketplace/screens/MarketplaceScreen.tsx) |
| **Step 4** | Request Sample Flow | Interactive **Request Sample** modal triggered by tapping purity counts | `src/features/marketplace/components/RequestSampleModal.tsx` |
| **Step 5** | Auth & Registration | Optional GST & Company fields, Google Sign-In button, persistent session | `src/features/auth/` |
| **Step 6** | UI Day Theme Palette | Update primary colors to **Yellowish-Green Day Theme** | [colors.ts](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/theme/colors.ts) |

---

## 📌 Step 1: Role-Based Requirement Form Modal & Header Titles

### Goal
Switch the form header title and submit button text dynamically based on whether the logged-in user is a **Buyer** or a **Supplier**.

* **Buyer Role:** Form Title = `"New Inquiry"`, Submit Button = `"Submit Inquiry"`
* **Supplier Role:** Form Title = `"New Supply"`, Submit Button = `"Submit Supply"`

### Action Steps:
1. Open [AddCropListingModal.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/supplier/components/AddCropListingModal.tsx).
2. Add a `userRole` prop to `AddCropListingModalProps`:
   ```typescript
   interface AddCropListingModalProps {
     visible: boolean;
     onClose: () => void;
     onAddProduce: (newProduce: ProduceItem) => void;
     userRole?: 'buyer' | 'supplier'; // default to 'supplier'
   }
   ```
3. Update the header title text dynamically:
   ```tsx
   <AppText variant="subtitle" weight="bold">
     {userRole === 'buyer' ? 'New Inquiry' : 'New Supply'}
   </AppText>
   ```
4. Update the submit button text dynamically:
   ```tsx
   <Button
     title={userRole === 'buyer' ? 'Submit Inquiry' : 'Submit Supply'}
     variant="primary"
     size="lg"
     style={{ flex: 1.6 }}
     rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
     onPress={handleSubmit}
   />
   ```

---

## 📌 Step 2: Form Fields & Options Cleanup (Psyllium Focus)

### Goal
Ensure the requirement form strictly displays only relevant Psyllium Husk fields and options:

* **Product Header:** Read-only banner `PRODUCT: Psyllium Husk (Isabgol)`
* **Purity Categories (Small Tabs):** `85% Pure`, `95% Pure`, `98% Pure`, `99% Pure`, and `✏️ Custom Grade`.
* **Price Input:** `Price per Unit (₹)`
* **Weight Unit Chips:** Restricted strictly to **`kgs`** and **`Tons`**.
* **Order / Supply Quantity Input:** `Order Quantity` or `Supply Quantity`.
* **Additional Notes Field:** Add a multiline text area for optional order details / specifications.
* **Purged Fields:** Confirm `Harvest Location`, `Certified Organic Crop`, and generic product dropdowns remain completely removed.

### Action Steps:
1. In [AddCropListingModal.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/supplier/components/AddCropListingModal.tsx), verify `unitOptions` is `['Kg', 'Ton']` rendering `'kgs'` and `'Tons'`.
2. Add an optional `notes` state field:
   ```typescript
   const [notes, setNotes] = useState('');
   ```
3. Add a textarea input before the sticky footer:
   ```tsx
   <AppInput
     label="Additional Specifications / Notes (Optional)"
     placeholder="Enter any specific requirements, packaging, or remarks..."
     multiline
     numberOfLines={3}
     value={notes}
     onChangeText={setNotes}
     leftIcon={<FileText size={18} color={colors.primary} />}
   />
   ```

---

## 📌 Step 3: Buyer Dashboard — Aggregated Available Supply Grid & Privacy

### Goal
On the Buyer Dashboard/Home screen ([MarketplaceScreen.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/marketplace/screens/MarketplaceScreen.tsx)), display a top **Available Supply Summary** card showing total market availability count across purity grades without revealing supplier identity or prices.

### Key Privacy Rules:
- Display total quantity available per category (e.g. `95% Purity — 10 Tons`).
- **DO NOT** display supplier business names, phone numbers, or price tags in this aggregated summary box.

### Action Steps:
1. Open [MarketplaceScreen.tsx](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/features/marketplace/screens/MarketplaceScreen.tsx).
2. Create an **Available Supply Card Component**:
   ```tsx
   <View style={styles.availableSupplyCard}>
     <View style={styles.cardHeader}>
       <AppText variant="subtitle" weight="bold">
         Market Available Supply Summary
       </AppText>
       <AppText variant="caption" color={colors.textSecondary}>
         Tap any category to request a product sample
       </AppText>
     </View>

     <View style={styles.supplyGrid}>
       <TouchableOpacity style={styles.supplyBox} onPress={() => handleOpenSampleModal('85%')}>
         <AppText weight="bold">85% Purity</AppText>
         <AppText variant="subtitle" color={colors.primary} weight="bold">15 Tons</AppText>
         <AppText variant="caption" color={colors.textSecondary}>Available</AppText>
       </TouchableOpacity>

       <TouchableOpacity style={styles.supplyBox} onPress={() => handleOpenSampleModal('95%')}>
         <AppText weight="bold">95% Purity</AppText>
         <AppText variant="subtitle" color={colors.primary} weight="bold">10 Tons</AppText>
         <AppText variant="caption" color={colors.textSecondary}>Available</AppText>
       </TouchableOpacity>

       <TouchableOpacity style={styles.supplyBox} onPress={() => handleOpenSampleModal('98%')}>
         <AppText weight="bold">98% Purity</AppText>
         <AppText variant="subtitle" color={colors.primary} weight="bold">25 Tons</AppText>
         <AppText variant="caption" color={colors.textSecondary}>Available</AppText>
       </TouchableOpacity>

       <TouchableOpacity style={styles.supplyBox} onPress={() => handleOpenSampleModal('99%')}>
         <AppText weight="bold">99% Purity</AppText>
         <AppText variant="subtitle" color={colors.primary} weight="bold">8 Tons</AppText>
         <AppText variant="caption" color={colors.textSecondary}>Available</AppText>
       </TouchableOpacity>
     </View>
   </View>
   ```

---

## 📌 Step 4: Interactive "Request Sample" Workflow

### Goal
When a buyer taps any purity category card in the **Available Supply** section, open a **Request Sample Modal**.

### Required Input Fields:
1. Selected Grade Indicator (e.g. `Psyllium Husk 95% Pure`)
2. **Company Name** (Required for sample request)
3. **GST Registration Number** (Required for sample request verification)
4. **Sample Quantity Requested** (e.g., `1 Kg` / `5 Kg`)
5. **Delivery Address & Contact Number**
6. `"Submit Sample Request"` action button.

### Action Steps:
1. Create a new component `src/features/marketplace/components/RequestSampleModal.tsx`.
2. Connect `RequestSampleModal` to state in `MarketplaceScreen.tsx`.
3. Handle submission with a clean confirmation toast/banner: `"Your sample request for 95% Purity has been submitted successfully!"`.

---

## 📌 Step 5: Authentication & Registration Screen Enhancements

### Goal
Enhance onboarding usability and reduce registration drop-off:

* **Optional Fields:** Make **Company Name** and **GST Registration Number** explicitly labeled as `(Optional)` during initial signup.
* **Google Auth Option:** Include a prominent `"Continue with Google"` button on Login / Signup screens.
* **Persistent Sessions:** Store authentication tokens in persistent local storage so users remain logged in across app launches.

### Action Steps:
1. Open your registration step files in `src/features/auth/`.
2. Ensure labels display `Company Name (Optional)` and `GST Number (Optional)`.
3. Add Google Sign-In button UI:
   ```tsx
   <Button
     title="Continue with Google"
     variant="outline"
     leftIcon={<GoogleIcon />} // or custom SVG / Lucide icon
     onPress={handleGoogleLogin}
   />
   ```

---

## 📌 Step 6: Day Theme UI Color Palette Update (Yellowish-Green)

### Goal
Transition theme colors from deep forest green to a warm, vibrant **Yellowish-Green Day Theme** palette.

### Action Steps:
1. Open [colors.ts](file:///c:/Users/saumy/Desktop/Personal%20Github%20Projects/aadhyaaradhya/react_native_apps/agro_react_native/src/theme/colors.ts).
2. Update the color tokens for `light` theme:
   ```typescript
   export const colors = {
     light: {
       background: '#F7FBF4',      // Soft yellowish-green off-white
       surface: '#FFFFFF',
       surfaceSecondary: '#EDF5E8', // Light lime tint
       card: '#FFFFFF',
       border: '#DCEDC8',          // Soft yellowish-green border
       primary: '#558B2F',         // Vibrant Yellowish-Green (Olive/Lime primary)
       primaryLight: '#E8F5E9',    // Very soft light green tint
       primaryDark: '#33691E',     // Rich deep olive green
       secondary: '#8BC34A',       // Bright Yellowish Lime Green
       accent: '#9E9D24',          // Warm Lime-Yellow Accent
       text: '#1B2E15',            // Deep natural green-black text
       textSecondary: '#4E6544',   // Muted slate green text
       textMuted: '#8C9E82',
       success: '#2E7D32',
       warning: '#F57F17',
       error: '#D32F2F',
       info: '#0288D1',
       shadow: 'rgba(27, 46, 21, 0.08)',
     },
     dark: {
       // ... updated dark theme pairing ...
     }
   };
   ```
3. Run `npm run type-check` to confirm zero color token breakage across the app.

---

## ✅ Summary of Verification & Execution Order

Follow this exact sequence to complete the frontend changes smoothly:

1. **Step 1:** Add role-based header title & submit button switching (`New Inquiry` / `New Supply`).
2. **Step 2:** Verify purity tabs, weight unit chips (`kgs`/`Tons`), and notes text area.
3. **Step 3:** Implement Available Supply Market Summary card on Buyer Dashboard.
4. **Step 4:** Build Request Sample modal workflow.
5. **Step 5:** Update signup optional fields & Google login button.
6. **Step 6:** Apply Yellowish-Green Day Theme color palette update in `colors.ts`.
7. **Final Check:** Run `npm run type-check` to ensure 0 TypeScript compilation errors.
