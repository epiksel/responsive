# Bootstrap Responsive Tabs & Tables

A small dependency-free JavaScript + CSS helper for Bootstrap 5 that improves readability on mobile devices.

- **Responsive tabs:** `.nav-tabs` become horizontally scrollable on narrow screens and stay centered when they fit.
- **Responsive tables:** tables turn into stacked "cards" on mobile, with each cell labeled by its column heading.

## Features

- Scrollable tabs with a hidden scrollbar, no wrapping
- Centered tabs are kept centered only while they fit, and fall back to left-aligned scrolling when they overflow
- Table rows rendered as stacked blocks on small screens
- Column heading shown as a label inside each cell (taken from `thead`)
- Empty cells are hidden on mobile, together with their label
- Per-column text alignment (`start`, `center`, `end`) via a data attribute
- Optional "align everything left" mode for tables
- Per-cell option to hide the label (useful for image-only cells)
- Works with tables that are reloaded via AJAX

## Requirements

- [Bootstrap 5](https://getbootstrap.com/) (utility classes such as `d-none`, `d-md-table-cell`, `text-start`, `flex-nowrap`)

## Installation

Include the CSS and JS files after Bootstrap:

```html
<link rel="stylesheet" href="responsive.css">

<script src="responsive.js"></script>
```

The script initializes itself once the DOM is ready (or immediately, if it is already loaded) by calling `my_responsive.reAdjust()` and `my_responsive.tables()`.

## Usage

### Tabs

Wrap your Bootstrap tabs in an element with the `responsive-tabs` class:

```html
<div class="responsive-tabs">
  <ul class="nav nav-tabs justify-content-center">
    <li class="nav-item"><a class="nav-link active" href="#tab-1" data-bs-toggle="tab">General</a></li>
    <li class="nav-item"><a class="nav-link" href="#tab-2" data-bs-toggle="tab">Data</a></li>
    <li class="nav-item"><a class="nav-link" href="#tab-3" data-bs-toggle="tab">Links</a></li>
  </ul>
</div>
```

If the `nav-tabs` element originally has `justify-content-center`, it is removed while the tabs overflow and restored when they fit again. The check runs on load and on window resize (debounced).

### Tables

Add the `data-responsive-table` class to a table and give it a regular `thead`:

```html
<table class="table data-responsive-table column-all-left">
  <thead>
    <tr>
      <th data-mobile-align="start">Date</th>
      <th data-mobile-align="center">Status</th>
      <th data-mobile-align="end">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>15/10/2026</td>
      <td>Completed</td>
      <td><a href="#" class="btn btn-primary">Edit</a></td>
    </tr>
  </tbody>
</table>
```

On screens narrower than 768px, each cell is prefixed with its column heading (for example `Date:`) and the `thead` is visually hidden (not removed, so it stays accessible).

## Options and classes

| Where | Class / attribute | Description |
|---|---|---|
| `table` | `data-responsive-table` | Enables the responsive table behavior. |
| `table` | `column-all-left` | Converts `text-end` cells to `text-start` on mobile. |
| `thead th` | `data-mobile-align="start\|center\|end"` | Sets the alignment of every cell in that column on mobile. Takes priority over `column-all-left`. |
| `td` / `th` | `title-hidden` | Does not show the column heading label for this cell (e.g. image cells). |
| wrapper | `responsive-tabs` | Enables the responsive tab behavior for the `.nav-tabs` inside. |

### Empty cell hiding

On mobile, a cell is considered empty when it has no text and contains none of these elements: `img`, `input`, `select`, `textarea`, `button`, `a`, `i`, `svg`.

Hiding is done per cell, not per column. If a column has a value in some rows, those rows keep showing it and only the empty cells in other rows are hidden. Empty cells get `d-none d-md-table-cell`, so they stay hidden on mobile and are restored at the `md` breakpoint (768px) and above.

## JavaScript API

```js
my_responsive.reAdjust();                 // re-check tabs
my_responsive.tables();                   // process tables (default: body, 768px)
my_responsive.tables('body', 992);        // custom container and width
```

`tables(element = 'body', width = 768)` runs only when the width of `element` (its `clientWidth`) is smaller than `width`.

### Tables loaded with AJAX

If a table is replaced after an AJAX request, call `tables()` again once the new HTML is in the DOM:

```js
fetch(url)
  .then((response) => response.text())
  .then((html) => {
    document.querySelector('#order-history').innerHTML = html;
    my_responsive.tables();
  });
```

## Notes and limitations

- `tables()` runs on page load (and when you call it), not on resize. It adds classes permanently, and the CSS media query decides what is actually visible, so rotating a device or resizing the window does not break the desktop layout.
- If you pass a `width` other than 768 to `tables()`, also adjust the CSS media query (`max-width: 767px`) and the `d-md-table-cell` class (for example `d-lg-table-cell` for 992px) so they match.
- Column headings are matched to cells by index. Tables using `colspan` or `rowspan` may get mismatched labels.
- When the last cell of a row is hidden, the row's bottom border handling (`td:last-child`) may produce a doubled line. Adjust the border CSS if this matters for your design.

## License

Choose a license for your project (for example [MIT](https://choosealicense.com/licenses/mit/)) and add a `LICENSE` file.