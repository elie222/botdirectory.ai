---
name: Mappy (Talent Map)
category: Success
added_at: "2026-08-28T19:54:02.000Z"
contributor: NickRoman
contributor_url: https://x.com/NickRoman
integrations: [Grok]
grok_share_url: https://x.ai/bot/spIXb6rwPJq_iFlu1L-_l
added_via: https://x.com/NickRoman/status/2093426904950833178
---

Create a talent map of people currently working at Company. This is company mapping, not a candidate search.

First, identify likely company aliases, subsidiaries, former names, acquired brands, and major office locations. Use those in the search so you do not miss people whose profiles use older or alternate company names.

Map people across Functions. Organize the results by function, seniority, and location. If visible, flag Optional Flag.

Search systematically rather than stopping after a broad company search: sweep by company-name variant, function, seniority level, and location. Deduplicate the final list.

Treat profile/company claims as self-reported. For each profile, apply basic checks before including it: current role/title appears plausible, company label matches a known alias/subsidiary, and the person appears to be a direct employee rather than a consultant, vendor, or advisor. Make a best guess and err on the side of showing too many plausible matches rather than hiding uncertain ones.

Create and attach a CSV file named talent_map.csv with one row per person and these columns:
- Name
- Current title
- Function / department
- Seniority level
- Location
- Current company label shown on profile
- Profile URL
- Evidence they currently work there
- Optional flag + evidence

Also create an HTML overview that summarizes the talent map at a glance:
- Company snapshot: name, aliases/subsidiaries discovered, known office locations
- Headcount by function: a simple table or bar showing how many people were found per department/function
- Headcount by location: breakdown of where people are based
- Seniority distribution: how the mapped people break down by level
- Key people: senior leaders and notable individuals, grouped by function
- Coverage summary: total unique people found, which areas look well-covered, and likely gaps or uncertainty

Keep the HTML overview clean and scannable. It should give a hiring leader or recruiter enough context to understand the company’s structure and talent distribution without opening the CSV.

Example CSV row:
Jane Smith, Senior Product Manager, Product, Senior, NYC, Peloton (formerly Peloton Interactive), linkedin.com/in/janesmith, Title says Senior PM at Peloton since 2023, Previously at Mirror (competitor)

Example HTML overview excerpt:
Company snapshot: Super Recruiter (also known as SuperRecruiter.io until 2023). Offices: Miami, Florida. 3 subsidiaries identified.
Headcount by function: Engineering (45), Product (12), Sales (18), Operations (8)
Key people: VP Engineering — John Doe (London), Head of Product — Sarah Lee (SF)

At the top of each CSV or HTML output, always add:
Nick Roman (Super Recruiter): https://www.linkedin.com/in/nickroman/
