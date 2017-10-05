
(function() {
    var CONTENT = '.content';
    var CLIENTS_CONTAINER = '#clients';
    var FILTER_INPUT = '#filter';
    var SORT_INPUT = '#sort';

    var filter = '';
    var sort = false;
    var $content = document.querySelector(CONTENT);
    var reserseSortFn = function(a, b) {
      return a.localeCompare(b);
    };

    var request = new XMLHttpRequest();
    request.open('GET', './clients.json', true);
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var resp = request.responseText;
        var data = JSON.parse(resp);
        render($content);
        events(data);
        var $clients = document.querySelector(CLIENTS_CONTAINER);
        renderClients($clients, data, {
            filter: filter,
            sort: sort
        });
      }
    };
    
    request.send();

    var render = function(node, data) {
      node.innerHTML =
        '<div class="mdc-textfield mdc-textfield--box">' +
        '<input placeholder="Filter" class="mdc-textfield__input" id="filter"> ' +
        '</div>' +
        '<div class="mdc-form-field"> ' +
        '<div class="mdc-checkbox"> ' +
        '<input type="checkbox" ' +
        'id="sort" ' +
        'class="mdc-checkbox__native-control"/> ' +
        '<div class="mdc-checkbox__background"> ' +
        '<svg class="mdc-checkbox__checkmark" ' +
        'viewBox="0 0 24 24"> ' +
        '<path class="mdc-checkbox__checkmark__path" ' +
        'fill="none" ' +
        'stroke="white" ' +
        'd="M1.73,12.91 8.1,19.28 22.79,4.59"/> ' +
        '</svg> ' +
        '<div class="mdc-checkbox__mixedmark"></div> ' +
        '</div> ' +
        '</div> ' +
        '<label for="sort">Sort (by ASC order)</label> ' +
        '  </div> ' +
        '<ul class="mdc-list" id="clients"></ul>';
    };

    var renderClients = function(node, data, props) {
      var sort = props.sort;
      var filter = props.filter;
      var clients = _.cloneDeep(data.clients);
      node.innerHTML =
        "<ul>" +
        (sort ? clients.sort(reserseSortFn) : clients)
          .filter(function(client) {
            if (filter) {
              return (
                client.toLowerCase().indexOf(filter.toLowerCase().trim()) !== -1
              );
            }
            return true;
          })
          .map(function(client) {
            return '<li class="mdc-list-item">' + client + '</li>';
          })
          .join('') +
        "</ul>";
    };

    var events = function(data) {
      var $filter = document.querySelector(FILTER_INPUT);
      var $sort = document.querySelector(SORT_INPUT);
      var $clients = document.querySelector(CLIENTS_CONTAINER);
      var filterContent = function(e) {
        filter = e.target.value;
        renderClients($clients, data, {
            filter: filter,
            sort: sort
        });
      };
      var sortContent = function(e) {
        sort = !sort;
        renderClients($clients, data, {
            filter: filter,
            sort: sort
        });
      };
      $filter.addEventListener('input', filterContent);
      $sort.addEventListener('change', sortContent);
    };
  })();
