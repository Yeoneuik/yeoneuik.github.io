# Static work pages

`assets/data/works.json` is the source of truth for the works index, individual work pages, and image sitemap.

Each work needs a unique `slug` containing lowercase ASCII letters, numbers, and hyphens. Its canonical URL is `/works/<slug>/`. The legacy URL `/works/work-detail.html?id=<work-id>` remains available for old portfolio links, but is marked `noindex` and points search engines toward the static URL after loading the work data.

After editing work data or media, regenerate and verify the derived files:

```bash
python3 scripts/generate_static_works.py
python3 scripts/generate_static_works.py --check
```

The generator updates:

- `works/index.html` static fallback cards
- `works/<slug>/index.html` crawlable detail pages
- `sitemap.xml` including work image entries
- `robots.txt`

Do not edit these generated sections or files directly. Change `works.json`, the template, CSS, or JavaScript and run the generator again. A site-wide design change usually belongs in `assets/css/styles.css` or `templates/work-detail.html`, so every detail page can be regenerated consistently.
