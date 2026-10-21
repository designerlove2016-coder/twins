# TWIN: External Provider & Dashboard Configuration Steps

To enable live phone SMS OTP and production operation, complete the following external settings in the Supabase Dashboard:

## 1. Phone Authentication & SMS Provider Setup

1. In Supabase Dashboard, navigate to **Authentication** -> **Providers** -> **Phone**.
2. Toggle **Enable Phone Provider** to **ON**.
3. Select your SMS Gateway provider:
   - **Twilio**: Provide `Twilio Account SID`, `Auth Token`, and `Message Service SID` or phone number.
   - **MessageBird**: Provide `Access Key` and `Originator`.
   - **Vonage**: Provide `API Key` and `API Secret`.
4. Set **OTP Expiry**: Set to `300 seconds` (5 minutes recommended).
5. Set **SMS Rate Limit**: Default is 30 SMS / hour per IP to prevent financial abuse.

## 2. Test Phone Numbers for Apple / Google Store Review & CI

1. In **Authentication** -> **Providers** -> **Phone**, scroll to **Test phone numbers**.
2. Add a sandbox testing number, e.g.:
   - Phone: `+966500000000`
   - Static OTP Code: `123456`
3. This allows automated end-to-end testing and app store reviewer access without consuming SMS credits.

## 3. Redirect URLs & CORS

1. Go to **Authentication** -> **URL Configuration**.
2. Add your application domain (e.g. `https://your-domain.run.app`) to **Site URL** and **Redirect URLs**.
