# Dr. Junaid Akram Academic Website

A restrained, responsive academic website for Dr. Junaid Akram and the
Software and Cyber Security Analytics (SCSA) Research Lab.

The implementation reuses the proven Next.js foundation of the previous
portfolio while replacing its public identity, content, routes, imagery, and
metadata with verified academic information.

## Main sections

- Academic profile and institutional background
- Research areas and funded projects
- Selected publications
- FYP supervision and alumni outcomes
- Research team, collaborators, and events
- Contact information and academic profile links

## Authentic assets

The professor portrait, lab logo, team photographs, research figures, and
institutional logos in `public/academic/` were sourced from the supplied
Google Site. No generated portraits or synthetic academic imagery are used.

## Local development

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Set these variables before production deployment:

```text
NEXT_PUBLIC_SITE_URL=https://your-final-domain.example
MONGODB_URI=your-mongodb-connection-string
NEXT_PUBLIC_GA_ID=optional-google-analytics-id
```

The public academic pages work without MongoDB. The existing administration
and database foundation remains available for future managed publications,
projects, and alumni records.
