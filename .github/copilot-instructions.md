# Copilot instructions for this repository

## Build and preview

- `bundle install`
- `bundle exec jekyll serve`
- `bundle exec jekyll build`

## Project shape

- This is a Jekyll site for a personal portfolio/blog.
- The site uses the remote theme `jekyll-theme-hydeout`; local overrides live in `_layouts/`, `_includes/`, `_sass/`, and `assets/css/main.scss`.
- `index.html` uses the `index` layout to render the front page plus paginated posts. `page`, `post`, `tags`, `category`, and `search` layouts are thin wrappers around shared includes.
- Posts live in `_posts/` and are mostly HTML-heavy Markdown/HTML pages with dated filenames.

## Conventions to keep

- Use `site.baseurl` for internal links and asset paths.
- Keep post metadata consistent with the existing pattern: `layout: post`, `excerpt_separator: <!--more-->`, categories/tags in front matter, and dated filenames.
- Sidebar navigation is generated from config and page front matter (`sidebar_home_link`, `sidebar_blog_link`, and `sidebar_link`).
- Tag and category pages are driven by Liquid lookups over `site.tags`, `site.categories`, and `site.pages`; keep those relationships intact when renaming content.
- Production-only snippets for analytics and comments are pulled in through `_includes/google-analytics.html` and `_includes/disqus.html`.
- Keep Sass changes in the theme partials under `_sass/hydeout/` and import them through `assets/css/main.scss`.
