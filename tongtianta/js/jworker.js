var jw = {};

var delegateEventSplitter = /^(\S+)\s*(.*)$/,
    idCounter = 0,
    u = location.href,
    slice = Array.prototype.slice,
    reges = /\{(\d+?)\}/g,
    settings = {},
    escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    },
    templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

function bind(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };  
};

function template(text, data, settings) {
    var render;
    settings = $.extend({}, templateSettings, settings);
    var noMatch = /(.)^/;
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
        (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
            .replace(escaper, function(match) {
                return '\\' + escapes[match];
            });

        if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        }
        if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }
        if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }
        index = offset + match.length;
        return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + "return __p;\n";

    try {
        render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    if (data) return render(data, jw);
    var template = function(data) {
        return render.call(this, data, jw);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
};

function inherit(child, parent) {
    if (typeof parent != 'function') {
        parent = child;
        child = function() {
            if (child.prototype.constructor != child) {
                child.prototype.constructor.apply(this, arguments);
            } else {
                parent.apply(this, arguments);
            }
        };
    }

    function Ctor() {
        this.constructor = child;
    }

    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    child.superClass = parent;
    return child;
};

function baseView(o) {
    this.$el = $(o.el);
    this.renderData = o.data;
    this.template = o.template;
    this.undelegateEvents();
    this.cid = uniqueId('view');
    this.delegateEvents();
};

baseView.prototype = {
    render: function() {
        if ($.isFunction(this.beforeRender)) {
            this.beforeRender(this.renderData);
        }
        var html = template(this.template, this.renderData);
        html = typeof html === 'function' ? html() : html;
        this.$el.append(html);
        if (spinner) spinner.stop();
        if ($.isFunction(this.init)) {
            this.init(this.renderData);
        }
        return this;
    },
    delegateEvents: function(events, keepOld) {
        if (!(events || (events = this.events))) {
            return this;
        }
        if (!keepOld) {
            this.undelegateEvents();
        }
        for (var key in events) {
            var method = events[key];
            if (typeof method !== 'function') {
                method = this[events[key]];
            }

            var match = key.match(delegateEventSplitter);
            var eventName = match[1],
                selector = match[2];

            eventName += '.delegateEvents' + this.cid;
            method = bind(method, this);
            this.$el.on(eventName, (selector ? selector : null), method);
        }
        return this;
    },

    undelegateEvents: function() {
        this.$el.off('.delegateEvents' + this.cid);
        return this;
    },

};

function inheritView(proto) {
    var view = inherit(baseView);
    $.extend(view.prototype, proto);
    return view;
};

settings = {
        view: inheritView,
        template : template
    };

$.extend(jw, settings);
