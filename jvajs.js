(function () {
  "use strict";
  var jQueryPlugin = (window.jQueryPlugin = function (ident, func) {
    return function (arg) {
      if (this.length > 1) {
        this.each(function () {
          var $this = $(this);

          if (!$this.data(ident)) {
            $this.data(ident, func($this, arg));
          }
        });

        return this;
      } else if (this.length === 1) {
        if (!this.data(ident)) {
          this.data(ident, func(this, arg));
        }

        return this.data(ident);
      }
    };
  });
})();

(function () {
  "use strict";
  function Keywords($root) {
    const element = $root;
    const keywords = $root.first("[data-keywords]");
    const keywords_target = keywords.attr("data-keywords-target");
    function keywords_slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "+")
        .replace(/\-\-+/g, "+")
        .replace(/[\s_-]+/g, "+");
    }

    function keywords_output(text) {
      return text.toString().toLowerCase().replace(/,/g, ", ");
    }

    keywords
      .keyup(function () {
        var slug = keywords_slugify($(this).val());
        $.ajax({
          type: "post",
          url:
            "https://api.bing.com/osjson.aspx?query=" +
            slug +
            "&JsonType=callback&JsonCallback=?",
          success: function (data) {
            var output = keywords_output(data);
            $(keywords_target).text(output);
          },
          dataType: "jsonp"
        });
      })
      .keyup();
  }
  $.fn.Keywords = jQueryPlugin("Keywords", Keywords);
  $("[data-keywords]").Keywords();
})();
