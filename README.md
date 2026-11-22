# Wedding Website Reverse-Engineering Template

This folder is a self-contained static implementation inspired by the page structure
and visual direction of the Riga wedding design reference.

Reference:
- https://www.heyweddingday.com/designs/riga/0

## Run

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 4173 --directory temp
```

Then visit `http://localhost:4173`.

## Files

- `index.html` — invitation cover page
- `invitation.html` — main invitation and RSVP form
- `styles.css` — visual system, layout, responsive rules, motion preferences
- `cover.js` — cover-to-invitation fade transition
- `script.js` — menu and RSVP interactions
- `reverse-engineering.md` — structure and implementation notes
- `design-system/MASTER.md` — reusable design tokens and decisions

## Customize

Replace names and date on both pages, and update the story, schedule, venue details,
and links in `invitation.html`.
## Configure RSVP email

The RSVP form sends guest names, attendance responses, and optional notes through
EmailJS. It will show an error and will not send until configured.

1. Create an EmailJS account, connect an email service, and create an email template.
2. Set the template's recipients in the EmailJS dashboard to the intended addresses
   (for example, `first@example.com` and `second@example.com`). Do not accept
   recipient addresses from the form.
3. Use `{{guest_name}}`, `{{attendance}}`, and `{{notes}}` in the email template.
4. Replace the three `YOUR_EMAILJS_...` placeholders in `script.js` with the
   EmailJS public key, service ID, and template ID. Never put a private key in
   frontend code.
5. Restrict allowed origins and enable appropriate spam protection in EmailJS.
   Test the template and submit a real RSVP to verify delivery to both recipients.

Guest details are sent to EmailJS and the configured email service; review their
privacy policies before sharing the invitation.

The floral treatment is an original CSS illustration; no reference-site assets are copied.
