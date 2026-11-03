const my_responsive = {
  reAdjust() {
    document.querySelectorAll('.responsive-tabs').forEach(function(element) {
      element.querySelectorAll('.nav-tabs').forEach(function(navTabs) {
        navTabs.classList.add('flex-nowrap', 'overflow-x-auto', 'text-nowrap');

        // İlk çalıştırmada, orijinal olarak justify-content-center'a sahip mi diye işaretle
        if (!navTabs.dataset.centeredTabsChecked) {
          navTabs.dataset.wasCentered = navTabs.classList.contains('justify-content-center') ? 'true' : 'false';
          navTabs.dataset.centeredTabsChecked = 'true';
        }

        if (navTabs.dataset.wasCentered === 'true') {
          let isOverflowing = navTabs.scrollWidth > navTabs.clientWidth;
          navTabs.classList.toggle('justify-content-center', !isOverflowing);
        }
      });

      element.querySelectorAll('.nav-item').forEach(function(navItem) {
        navItem.classList.add('flex-shrink-0');
      });
    });
  },
  tables(element = 'body', width = 768) {
    let container = document.querySelector(element);

    if (container && container.clientWidth < width) {
      document.querySelectorAll('.data-responsive-table').forEach(function(tableName) {
        let columnAllLeft = tableName.classList.contains('column-all-left');
        let headRow = tableName.querySelector('thead tr');
        let headCells = headRow ? headRow.children : [];

        tableName.querySelectorAll('tbody th, tbody td, tfoot td').forEach(function(columnName) {
          let colIndex = columnName.cellIndex;
          let headCell = headCells[colIndex];

          // Boş hücreyi (başlığıyla birlikte) mobilde gizle
          let isEmpty = columnName.textContent.trim() === '' && !columnName.querySelector('img, input, select, textarea, button, a, i, svg');

          columnName.classList.toggle('d-none', isEmpty);
          columnName.classList.toggle('d-md-table-cell', isEmpty);

          // Sütun bazında hizalama: thead th üzerinde data-mobile-align="start|center|end"
          let align = headCell ? headCell.dataset.mobileAlign : '';

          if (align) {
            columnName.classList.remove('text-start', 'text-center', 'text-end');
            columnName.classList.add('text-' + align);
          } else if (columnAllLeft && columnName.classList.contains('text-end')) {
            columnName.classList.remove('text-end');
            columnName.classList.add('text-start');
          }

          // Required for long text.
          columnName.classList.remove('text-nowrap');

          // Hide column title with image
          if (!columnName.classList.contains('title-hidden')) {
            let title = headCell ? headCell.textContent.trim() : '';

            if (title) {
              columnName.setAttribute('data-responsive-heading', title + ':');
            } else {
              columnName.removeAttribute('data-responsive-heading');
            }
          }
        });
      });
    }
  }
};

let resizeTimer;

window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    my_responsive.reAdjust();
  }, 100);
});

function initResponsive() {
  // Init Tabs
  my_responsive.reAdjust();

  // Init Tables
  my_responsive.tables();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResponsive);
} else {
  initResponsive();
}

// AJAX ile yenilenen tablolar için, yükleme tamamlandıktan sonra:
// my_responsive.tables();