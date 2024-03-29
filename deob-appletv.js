/*! watchespn-appletv-1.4.0 [master] 28-04-2016 6:49:46 AM */
var atvutils = {
    makeRequest: function(a, b, c, d, e) {
        if (!a) throw "loadURL requires a url argument";
        b = b || "GET", c = c || {}, d = d || "";
        var f = new XMLHttpRequest;
        f.onreadystatechange = function() {
            try {
                4 == f.readyState && (200 == f.status ? e(f.responseXML) : (console.log("makeRequest received HTTP status " + f.status + " for " + a), e(null)))
            } catch (b) {
                console.error("makeRequest caught exception while processing request for " + a + ". Aborting. Exception: " + b), f.abort(), e(null)
            }
        }, f.open(b, a, !0);
        for (var g in c) f.setRequestHeader(g, c[g]);
        return f.send(), f
    },
    makeErrorDocument: function(a, b) {
        a || (a = ""), b || (b = "");
        var c = '<?xml version="1.0" encoding="UTF-8"?>         <atv>         <body>         <dialog id="com.sample.error-dialog">         <title><![CDATA[' + a + "]]></title>         <description><![CDATA[" + b + "]]></description>         </dialog>         </body>         </atv>";
        return atv.parseXML(c)
    },
    siteUnavailableError: function() {
        return this.makeErrorDocument("WatchESPN is currently unavailable. Try again later.", "Go to watchespn.com/appletv for more information.")
    },
    loadError: function(a, b) {
        atv.loadXML(this.makeErrorDocument(a, b))
    },
    loadAndSwapError: function(a, b) {
        atv.loadAndSwapXML(this.makeErrorDocument(a, b))
    },
    loadURLInternal: function(a, b, c, d, e) {
        var f, g = this,
            h = new atv.ProxyDocument;
        h.show(), h.onCancel = function() {
            f && f.abort()
        }, f = g.makeRequest(a, b, c, d, function(b) {
            try {
                e(h, b)
            } catch (c) {
                console.error("Caught exception in for " + a + ". " + c), e(g.siteUnavailableError())
            }
        })
    },
    loadURL: function(a) {
        var b = this;
        if ("string" == typeof a) var c = a;
        else var c = a.url,
            d = a.method || null,
            e = a.headers || null,
            f = a.body || null,
            g = a.processXML || null;
        this.loadURLInternal(c, d, e, f, function(a, d) {
            "function" == typeof g && g.call(this, d);
            try {
                a.loadXML(d, function(d) {
                    d || (console.log("loadURL failed to load " + c), a.loadXML(b.siteUnavailableError()))
                })
            } catch (e) {
                console.log("loadURL caught exception while loading " + c + ". " + e), a.loadXML(b.siteUnavailableError())
            }
        })
    },
    loadAndSwapURL: function(a) {
        var b = this;
        if ("string" == typeof a) var c = a;
        else var c = a.url,
            d = a.method || null,
            e = a.headers || null,
            f = a.body || null,
            g = a.processXML || null;
        this.loadURLInternal(c, d, e, f, function(a, d) {
            "function" == typeof g && g.call(this, d);
            try {
                a.loadXML(d, function(d) {
                    d ? atv.unloadPage() : (console.log("loadAndSwapURL failed to load " + c), a.loadXML(b.siteUnavailableError(), function(a) {
                        a && atv.unloadPage()
                    }))
                })
            } catch (e) {
                console.error("loadAndSwapURL caught exception while loading " + c + ". " + e), a.loadXML(b.siteUnavailableError(), function(a) {
                    a && atv.unloadPage()
                })
            }
        })
    },
    data: function(a, b) {
        if (a && b) try {
                return atv.localStorage.setItem(a, b), b
            } catch (c) {
                console.error("Failed to store data element: " + c)
            } else if (a) try {
                return atv.localStorage.getItem(a)
            } catch (c) {
                console.error("Failed to retrieve data element: " + c)
            }
            return null
    },
    deleteData: function(a) {
        try {
            atv.localStorage.removeItem(a)
        } catch (b) {
            console.error("Failed to remove data element: " + b)
        }
    },
    createNode: function(a, b) {
        var b = b || document;
        if (a = a || {}, a.name && "" != a.name) {
            var c = b.makeElementNamed(a.name);
            return a.text && (c.textContent = a.text), a.attrs && a.attrs.forEach(function(a) {
                c.setAttribute(a.name, a.value)
            }, this), a.children && a.children.forEach(function(a) {
                c.appendChild(this.createNode(a, b))
            }, this), c
        }
    },
    validEmailAddress: function(a) {
        var b = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            c = a.search(b);
        return c > -1
    },
    softwareVersionIsAtLeast: function(a) {
        var b = atv.device.softwareVersion.split("."),
            c = a.split(".");
        if (b.length < c.length)
            for (var d = c.length - b.length, e = b.length, f = 0; d > f; f++) b[e + f] = "0";
        for (var g = 0; g < b.length; g++) {
            var h = b[g],
                i = c[g] || "0";
            if (parseInt(h) > parseInt(i)) return !0;
            if (parseInt(h) < parseInt(i)) return !1
        }
        return !0
    },
    shuffleArray: function(a) {
        var b, c, d = a.length;
        if (d)
            for (; --d;) c = Math.floor(Math.random() * (d + 1)), b = a[c], a[c] = a[d], a[d] = b;
        return a
    },
    loadTextEntry: function(a) {
        var b = new atv.TextEntry;
        b.type = a.type || "emailAddress", b.title = a.title || "", b.image = a.image || null, b.instructions = a.instructions || "", b.label = a.label || "", b.footnote = a.footnote || "", b.defaultValue = a.defaultValue || null, b.defaultToAppleID = a.defaultToAppleID || !1, b.onSubmit = a.onSubmit, b.onCancel = a.onCancel, b.show()
    },
    log: function(a, b) {
        var c = 100, //atv.sessionStorage.getItem("DEBUG_LEVEL"),
            b = b || 0;
        c >= b && console.log(a)
    },
    accessibilitySafeString: function(a) {
        var a = unescape(a);
        return a = a.replace(/&amp;/g, "and").replace(/&/g, "and").replace(/&lt;/g, "less than").replace(/\</g, "less than").replace(/&gt;/g, "greater than").replace(/\>/g, "greater than")
    }
};
atv.ProxyDocument && (atv.ProxyDocument.prototype.loadError = function(a, b) {
        var c = atvutils.makeErrorDocument(a, b);
        this.loadXML(c)
    }), atv.Document && (atv.Document.prototype.getElementById = function(a) {
        var b = this.evaluateXPath("//*[@id='" + a + "']", this);
        return b && b.length > 0 ? b[0] : void 0
    }), atv.Element && (atv.Element.prototype.getElementsByTagName = function(a) {
        return this.ownerDocument.evaluateXPath("descendant::" + a, this)
    }, atv.Element.prototype.getElementByTagName = function(a) {
        var b = this.getElementsByTagName(a);
        return b && b.length > 0 ? b[0] : void 0
    }), Array.prototype.sortAsc = function() {
        this.sort(function(a, b) {
            return a - b
        })
    }, Array.prototype.sortDesc = function() {
        this.sort(function(a, b) {
            return b - a
        })
    }, Date.lproj = {
        DAYS: {
            en: {
                full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                abbrv: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            },
            en_GB: {
                full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                abbrv: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            }
        },
        MONTHS: {
            en: {
                full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                abbrv: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            en_GB: {
                full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                abbrv: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            }
        }
    }, Date.prototype.getLocaleMonthName = function(a) {
        var b = atv.device.language,
            a = a === !0 ? "abbrv" : "full",
            c = Date.lproj.MONTHS[b] || Date.lproj.MONTHS.en;
        return c[a][this.getMonth()]
    }, Date.prototype.getLocaleDayName = function(a) {
        var b = atv.device.language,
            a = a === !0 ? "abbrv" : "full",
            c = Date.lproj.DAYS[b] || Date.lproj.DAYS.en;
        return c[a][this.getDay()]
    }, Date.prototype.nextDay = function(a) {
        var b = 864e5,
            a = a || 1;
        this.setTime(new Date(this.valueOf() + b * a))
    }, Date.prototype.prevDay = function(a) {
        var b = 864e5,
            a = a || 1;
        this.setTime(new Date(this.valueOf() - b * a))
    }, String.prototype.trim = function(a) {
        var a = a || "\\s",
            b = new RegExp("^[" + a + "]+|[" + a + "]+$", "g");
        return this.replace(b, "")
    }, String.prototype.trimLeft = function(a) {
        var a = a || "\\s",
            b = new RegExp("^[" + a + "]+", "g");
        return this.replace(b, "")
    }, String.prototype.trimRight = function(a) {
        var a = a || "\\s",
            b = new RegExp("[" + a + "]+$", "g");
        return this.replace(b, "")
    }, String.prototype.xmlEncode = function() {
        var a = unescape(this);
        return a = a.replace(/&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
    }, atvutils.Ajax = function(a) {
        return a = a || {}, this.url = a.url || !1, this.method = a.method || "GET", this.type = a.type === !1 ? !1 : !0, this.success = a.success || null, this.failure = a.failure || null, this.data = a.data || null, this.complete = a.complete || null, this.refresh = a.refresh || !1, this.url ? (this.id = Date.now(), this.createRequest(), this.req.onreadystatechange = this.stateChange, this.req.object = this, this.open(), void this.send()) : void console.error('\nAjax Object requires a url to be passed in: e.g. { "url": "some string" }\n')
    }, atvutils.Ajax.currentlyRefreshing = !1, atvutils.Ajax.activeRequests = {}, atvutils.Ajax.prototype = {
        stateChange: function() {
            var a = this.object;
            switch (this.readyState) {
                case 1:
                    "function" == typeof a.connection && a.connection(this, a);
                    break;
                case 2:
                    "function" == typeof a.received && a.received(this, a);
                    break;
                case 3:
                    "function" == typeof a.processing && a.processing(this, a);
                    break;
                case 4:
                    "200" == this.status ? "function" == typeof a.success && a.success(this, a) : "function" == typeof a.failure && a.failure(this.status, this, a), "function" == typeof a.complete && a.complete(this, a), a.refresh && (Ajax.currentlyRefreshing = !1);
                    break;
                default:
                    console.log("I don't think I should be here.")
            }
        },
        cancelRequest: function() {
            this.req.abort(), delete atvutils.Ajax.activeRequests[this.id]
        },
        cancelAllActiveRequests: function() {
            for (var a in atvutils.Ajax.activeRequests)
                if (atvutils.Ajax.activeRequests.hasOwnProperty(a)) {
                    var b = atvutils.Ajax.activeRequests[a];
                    atvutils.Ajax.prototype.isPrototypeOf(b) && b.req.abort()
                }
            atvutils.Ajax.activeRequests = {}
        },
        createRequest: function() {
            try {
                this.req = new XMLHttpRequest, atvutils.Ajax.activeRequests[this.id] = this, this.refresh && (atvutils.Ajax.currentlyRefreshing = !0)
            } catch (a) {
                alert("The request could not be created: </br>" + a), console.error("failed to create request: " + a)
            }
        },
        open: function() {
            try {
                this.req.open(this.method, this.url, this.type)
            } catch (a) {
                console.log("failed to open request: " + a)
            }
        },
        send: function() {
            var a = this.data || null;
            try {
                this.req.send(a)
            } catch (b) {
                console.log("failed to send request: " + b)
            }
        }
    },
    function(a) {
        if ("function" == typeof bootstrap) bootstrap("promise", a);
        else if ("object" == typeof exports) module.exports = a();
        else if ("function" == typeof define && define.amd) define(a);
        else if ("undefined" != typeof ses) {
            if (!ses.ok()) return;
            ses.makeQ = a
        } else Q = a()
    }(function() {
        "use strict";

        function a(a) {
            return function() {
                return V.apply(a, arguments)
            }
        }

        function b(a) {
            return a === Object(a)
        }

        function c(a) {
            return "[object StopIteration]" === ba(a) || a instanceof R
        }

        function d(a, b) {
            if (N && b.stack && "object" == typeof a && null !== a && a.stack && -1 === a.stack.indexOf(ca)) {
                for (var c = [], d = b; d; d = d.source) d.stack && c.unshift(d.stack);
                c.unshift(a.stack);
                var f = c.join("\n" + ca + "\n");
                a.stack = e(f)
            }
        }

        function e(a) {
            for (var b = a.split("\n"), c = [], d = 0; d < b.length; ++d) {
                var e = b[d];
                h(e) || f(e) || !e || c.push(e)
            }
            return c.join("\n")
        }

        function f(a) {
            return -1 !== a.indexOf("(module.js:") || -1 !== a.indexOf("(node.js:")
        }

        function g(a) {
            var b = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);
            if (b) return [b[1], Number(b[2])];
            var c = /at ([^ ]+):(\d+):(?:\d+)$/.exec(a);
            if (c) return [c[1], Number(c[2])];
            var d = /.*@(.+):(\d+)$/.exec(a);
            return d ? [d[1], Number(d[2])] : void 0
        }

        function h(a) {
            var b = g(a);
            if (!b) return !1;
            var c = b[0],
                d = b[1];
            return c === P && d >= S && ga >= d
        }

        function i() {
            if (N) try {
                throw new Error
            } catch (a) {
                var b = a.stack.split("\n"),
                    c = b[0].indexOf("@") > 0 ? b[1] : b[2],
                    d = g(c);
                if (!d) return;
                return P = d[0], d[1]
            }
        }

        function j(a, b, c) {
            return function() {
                return "undefined" != typeof console && "function" == typeof console.warn && console.warn(b + " is deprecated, use " + c + " instead.", new Error("").stack), a.apply(a, arguments)
            }
        }

        function Q(a) {
            return q(a) ? a : r(a) ? A(a) : z(a)
        }

        function k() {
            function a(a) {
                b = a, f.source = a, X(c, function(b, c) {
                    U(function() {
                        a.promiseDispatch.apply(a, c)
                    })
                }, void 0), c = void 0, d = void 0
            }
            var b, c = [],
                d = [],
                e = $(k.prototype),
                f = $(n.prototype);
            if (f.promiseDispatch = function(a, e, f) {
                    var g = W(arguments);
                    c ? (c.push(g), "when" === e && f[1] && d.push(f[1])) : U(function() {
                        b.promiseDispatch.apply(b, g)
                    })
                }, f.valueOf = function() {
                    if (c) return f;
                    var a = p(b);
                    return q(a) && (b = a), a
                }, f.inspect = function() {
                    return b ? b.inspect() : {
                        state: "pending"
                    }
                }, Q.longStackSupport && N) try {
                throw new Error
            } catch (g) {
                f.stack = g.stack.substring(g.stack.indexOf("\n") + 1)
            }
            return e.promise = f, e.resolve = function(c) {
                b || a(Q(c))
            }, e.fulfill = function(c) {
                b || a(z(c))
            }, e.reject = function(c) {
                b || a(y(c))
            }, e.notify = function(a) {
                b || X(d, function(b, c) {
                    U(function() {
                        c(a)
                    })
                }, void 0)
            }, e
        }

        function l(a) {
            if ("function" != typeof a) throw new TypeError("resolver must be a function.");
            var b = k();
            try {
                a(b.resolve, b.reject, b.notify)
            } catch (c) {
                b.reject(c)
            }
            return b.promise
        }

        function m(a) {
            return l(function(b, c) {
                for (var d = 0, e = a.length; e > d; d++) Q(a[d]).then(b, c)
            })
        }

        function n(a, b, c) {
            void 0 === b && (b = function(a) {
                return y(new Error("Promise does not support operation: " + a))
            }), void 0 === c && (c = function() {
                return {
                    state: "unknown"
                }
            });
            var d = $(n.prototype);
            if (d.promiseDispatch = function(c, e, f) {
                    var g;
                    try {
                        g = a[e] ? a[e].apply(d, f) : b.call(d, e, f)
                    } catch (h) {
                        g = y(h)
                    }
                    c && c(g)
                }, d.inspect = c, c) {
                var e = c();
                "rejected" === e.state && (d.exception = e.reason), d.valueOf = function() {
                    var a = c();
                    return "pending" === a.state || "rejected" === a.state ? d : a.value
                }
            }
            return d
        }

        function o(a, b, c, d) {
            return Q(a).then(b, c, d)
        }

        function p(a) {
            if (q(a)) {
                var b = a.inspect();
                if ("fulfilled" === b.state) return b.value
            }
            return a
        }

        function q(a) {
            return b(a) && "function" == typeof a.promiseDispatch && "function" == typeof a.inspect
        }

        function r(a) {
            return b(a) && "function" == typeof a.then
        }

        function s(a) {
            return q(a) && "pending" === a.inspect().state
        }

        function t(a) {
            return !q(a) || "fulfilled" === a.inspect().state
        }

        function u(a) {
            return q(a) && "rejected" === a.inspect().state
        }

        function v() {
            da.length = 0, ea.length = 0, fa || (fa = !0)
        }

        function w(a, b) {
            fa && (ea.push(a), da.push(b && "undefined" != typeof b.stack ? b.stack : "(no stack) " + b))
        }

        function x(a) {
            if (fa) {
                var b = Y(ea, a); - 1 !== b && (ea.splice(b, 1), da.splice(b, 1))
            }
        }

        function y(a) {
            var b = n({
                when: function(b) {
                    return b && x(this), b ? b(a) : this
                }
            }, function() {
                return this
            }, function() {
                return {
                    state: "rejected",
                    reason: a
                }
            });
            return w(b, a), b
        }

        function z(a) {
            return n({
                when: function() {
                    return a
                },
                get: function(b) {
                    return a[b]
                },
                set: function(b, c) {
                    a[b] = c
                },
                "delete": function(b) {
                    delete a[b]
                },
                post: function(b, c) {
                    return null === b || void 0 === b ? a.apply(void 0, c) : a[b].apply(a, c)
                },
                apply: function(b, c) {
                    return a.apply(b, c)
                },
                keys: function() {
                    return aa(a)
                }
            }, void 0, function() {
                return {
                    state: "fulfilled",
                    value: a
                }
            })
        }

        function A(a) {
            var b = k();
            return U(function() {
                try {
                    a.then(b.resolve, b.reject, b.notify)
                } catch (c) {
                    b.reject(c)
                }
            }), b.promise
        }

        function B(a) {
            return n({
                isDef: function() {}
            }, function(b, c) {
                return H(a, b, c)
            }, function() {
                return Q(a).inspect()
            })
        }

        function C(a, b, c) {
            return Q(a).spread(b, c)
        }

        function D(a) {
            return function() {
                function b(a, b) {
                    var g;
                    if ("undefined" == typeof StopIteration) {
                        try {
                            g = d[a](b)
                        } catch (h) {
                            return y(h)
                        }
                        return g.done ? g.value : o(g.value, e, f)
                    }
                    try {
                        g = d[a](b)
                    } catch (h) {
                        return c(h) ? h.value : y(h)
                    }
                    return o(g, e, f)
                }
                var d = a.apply(this, arguments),
                    e = b.bind(b, "next"),
                    f = b.bind(b, "throw");
                return e()
            }
        }

        function E(a) {
            Q.done(Q.async(a)())
        }

        function F(a) {
            throw new R(a)
        }

        function G(a) {
            return function() {
                return C([this, I(arguments)], function(b, c) {
                    return a.apply(b, c)
                })
            }
        }

        function H(a, b, c) {
            return Q(a).dispatch(b, c)
        }

        function I(a) {
            return o(a, function(a) {
                var b = 0,
                    c = k();
                return X(a, function(d, e, f) {
                    var g;
                    q(e) && "fulfilled" === (g = e.inspect()).state ? a[f] = g.value : (++b, o(e, function(d) {
                        a[f] = d, 0 === --b && c.resolve(a)
                    }, c.reject, function(a) {
                        c.notify({
                            index: f,
                            value: a
                        })
                    }))
                }, void 0), 0 === b && c.resolve(a), c.promise
            })
        }

        function J(a) {
            return o(a, function(a) {
                return a = Z(a, Q), o(I(Z(a, function(a) {
                    return o(a, T, T)
                })), function() {
                    return a
                })
            })
        }

        function K(a) {
            return Q(a).allSettled()
        }

        function L(a, b) {
            return Q(a).then(void 0, void 0, b)
        }

        function M(a, b) {
            return Q(a).nodeify(b)
        }
        var N = !1;
        try {
            throw new Error
        } catch (O) {
            N = !!O.stack
        }
        var P, R, S = i(),
            T = function() {},
            U = function() {
                function a() {
                    for (; b.next;) {
                        b = b.next;
                        var c = b.task;
                        b.task = void 0;
                        var e = b.domain;
                        e && (b.domain = void 0, e.enter());
                        try {
                            c()
                        } catch (g) {
                            if (f) throw e && e.exit(), atv.setTimeout(a, 0), e && e.enter(), g;
                            atv.setTimeout(function() {
                                throw g
                            }, 0)
                        }
                        e && e.exit()
                    }
                    d = !1
                }
                var b = {
                        task: void 0,
                        next: null
                    },
                    c = b,
                    d = !1,
                    e = void 0,
                    f = !1;
                if (U = function(a) {
                        c = c.next = {
                            task: a,
                            domain: f && process.domain,
                            next: null
                        }, d || (d = !0, e())
                    }, "undefined" != typeof process && process.nextTick) f = !0, e = function() {
                    process.nextTick(a)
                };
                else if ("function" == typeof setImmediate) e = "undefined" != typeof window ? setImmediate.bind(window, a) : function() {
                    setImmediate(a)
                };
                else if ("undefined" != typeof MessageChannel) {
                    var g = new MessageChannel;
                    g.port1.onmessage = function() {
                        e = h, g.port1.onmessage = a, a()
                    };
                    var h = function() {
                        g.port2.postMessage(0)
                    };
                    e = function() {
                        atv.setTimeout(a, 0), h()
                    }
                } else e = function() {
                    atv.setTimeout(a, 0)
                };
                return U
            }(),
            V = Function.call,
            W = a(Array.prototype.slice),
            X = a(Array.prototype.reduce || function(a, b) {
                var c = 0,
                    d = this.length;
                if (1 === arguments.length)
                    for (;;) {
                        if (c in this) {
                            b = this[c++];
                            break
                        }
                        if (++c >= d) throw new TypeError
                    }
                for (; d > c; c++) c in this && (b = a(b, this[c], c));
                return b
            }),
            Y = a(Array.prototype.indexOf || function(a) {
                for (var b = 0; b < this.length; b++)
                    if (this[b] === a) return b;
                return -1
            }),
            Z = a(Array.prototype.map || function(a, b) {
                var c = this,
                    d = [];
                return X(c, function(e, f, g) {
                    d.push(a.call(b, f, g, c))
                }, void 0), d
            }),
            $ = Object.create || function(a) {
                function b() {}
                return b.prototype = a, new b
            },
            _ = a(Object.prototype.hasOwnProperty),
            aa = Object.keys || function(a) {
                var b = [];
                for (var c in a) _(a, c) && b.push(c);
                return b
            },
            ba = a(Object.prototype.toString);
        R = "undefined" != typeof ReturnValue ? ReturnValue : function(a) {
            this.value = a
        };
        var ca = "From previous event:";
        Q.resolve = Q, Q.nextTick = U, Q.longStackSupport = !1, Q.defer = k, k.prototype.makeNodeResolver = function() {
            var a = this;
            return function(b, c) {
                b ? a.reject(b) : a.resolve(arguments.length > 2 ? W(arguments, 1) : c)
            }
        }, Q.Promise = l, Q.promise = l, l.race = m, l.all = I, l.reject = y, l.resolve = Q, Q.passByCopy = function(a) {
            return a
        }, n.prototype.passByCopy = function() {
            return this
        }, Q.join = function(a, b) {
            return Q(a).join(b)
        }, n.prototype.join = function(a) {
            return Q([this, a]).spread(function(a, b) {
                if (a === b) return a;
                throw new Error("Can't join: not the same: " + a + " " + b)
            })
        }, Q.race = m, n.prototype.race = function() {
            return this.then(Q.race)
        }, Q.makePromise = n, n.prototype.toString = function() {
            return "[object Promise]"
        }, n.prototype.then = function(a, b, c) {
            function e(b) {
                try {
                    return "function" == typeof a ? a(b) : b
                } catch (c) {
                    return y(c)
                }
            }

            function f(a) {
                if ("function" == typeof b) {
                    d(a, h);
                    try {
                        return b(a)
                    } catch (c) {
                        return y(c)
                    }
                }
                return y(a)
            }

            function g(a) {
                return "function" == typeof c ? c(a) : a
            }
            var h = this,
                i = k(),
                j = !1;
            return U(function() {
                h.promiseDispatch(function(a) {
                    j || (j = !0, i.resolve(e(a)))
                }, "when", [function(a) {
                    j || (j = !0, i.resolve(f(a)))
                }])
            }), h.promiseDispatch(void 0, "when", [void 0, function(a) {
                var b, c = !1;
                try {
                    b = g(a)
                } catch (d) {
                    if (c = !0, !Q.onerror) throw d;
                    Q.onerror(d)
                }
                c || i.notify(b)
            }]), i.promise
        }, Q.when = o, n.prototype.thenResolve = function(a) {
            return this.then(function() {
                return a
            })
        }, Q.thenResolve = function(a, b) {
            return Q(a).thenResolve(b)
        }, n.prototype.thenReject = function(a) {
            return this.then(function() {
                throw a
            })
        }, Q.thenReject = function(a, b) {
            return Q(a).thenReject(b)
        }, Q.nearer = p, Q.isPromise = q, Q.isPromiseAlike = r, Q.isPending = s, n.prototype.isPending = function() {
            return "pending" === this.inspect().state
        }, Q.isFulfilled = t, n.prototype.isFulfilled = function() {
            return "fulfilled" === this.inspect().state
        }, Q.isRejected = u, n.prototype.isRejected = function() {
            return "rejected" === this.inspect().state
        };
        var da = [],
            ea = [],
            fa = !0;
        Q.resetUnhandledRejections = v, Q.getUnhandledReasons = function() {
            return da.slice()
        }, Q.stopUnhandledRejectionTracking = function() {
            v(), fa = !1
        }, v(), Q.reject = y, Q.fulfill = z, Q.master = B, Q.spread = C, n.prototype.spread = function(a, b) {
            return this.all().then(function(b) {
                return a.apply(void 0, b)
            }, b)
        }, Q.async = D, Q.spawn = E, Q["return"] = F, Q.promised = G, Q.dispatch = H, n.prototype.dispatch = function(a, b) {
            var c = this,
                d = k();
            return U(function() {
                c.promiseDispatch(d.resolve, a, b)
            }), d.promise
        }, Q.get = function(a, b) {
            return Q(a).dispatch("get", [b])
        }, n.prototype.get = function(a) {
            return this.dispatch("get", [a])
        }, Q.set = function(a, b, c) {
            return Q(a).dispatch("set", [b, c])
        }, n.prototype.set = function(a, b) {
            return this.dispatch("set", [a, b])
        }, Q.del = Q["delete"] = function(a, b) {
            return Q(a).dispatch("delete", [b])
        }, n.prototype.del = n.prototype["delete"] = function(a) {
            return this.dispatch("delete", [a])
        }, Q.mapply = Q.post = function(a, b, c) {
            return Q(a).dispatch("post", [b, c])
        }, n.prototype.mapply = n.prototype.post = function(a, b) {
            return this.dispatch("post", [a, b])
        }, Q.send = Q.mcall = Q.invoke = function(a, b) {
            return Q(a).dispatch("post", [b, W(arguments, 2)])
        }, n.prototype.send = n.prototype.mcall = n.prototype.invoke = function(a) {
            return this.dispatch("post", [a, W(arguments, 1)])
        }, Q.fapply = function(a, b) {
            return Q(a).dispatch("apply", [void 0, b])
        }, n.prototype.fapply = function(a) {
            return this.dispatch("apply", [void 0, a])
        }, Q["try"] = Q.fcall = function(a) {
            return Q(a).dispatch("apply", [void 0, W(arguments, 1)])
        }, n.prototype.fcall = function() {
            return this.dispatch("apply", [void 0, W(arguments)])
        }, Q.fbind = function(a) {
            var b = Q(a),
                c = W(arguments, 1);
            return function() {
                return b.dispatch("apply", [this, c.concat(W(arguments))])
            }
        }, n.prototype.fbind = function() {
            var a = this,
                b = W(arguments);
            return function() {
                return a.dispatch("apply", [this, b.concat(W(arguments))])
            }
        }, Q.keys = function(a) {
            return Q(a).dispatch("keys", [])
        }, n.prototype.keys = function() {
            return this.dispatch("keys", [])
        }, Q.all = I, n.prototype.all = function() {
            return I(this)
        }, Q.allResolved = j(J, "allResolved", "allSettled"), n.prototype.allResolved = function() {
            return J(this)
        }, Q.allSettled = K, n.prototype.allSettled = function() {
            return this.then(function(a) {
                return I(Z(a, function(a) {
                    function b() {
                        return a.inspect()
                    }
                    return a = Q(a), a.then(b, b)
                }))
            })
        }, Q.fail = Q["catch"] = function(a, b) {
            return Q(a).then(void 0, b)
        }, n.prototype.fail = n.prototype["catch"] = function(a) {
            return this.then(void 0, a)
        }, Q.progress = L, n.prototype.progress = function(a) {
            return this.then(void 0, void 0, a)
        }, Q.fin = Q["finally"] = function(a, b) {
            return Q(a)["finally"](b)
        }, n.prototype.fin = n.prototype["finally"] = function(a) {
            return a = Q(a), this.then(function(b) {
                return a.fcall().then(function() {
                    return b
                })
            }, function(b) {
                return a.fcall().then(function() {
                    throw b
                })
            })
        }, Q.done = function(a, b, c, d) {
            return Q(a).done(b, c, d)
        }, n.prototype.done = function(a, b, c) {
            var e = function(a) {
                    U(function() {
                        if (d(a, f), !Q.onerror) throw a;
                        Q.onerror(a)
                    })
                },
                f = a || b || c ? this.then(a, b, c) : this;
            "object" == typeof process && process && process.domain && (e = process.domain.bind(e)), f.then(void 0, e)
        }, Q.timeout = function(a, b, c) {
            return Q(a).timeout(b, c)
        }, n.prototype.timeout = function(a, b) {
            var c = k(),
                d = atv.setTimeout(function() {
                    c.reject(new Error(b || "Timed out after " + a + " ms"))
                }, a);
            return this.then(function(a) {
                atv.clearTimeout(d), c.resolve(a)
            }, function(a) {
                atv.clearTimeout(d), c.reject(a)
            }, c.notify), c.promise
        }, Q.delay = function(a, b) {
            return void 0 === b && (b = a, a = void 0), Q(a).delay(b)
        }, n.prototype.delay = function(a) {
            return this.then(function(b) {
                var c = k();
                return atv.setTimeout(function() {
                    c.resolve(b)
                }, a), c.promise
            })
        }, Q.nfapply = function(a, b) {
            return Q(a).nfapply(b)
        }, n.prototype.nfapply = function(a) {
            var b = k(),
                c = W(a);
            return c.push(b.makeNodeResolver()), this.fapply(c).fail(b.reject), b.promise
        }, Q.nfcall = function(a) {
            var b = W(arguments, 1);
            return Q(a).nfapply(b)
        }, n.prototype.nfcall = function() {
            var a = W(arguments),
                b = k();
            return a.push(b.makeNodeResolver()), this.fapply(a).fail(b.reject), b.promise
        }, Q.nfbind = Q.denodeify = function(a) {
            var b = W(arguments, 1);
            return function() {
                var c = b.concat(W(arguments)),
                    d = k();
                return c.push(d.makeNodeResolver()), Q(a).fapply(c).fail(d.reject), d.promise
            }
        }, n.prototype.nfbind = n.prototype.denodeify = function() {
            var a = W(arguments);
            return a.unshift(this), Q.denodeify.apply(void 0, a)
        }, Q.nbind = function(a, b) {
            var c = W(arguments, 2);
            return function() {
                function d() {
                    return a.apply(b, arguments)
                }
                var e = c.concat(W(arguments)),
                    f = k();
                return e.push(f.makeNodeResolver()), Q(d).fapply(e).fail(f.reject), f.promise
            }
        }, n.prototype.nbind = function() {
            var a = W(arguments, 0);
            return a.unshift(this), Q.nbind.apply(void 0, a)
        }, Q.nmapply = Q.npost = function(a, b, c) {
            return Q(a).npost(b, c)
        }, n.prototype.nmapply = n.prototype.npost = function(a, b) {
            var c = W(b || []),
                d = k();
            return c.push(d.makeNodeResolver()), this.dispatch("post", [a, c]).fail(d.reject), d.promise
        }, Q.nsend = Q.nmcall = Q.ninvoke = function(a, b) {
            var c = W(arguments, 2),
                d = k();
            return c.push(d.makeNodeResolver()), Q(a).dispatch("post", [b, c]).fail(d.reject), d.promise
        }, n.prototype.nsend = n.prototype.nmcall = n.prototype.ninvoke = function(a) {
            var b = W(arguments, 1),
                c = k();
            return b.push(c.makeNodeResolver()), this.dispatch("post", [a, b]).fail(c.reject), c.promise
        }, Q.nodeify = M, n.prototype.nodeify = function(a) {
            return a ? void this.then(function(b) {
                U(function() {
                    a(null, b)
                })
            }, function(b) {
                U(function() {
                    a(b)
                })
            }) : this
        };
        var ga = i();
        return Q
    });
var CryptoJS = CryptoJS || function(a, b) {
    var c = {},
        d = c.lib = {},
        e = function() {},
        f = d.Base = {
            extend: function(a) {
                e.prototype = this;
                var b = new e;
                return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function() {
                    b.$super.init.apply(this, arguments)
                }), b.init.prototype = b, b.$super = this, b
            },
            create: function() {
                var a = this.extend();
                return a.init.apply(a, arguments), a
            },
            init: function() {},
            mixIn: function(a) {
                for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        g = d.WordArray = f.extend({
            init: function(a, c) {
                a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || i).stringify(this)
            },
            concat: function(a) {
                var b = this.words,
                    c = a.words,
                    d = this.sigBytes;
                if (a = a.sigBytes, this.clamp(), d % 4)
                    for (var e = 0; a > e; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                else if (65535 < c.length)
                    for (e = 0; a > e; e += 4) b[d + e >>> 2] = c[e >>> 2];
                else b.push.apply(b, c);
                return this.sigBytes += a, this
            },
            clamp: function() {
                var b = this.words,
                    c = this.sigBytes;
                b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4)
            },
            clone: function() {
                var a = f.clone.call(this);
                return a.words = this.words.slice(0), a
            },
            random: function(b) {
                for (var c = [], d = 0; b > d; d += 4) c.push(4294967296 * a.random() | 0);
                return new g.init(c, b)
            }
        }),
        h = c.enc = {},
        i = h.Hex = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) {
                    var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16))
                }
                return c.join("")
            },
            parse: function(a) {
                for (var b = a.length, c = [], d = 0; b > d; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                return new g.init(c, b / 2)
            }
        },
        j = h.Latin1 = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; a > d; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return c.join("")
            },
            parse: function(a) {
                for (var b = a.length, c = [], d = 0; b > d; d++) c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                return new g.init(c, b)
            }
        },
        k = h.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(j.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data")
                }
            },
            parse: function(a) {
                return j.parse(unescape(encodeURIComponent(a)))
            }
        },
        l = d.BufferedBlockAlgorithm = f.extend({
            reset: function() {
                this._data = new g.init, this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes
            },
            _process: function(b) {
                var c = this._data,
                    d = c.words,
                    e = c.sigBytes,
                    f = this.blockSize,
                    h = e / (4 * f),
                    h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                if (b = h * f, e = a.min(4 * b, e), b) {
                    for (var i = 0; b > i; i += f) this._doProcessBlock(d, i);
                    i = d.splice(0, b), c.sigBytes -= e
                }
                return new g.init(i, e)
            },
            clone: function() {
                var a = f.clone.call(this);
                return a._data = this._data.clone(), a
            },
            _minBufferSize: 0
        });
    d.Hasher = l.extend({
        cfg: f.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a), this.reset()
        },
        reset: function() {
            l.reset.call(this), this._doReset()
        },
        update: function(a) {
            return this._append(a), this._process(), this
        },
        finalize: function(a) {
            return a && this._append(a), this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(b, c) {
                return new a.init(c).finalize(b)
            }
        },
        _createHmacHelper: function(a) {
            return function(b, c) {
                return new m.HMAC.init(a, c).finalize(b)
            }
        }
    });
    var m = c.algo = {};
    return c
}(Math);
! function() {
    var a = CryptoJS,
        b = a.lib,
        c = b.WordArray,
        d = b.Hasher,
        e = [],
        b = a.algo.SHA1 = d.extend({
            _doReset: function() {
                this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(a, b) {
                for (var c = this._hash.words, d = c[0], f = c[1], g = c[2], h = c[3], i = c[4], j = 0; 80 > j; j++) {
                    if (16 > j) e[j] = 0 | a[b + j];
                    else {
                        var k = e[j - 3] ^ e[j - 8] ^ e[j - 14] ^ e[j - 16];
                        e[j] = k << 1 | k >>> 31
                    }
                    k = (d << 5 | d >>> 27) + i + e[j], k = 20 > j ? k + ((f & g | ~f & h) + 1518500249) : 40 > j ? k + ((f ^ g ^ h) + 1859775393) : 60 > j ? k + ((f & g | f & h | g & h) - 1894007588) : k + ((f ^ g ^ h) - 899497514), i = h, h = g, g = f << 30 | f >>> 2, f = d, d = k
                }
                c[0] = c[0] + d | 0, c[1] = c[1] + f | 0, c[2] = c[2] + g | 0, c[3] = c[3] + h | 0, c[4] = c[4] + i | 0
            },
            _doFinalize: function() {
                var a = this._data,
                    b = a.words,
                    c = 8 * this._nDataBytes,
                    d = 8 * a.sigBytes;
                return b[d >>> 5] |= 128 << 24 - d % 32, b[(d + 64 >>> 9 << 4) + 14] = Math.floor(c / 4294967296), b[(d + 64 >>> 9 << 4) + 15] = c, a.sigBytes = 4 * b.length, this._process(), this._hash
            },
            clone: function() {
                var a = d.clone.call(this);
                return a._hash = this._hash.clone(), a
            }
        });
    a.SHA1 = d._createHelper(b), a.HmacSHA1 = d._createHmacHelper(b)
}(),
function() {
    var a = CryptoJS,
        b = a.enc.Utf8;
    a.algo.HMAC = a.lib.Base.extend({
        init: function(a, c) {
            a = this._hasher = new a.init, "string" == typeof c && (c = b.parse(c));
            var d = a.blockSize,
                e = 4 * d;
            c.sigBytes > e && (c = a.finalize(c)), c.clamp();
            for (var f = this._oKey = c.clone(), g = this._iKey = c.clone(), h = f.words, i = g.words, j = 0; d > j; j++) h[j] ^= 1549556828, i[j] ^= 909522486;
            f.sigBytes = g.sigBytes = e, this.reset()
        },
        reset: function() {
            var a = this._hasher;
            a.reset(), a.update(this._iKey)
        },
        update: function(a) {
            return this._hasher.update(a), this
        },
        finalize: function(a) {
            var b = this._hasher;
            return a = b.finalize(a), b.reset(), b.finalize(this._oKey.clone().concat(a))
        }
    })
}(),
function() {
    var a = CryptoJS,
        b = a.lib.WordArray;
    a.enc.Base64 = {
        stringify: function(a) {
            var b = a.words,
                c = a.sigBytes,
                d = this._map;
            a.clamp(), a = [];
            for (var e = 0; c > e; e += 3)
                for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && c > e + .75 * g; g++) a.push(d.charAt(f >>> 6 * (3 - g) & 63));
            if (b = d.charAt(64))
                for (; a.length % 4;) a.push(b);
            return a.join("")
        },
        parse: function(a) {
            var c = a.length,
                d = this._map,
                e = d.charAt(64);
            e && (e = a.indexOf(e), -1 != e && (c = e));
            for (var e = [], f = 0, g = 0; c > g; g++)
                if (g % 4) {
                    var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4),
                        i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4);
                    e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4), f++
                }
            return b.create(e, f)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
}();
var espn = function(a) {
    var b = a.settings = a.settings || {
        API_KEY: "wnvkmqnqmphu23rhw72dyugw",
        DEBUG: !1,
        CONFIGURATION_URL: "http://espn.go.com/espn360/configs/appletv",
        ANALYTICS_SUITE_ID: "wdgespwatchappletv",
        APP_VERSION: "1.0.0",
        OS_VERSION: atv.device.softwareVersion,
        USE_QA_AUTH: !1,
        ADOBE_PASS_HOST: "https://api.auth.adobe.com",
        FREEWHEEL_TRACKING_BASE_URL: "http://1546a.s.fwmrm.net/ad/l/1",
        FREEWHEEL_SYNCING_TOKEN_URL: "http://stghls.v.fwmrm.net/s",
        ENABLE_PASS_THROUGH: !0,
        ENABLE_STREAM_LIMIT_TRACKING: !0
    };
    if (Object.defineProperty(b, "DEVICE_ID", {
            writeable: !0,
            get: function() {
                return atv.localStorage["espn.deviceId"]
            },
            set: function(a) {
                atv.localStorage["espn.deviceId"] = a
            }
        }), !b.DEVICE_ID) {
        var c = atv.crypto.SHA1(atv.uuid());
        b.DEVICE_ID = c
    }
    return a
}(espn || {});
Q.longStackJumpLimit = 0, Q.longStackSupport = !1, convivaClientSettings = {
    customerKey: "766ee8daa5d5deaeeeab4481239072ea53f6f1cc",
    gatewayUrl: "",
    applicationName: "WatchESPN Apple TV 1.4.0",
    playerVersion: "1.4.0"
}, youboraSettings = {
    accountCode: "espn",
    httpSecure: !0
};
var espn = function(a) {
        var b = a.utils = a.utils || {};
        return b.qAjax = function(a) {
            function b(a) {
                return 200 === a.status || 201 === a.status || 202 === a.status || 204 === a.status || 0 === a.status && a.responseText
            }

            function c() {
                if (b(j)) {
                    var a;
                    a = "xml" == h ? j.responseXML : "json" == h ? JSON.parse(j.responseText) : j.responseText, k.resolve(a)
                } else d(j)
            }

            function d(a) {
                var b = a.responseText;
                if (b) try {
                    "xml" == h ? b = a.responseXML : "json" == h && (b = JSON.parse(a.responseText))
                } catch (c) {}
                k.reject(b)
            }
            a = a || {};
            var e = a.type || "GET",
                f = a.url || null,
                g = a.headers || {},
                h = a.dataType || "json",
                i = "*/*",
                j = new XMLHttpRequest,
                k = Q.defer();
            "json" == h && (i = "application/json"), ("xml" == h || "html" == h) && (i = "application/" + h);
            try {
                j.onreadystatechange = function() {
                    try {
                        4 === j.readyState && c()
                    } catch (a) {
                        j.abort()
                    }
                }, j.open(e, f, !0), j.onload = j.load = c, j.onerror = j.error = d, j.open(e, f, !0), "POST" == e && (j.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), j.setRequestHeader("Connection", "close"));
                for (var l in g) j.setRequestHeader(l, g[l]);
                j.setRequestHeader("Accept", i)
            } catch (m) {
                k.reject(m.message, m)
            }
            return j.send(), k.promise
        }, a
    }(espn || {}),
    espn = function(a) {
        var b = a.analyticsClient = a.analyticsClient || {},
            c = a.settings.DEVICE_ID,
            d = a.settings.APP_VERSION,
            e = a.settings.OS_VERSION,
            f = a.settings.ANALYTICS_SUITE_ID,
            g = "http://espn.112.2o7.net/b/ss/" + f + "/0/OIP-2.1",
            h = "watchespn",
            i = "appletv",
            j = h + ":" + i,
            k = h + " Player",
            l = a.settings.ENABLE_STREAM_LIMIT_TRACKING,
            m = {
                c17: "en",
                v9: "en",
                c47: j + ":" + d,
                c48: e
            },
            n = function(a) {
                var b = String(a);
                return 1 === b.length && (b = "0" + b), b
            },
            o = function(a) {
                var b = Array.prototype.slice.call(arguments, 1);
                return b.forEach(function(b) {
                    if (b)
                        for (var c in b) a[c] = b[c]
                }), a
            },
            p = function(a) {
                var b = [];
                for (var c in a) {
                    var d = a[c];
                    d && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(d))
                }
                return b.join("&")
            },
            q = function(a) {
                var b = Math.floor(99999999 * Math.random()),
                    d = new Date,
                    e = d.getDate() + "/" + d.getMonth() + "/" + (d.getYear() + 1900) + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + d.getDay() + " " + d.getTimezoneOffset();
                return g + "/s" + b + "?AQB=1&ndh=1&t=" + encodeURIComponent(e) + "&vid=" + encodeURIComponent(c) + "&ce=UTF-8&" + p(a) + "&AQE=1"
            };
        return b.trackPageRequest = function(b, c) {
            var d = b.split(":"),
                e = d[2],
                f = d.slice(0, 3).join(":");
            c = c && c.toLowerCase();
            var g = {
                pageName: b,
                events: "event3",
                ch: j,
                c1: h,
                v13: b,
                c5: f,
                v11: f,
                c35: e,
                c4: j,
                c42: c,
                v17: c,
                c43: c,
                v32: c
            };
            g = o(g, m);
            var i = q(g);
            return a.utils.qAjax({
                url: i,
                dataType: "text"
            })
        }, b.trackVideoRequest = function(b, c, d) {
            var e = j + ":videorequest:" + b + ":" + c,
                f = e + ":" + d,
                g = {
                    pe: "lnk_o",
                    pev2: f,
                    v11: e,
                    c9: f
                };
            g = o(g, m);
            var h = q(g);
            return a.utils.qAjax({
                url: h,
                dataType: "text"
            })
        }, b.trackStreamLimit = function(b, c, d, e, f, g, i) {
            if (l === !0) {
                var k = b || "",
                    n = j + ":" + c;
                accessType = "", d = d && d.toLowerCase(), d ? (accessType = d + ":", f ? accessType += "authenticated" : g ? accessType += "isp" : accessType = "not auth") : (d = "not auth", accessType = "not auth");
                var p = {
                    pe: "lnk_o",
                    pev2: n,
                    events: k,
                    ch: j,
                    c1: h,
                    c42: e,
                    v17: e,
                    c43: d,
                    v32: d,
                    c68: accessType,
                    v68: accessType,
                    v76: i
                };
                p = o(p, m);
                var r = q(p);
                return a.utils.qAjax({
                    url: r,
                    dataType: "text"
                })
            }
        }, b.trackVideoPlayer = function(b, c, d, e, f, g, k, l, n, p) {
            var r = "event1",
                s = j + ":video:start",
                t = g ? j + ":" + g : "",
                u = k ? j + ":" + k : "",
                v = i + ":vod",
                w = c + ":" + d + ":vod";
            e = e && e.toLowerCase(), l = l || "manual", "midpoint" == b ? (s = j + ":video:half", r = "event9") : "complete" == b && (s = j + ":video:complete", r = "event11"), accessType = "", f = f && f.toLowerCase(), f ? (accessType = f + ":", n ? accessType += "authenticated:vod" : p ? accessType += "isp:vod" : accessType = "vod:not auth") : (f = "vod:not auth", accessType = "vod:not auth");
            var x = {
                pe: "lnk_o",
                pev2: s,
                events: r,
                ch: j,
                c1: h,
                v11: "video:" + e,
                c35: "vod",
                c4: "video:" + e,
                v19: t,
                c25: t,
                v21: u,
                c26: u,
                c42: f,
                v17: f,
                c43: f,
                v32: f,
                v2: w,
                c3: w,
                v16: l,
                c52: v,
                v52: v,
                c45: "vod",
                v34: "vod",
                c68: accessType,
                v68: accessType
            };
            x = o(x, m);
            var y = q(x);
            return a.utils.qAjax({
                url: y,
                dataType: "text"
            })
        }, b.trackStream = function(b, c, d, e, f, g, j, l, m, p, r, s, t, u, v) {
            f = f && f.toLowerCase(), g = g && g.toLowerCase(), m = m && m.toLowerCase(), "espn" == m && (m = "espn1"), j = j && j.toLowerCase(), l = l && l.toLowerCase();
            var w = new Date(s),
                x = w.getUTCFullYear() + "-" + n(w.getUTCMonth() + 1) + "-" + n(w.getUTCDate()),
                y = n(w.getUTCHours()) + ":" + n(w.getUTCMinutes()),
                z = Math.floor((new Date - w) / 1e3 / 60),
                A = 5 * Math.floor(z / 5),
                B = A + "-" + (A + 5),
                C = [x, y, j, l, r, p, e, d, m].join("|"),
                D = {
                    start: "event10,event23,event1",
                    milestone: "event10,event23",
                    complete: "event10,event23,event11",
                    stop: "event10,event23"
                },
                E = D[b] || "event10,event23",
                F = u && u % 5,
                G = {
                    start: ";;;;event10=0",
                    milestone: ";;;;event10=5",
                    complete: ";;;;event10=" + F,
                    stop: ";;;;event10=" + F
                },
                H = G[b] || "",
                I = {
                    pe: "lnk_o",
                    v2: c + ":" + d + ":" + e,
                    v9: v,
                    c17: v,
                    v11: k,
                    v17: g,
                    v19: j,
                    v21: l,
                    v31: e,
                    v32: f,
                    v33: c + ":" + d + ":" + e + ":" + B,
                    v34: m,
                    v35: "watchespn",
                    c35: "watchespn",
                    v39: h + ":" + r + p,
                    v45: d,
                    v47: C,
                    v52: i,
                    v55: i + ":" + g,
                    v57: i + (l ? ":" + l : ""),
                    v59: i + ":" + c + ":" + d + ":" + e,
                    v68: g + ":" + (t ? "authenticated" : "isp"),
                    v71: c + ":" + d + ":" + e,
                    events: E,
                    products: H
                };
            if ("start" == b) {
                var J = {
                    c3: I.v2,
                    c4: I.v11,
                    c5: h + ":" + k + ":" + f,
                    c25: I.v19,
                    c26: I.v21,
                    c28: I.v45,
                    c42: I.v17,
                    c43: I.v32,
                    c45: I.v34,
                    c51: I.v39,
                    c52: I.v52,
                    c55: I.v55,
                    c57: I.v57,
                    c59: I.v59,
                    c68: I.v68,
                    c71: I.v71
                };
                I = o(I, J)
            }
            var K = q(I);
            return a.utils.qAjax({
                url: K,
                dataType: "text"
            })
        }, a
    }(espn || {}),
    espn = function(a) {
        var b = a.analyticsManager = a.analyticsManager || {};
        return b.setBeacons = setBeacons = function(a) {
            if (a.playbackUrl && a.duration && a.duration > 0) {
                var b = Math.floor(a.duration / 2),
                    c = Math.floor(a.duration),
                    d = {};
                d[0] = "start", d[b] = "midpoint", d[c] = "complete", atv.sessionStorage["espn.beacons"] = d
            }
        }, b.handleWillStartPlaying = function() {
            var b = atv.sessionStorage["espn.event"] || {};
            if (setBeacons(b), b.sessionUrl) {
                var c = 0,
                    d = a.authenticator.getAffiliateAnalyticsId(),
                    e = a.authenticator.isAuthenticated();
                a.analyticsClient.trackStream("start", b.id, b.name, b.type, d, d, b.categoryName, b.subcategoryName, b.network, b.programCode, b.programCategoryCode, parseInt(b.startTime, 0), e, c, b.lang), atv.sessionStorage.removeItem("espn.startMinutes")
            }
        }, b.handleProgramChange = function() {
            var b = atv.sessionStorage["espn.event"] || {};
            if (b.sessionUrl) {
                var c = a.authenticator.getAffiliateAnalyticsId(),
                    d = a.authenticator.isAuthenticated(),
                    e = 0,
                    f = 0,
                    g = atv.sessionStorage["espn.streamBeacons"] || {},
                    h = Object.keys(g) || [];
                if (h && h.length > 0) {
                    e = Math.max.apply(null, h);
                    var i = parseInt(g[e], 0);
                    f = Math.floor((Date.now() - i) / 1e3 / 60)
                }
                var j = e + f;
                a.analyticsClient.trackStream("complete", b.id, b.name, b.type, c, c, b.categoryName, b.subcategoryName, b.network, b.programCode, b.programCategoryCode, parseInt(b.startTime, 0), d, j, b.lang)
            }
        }, b.handlePlayerTimeChange = function(b) {
            var c = atv.sessionStorage["espn.event"] || {},
                d = Math.floor(b),
                e = Math.floor(d / 60) || 0,
                f = atv.sessionStorage["espn.beacons"] || {},
                g = f && f[d],
                h = a.authenticator.getAffiliateAnalyticsId(),
                i = a.authenticator.isAuthenticated(),
                j = a.authenticator.isIpAuthenticated();
            g && (c.playbackUrl && !c.sessionUrl && a.analyticsClient.trackVideoPlayer(g, c.id, c.name, c.coverageType, h, c.sportName, c.leagueName, c.startMethod, i, j), delete f[d], atv.sessionStorage["espn.beacons"] = f);
            var k = atv.sessionStorage["espn.streamBeacons"] || {},
                l = atv.sessionStorage["espn.startMinutes"];
            if (l || (atv.sessionStorage["espn.startMinutes"] = e, l = e), e -= l, e > 0 && c.sessionUrl) {
                var m = e % 5 === 0;
                m && !k[e] && (a.analyticsClient.trackStream("milestone", c.id, c.name, c.type, h, h, c.categoryName, c.subcategoryName, c.network, c.programCode, c.programCategoryCode, parseInt(c.startTime, 0), i, e, c.lang), k[e] = Date.now(), atv.sessionStorage["espn.streamBeacons"] = k)
            }
        }, b.handlePlayerStop = function() {
            var b = atv.sessionStorage["espn.event"] || {};
            if (b.sessionUrl) {
                var c = a.authenticator.getAffiliateAnalyticsId(),
                    d = a.authenticator.isAuthenticated(),
                    e = 0,
                    f = 0,
                    g = atv.sessionStorage["espn.streamBeacons"] || {},
                    h = Object.keys(g) || [];
                if (h && h.length > 0) {
                    e = Math.max.apply(null, h);
                    var i = parseInt(g[e], 0);
                    f = Math.floor((Date.now() - i) / 1e3 / 60)
                }
                var j = e + f;
                a.analyticsClient.trackStream("stop", b.id, b.name, b.type, c, c, b.categoryName, b.subcategoryName, b.network, b.programCode, b.programCategoryCode, parseInt(b.startTime, 0), d, j, b.lang)
            }
        }, b.stopOrDeauthorize = function(b, c) {
            var d = a.authenticator.getAuthenticationToken(),
                e = d && d.userId || "unknown",
                f = a.authenticator.getAffiliateAnalyticsId(),
                g = a.authenticator.getProvider(),
                h = g && g.name || f,
                i = a.authenticator.isAuthenticated(),
                j = a.authenticator.isIpAuthenticated(),
                k = "event97",
                l = "Stream Limit Reached";
            b === !0 && (a.analyticsClient.trackStreamLimit(k, l, f, h, i, j, e), k = "event98", l = "Deauthentication Event"), c === !0 && (k = "event99", l = "Stream Limit Error"), a.analyticsClient.trackStreamLimit(k, l, f, h, i, j, e)
        }, a
    }(espn || {}),
    espn = function(a) {
        function b(a) {
            //h && console.log(a)
        	console.log(a);
        }
        var c = a.adobePassClient = a.adobePassClient || {},
            d = a.settings.ADOBE_PASS_HOST || "https://api.auth.adobe.com",
            e = "ESPN",
            f = "yKpsHYd8TOITdTMJHmkJOVmgbb2DykNK",
            g = "gB8HYdEPyezeYbR1",
            h = !1,
            i = 1800,
            j = atv.uuid || function() {
                function a() {
                    return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
                }
                return (a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()).toUpperCase()
            },
            k = function(a, b) {
                var c = Date.now(),
                    d = a.toUpperCase() + " requestor_id=" + e + ", nonce=" + j() + ", signature_method=HMAC-SHA1, request_time=" + c + ", request_uri=" + b,
                    h = CryptoJS.HmacSHA1(d, g);
                	console.log('h %o d %o g %o', h, d, g);
                return h = h.toString(CryptoJS.enc.Base64), d = d + ", public_key=" + f + ", signature=" + h
            };
        return c.getResource = function(a) {
            var b = a.channelResourceId || a.network,
                c = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title><![CDATA[' + b + "]]></title><item><title><![CDATA[" + a.name + "]]></title><guid><![CDATA[" + a.guid + ']]></guid><media:rating scheme="urn:v-chip"><![CDATA[' + a.parentalRating + "]]></media:rating></item></channel></rss>";
            return c
        }, c.getResourceKey = function(a) {
            return a.channelResourceId || a.network
        }, c.generateRegCode = function(c) {
            var f = "/regcode",
                g = d + "/reggie/v1/" + e + f + "?deviceId=" + c + "&deviceType=appletv&ttl=" + i,
                h = k("POST", f);
            console.log('g: %o', g);
            console.log('h: %o', h);
            console.log({
                url: g,
                type: "POST",
                dataType: "json",
                headers: {
                    Authorization: h
                }});
            return a.utils.qAjax({
                url: g,
                type: "POST",
                dataType: "json",
                headers: {
                    Authorization: h
                }
            }).then(function(a) {
                return b("generateRegCode response: " + JSON.stringify(a)), a
            })
        }, c.authenticateRegCode = function(c) {
            var f = "/authenticate/" + c,
                g = d + "/api/v1" + f + "?requestor=" + e,
                h = k("GET", f);
            console.log('url %o', g);
            return a.utils.qAjax({
                url: g,
                dataType: "json",
                headers: {
                    Authorization: h
                }
            }).then(function(a) {
                return b("authenticateRegCode response: " + JSON.stringify(a)), a
            })
        }, c.getAuthnToken = function(c) {
            var f = "/tokens/authn",
                g = d + "/api/v1" + f + "?requestor=" + e + "&deviceId=" + c,
                h = k("GET", f);
            console.log('url %o', g)
            return a.utils.qAjax({
                url: g,
                dataType: "json",
                headers: {
                    Authorization: h
                }
            }).then(function(a) {
                return b("getAuthnToken response: " + JSON.stringify(a)), a
            })
        }, c.getUserMetadata = function(c) {
            var f = "/tokens/usermetadata",
                g = d + "/api/v1" + f + "?requestor=" + e + "&deviceId=" + c,
                h = k("GET", f);
            return a.utils.qAjax({
                url: g,
                dataType: "json",
                headers: {
                    Authorization: h
                }
            }).then(function(a) {
                return b("getUserMetadata response: " + JSON.stringify(a)), a
            })
        }, c.authorize = function(c, f) {
            var g = atv.sessionStorage["espn.authorizationTokenCache"] || {},
                h = c,
                i = g[h];
            if (i && i.expires) {
                var j = Date.now() + 6e4 > i.expires;
                if (!j) return Q.fcall(function() {
                    return i
                });
                delete g[h]
            }
            var l = "/authorize",
                m = d + "/api/v1" + l + "?requestor=" + e + "&resource=" + encodeURIComponent(c) + "&deviceId=" + f,
                n = k("GET", "/authorize");
            console.log('url ' + m);
            return a.utils.qAjax({
                url: m,
                dataType: "json",
                headers: {
                    Authorization: n
                }
            }).then(function(a) {
                return g[h] = a, atv.sessionStorage["espn.authorizationTokenCache"] = g, b("authorize response: " + JSON.stringify(a)), a
            })
        }, c.getShortMediaToken = function(c, f) {
            var g = "/mediatoken",
                h = d + "/api/v1" + g + "?requestor=" + e + "&resource=" + encodeURIComponent(c) + "&deviceId=" + f,
                i = k("GET", g);
            return a.utils.qAjax({
                url: h,
                dataType: "json",
                headers: {
                    Authorization: i
                }
            }).then(function(a) {
                return b("getShortMediaToken response: " + JSON.stringify(a)), a
            })
        }, c.deauthorize = function(c) {
            var e = "/logout",
                f = d + "/api/v1" + e + "?deviceId=" + c,
                g = k("DELETE", e);
            return atv.sessionStorage.removeItem("espn.authorizationTokenCache"), a.utils.qAjax({
                url: f,
                type: "DELETE",
                dataType: "text",
                headers: {
                    Authorization: g
                }
            }).then(function(a) {
                return b("logout complete"), a
            })
        }, a
    }(espn || {}),
    espn = function(a) {
        var b = a.freeWheelService = a.freeWheelService || {},
            c = "",
            d = a.settings.freeWheelTrackingBaseUrl || "http://1546a.s.fwmrm.net/ad/l/1",
            e = a.settings.freeWheelSyncingTokenUrl || "http://stghls.v.fwmrm.net/s";
        return b.listenableID3Tags = ["TIT2", "TIT3"], b.getFreeWheelSyncingToken = function(b, d) {
            if (b === !0) {
                if ("" === c) return e = d || e, a.utils.qAjax({
                    url: e,
                    dataType: "text"
                }).then(function(a) {
                    return a.length > 0 ? (c = encodeURIComponent(a), atv.localStorage._fw_syncing_token = c, c) : (c = Math.floor(1e7 * Math.random() + 1), atv.localStorage._fw_syncing_token = c, c)
                }, function() {
                    return c = Math.floor(1e7 * Math.random() + 1), atv.localStorage._fw_syncing_token = c, c
                });
                var f = Q.defer();
                return f.resolve(c), f.promise
            }
            var f = Q.defer();
            return f.resolve(""), f.promise
        }, b.sendTrackingBeacon = function(b) {
            var c = d + "?_fw_syncing_token=" + atv.localStorage._fw_syncing_token + "&id3=" + b;
            return a.utils.qAjax({
                url: c
            }).then(function() {
                return !0
            }, function() {
                return !1
            })
        }, a
    }(espn || {}),
    espn = function(a) {
        var b = a.passThroughService = a.passThroughService || {},
            c = ["PRIV"],
            d = "",
            e = "";
        b.setPassThroughParams = function(a, b) {
            d = a || d, e = b || e, atv.localStorage._passThroughURL = d, atv.localStorage._simulcastAiringId = e
        }, b.handleTimedMetadata = function(a) {
            if (-1 != c.indexOf(a.key)) {
                var b = a.extraAttributes,
                    d = b.info;
                if ("com.espn.authnet.transition" === d) {
                    var e = f(a);
                    if (e) {
                        var h = e.to;
                        "COMMERCIAL" === h.type && g(h.id)
                    }
                }
            }
        };
        var f = function(a) {
                try {
                    var b = a.dataValue,
                        c = CryptoJS.enc.Base64.parse(b),
                        d = CryptoJS.enc.Utf8.stringify(c);
                    d = d.replace("\x00", "");
                    var e = JSON.parse(d);
                    return e
                } catch (f) {
                    console.log("Failed to parse ID3 tag " + f)
                }
            },
            g = function(b) {
                if (d = atv.localStorage._passThroughURL, e = atv.localStorage._simulcastAiringId, d.length) {
                    e = encodeURIComponent(e), b = encodeURIComponent(b);
                    var c = encodeURIComponent((new Date).getTime()),
                        f = d + "&caid=" + e + "&pvrn=" + c + "&resp=ad;adid=" + b + "&airing=" + e + ";ptgt=a&slau=midroll";
                    return a.utils.qAjax({
                        url: f
                    }).then(function() {
                        return !0
                    }, function() {
                        return !1
                    })
                }
            };
        return a
    }(espn || {}),
    espn = function(a) {
        function b(a) {
            q && console.log(a)
        }

        function c() {
            return atv.localStorage["espn.authn"]
        }

        function d(a) {
            atv.localStorage["espn.authn"] = a
        }

        function e() {
            atv.localStorage.removeItem("espn.authn")
        }

        function f(a) {
            atv.sessionStorage["espn.regCode"] = a
        }

        function g() {
            return atv.sessionStorage["espn.regCodeExpires"]
        }

        function h(a) {
            atv.sessionStorage["espn.regCodeExpires"] = a
        }

        function i(a) {
            atv.sessionStorage["espn.user"] = a
        }

        function j(a) {
            var c = o.getUser() || {};
            c.location = a && a.location || null, c.ipAffiliate = a && a.ipAffiliate || null, i(c), b("setUserIpAffiliate: " + JSON.stringify(c))
        }

        function k(b) {
            var c = o.getUser() || {},
                d = b.mvpd || "blank",
                e = r + "/" + d.toLowerCase() + ".png";
            c.apAffiliate = c.apAffiliate || {}, c.apAffiliate.name = b.mvpd, c.apAffiliate.imageHref = e, a.utils.qAjax({
                url: e,
                dataType: "text"
            }).fail(function() {
                c.apAffiliate.imageHref = r + "/blank.png"
            }).fin(function() {
                i(c)
            }).done()
        }

        function l() {
            var a = o.getUser();
            a && (a.apAffiliate = null, i(a))
        }

        function m() {
            return atv.sessionStorage["espn.user"] || {}
        }

        function n(a) {
            atv.localStorage["espn.accountId"] = a
        } {
            var o = a.authenticator = a.authenticator || {},
                p = a.settings.API_KEY,
                q = a.settings.DEBUG,
                r = "http://assets.espn.go.com/espn360/images/affiliates/settop";
            o.getAccountId = function() {
                return atv.localStorage["espn.accountId"]
            }
        }
        return o.getUser = m, o.getRegCode = function() {
            return atv.sessionStorage["espn.regCode"]
        }, o.getUserState = function(a) {
            a = a || m();
            var b = a && a.location && a.location.state;
            return b || ""
        }, o.getUserCountry = function(a) {
            a = a || m();
            var b = a && a.location && a.location.country;
            return b || ""
        }, o.getUserDma = function(a) {
            a = a || m();
            var b = a && a.location && a.location.dma;
            return b || ""
        }, o.getUserTimeZone = function(a) {
            a = a || m();
            var b = a && a.location && a.location.timeZone;
            return b || ""
        }, o.generateRegCode = function() {
            var b = a.settings.DEVICE_ID;
            return a.adobePassClient.generateRegCode(b).then(function(a) {
                var b = a.code,
                    c = a.expires;
                return f(b), h(c), b
            })
        }, o.checkRegCode = function(b) {
            var c = atv.localStorage["espn.routes"],
                e = g() || 0,
                f = Date.now();
            return f > e ? Q.fcall(function() {
                throw new Error("Your activation code has expired.")
            }) : a.adobePassClient.authenticateRegCode(b).then(function(b) {
                var e = b;
                d(e), k(e);
                var f = a.settings.DEVICE_ID;
                a.adobePassClient.getUserMetadata(f).then(function(a) {
                    var b = a.data && a.data.upstreamUserID;
                    n(b)
                });
                var g = c.apiProviders + "/" + e.mvpd + "?apikey=" + p;
                return a.utils.qAjax({
                    url: g,
                    dataType: "json"
                }).then(function(a) {
                    var b = a && a.clients && a.clients[0],
                        c = b && b.providers && b.providers[0];
                    o.setProvider(c)
                }).fin(function() {
                    return b
                })
            }, function() {
                return Q.fcall(function() {
                    throw new Error("Your activation code has not been verified.")
                })
            })
        }, o.authenticateRegCode = function(b) {
            return a.adobePassClient.authenticateRegCode(b).then(function(a) {
                var b = a;
                d(b)
            }, function() {
                throw new Error("authenticateRegCode failed.")
            })
        }, o.authenticate = function() {
            var b = a.settings.DEVICE_ID,
                c = atv.localStorage["espn.routes"],
                f = c.userdata;
            return a.utils.qAjax({
                url: f,
                dataType: "json"
            }).then(function(a) {
                var b = a && a.user;
                j(b)
            }).then(function() {
                return a.adobePassClient.getAuthnToken(b)
            }).then(function(c) {
                var e = c;
                return d(e), k(e), a.adobePassClient.getUserMetadata(b).then(function(a) {
                    var b = a.data && a.data.upstreamUserID;
                    n(b)
                }), e
            }, function() {
                throw e(), new Error("authenticate failed.")
            }).then(function(b) {
                var d = c.apiProviders + "/" + b.mvpd + "?apikey=" + p;
                return a.utils.qAjax({
                    url: d,
                    dataType: "json"
                }).then(function(a) {
                    var c = a && a.clients && a.clients[0],
                        d = c && c.providers && c.providers[0];
                    return o.setProvider(d), b
                })
            })
        }, o.deauthenticate = function() {
            l(), e()
        }, o.isIpAuthenticated = function() {
            var a = m();
            return a && a.ipAffiliate && !0 || !1
        }, o.isAuthenticated = function() {
            return c() && !0 || !1
        }, o.setProvider = function(a) {
            atv.sessionStorage["espn.provider"] = a
        }, o.getProvider = function() {
            return atv.sessionStorage["espn.provider"]
        }, o.getAffiliateAnalyticsId = function() {
            var a = o.getProvider();
            a || (a = m().ipAffiliate);
            var b = a && (a.analytics && a.analytics.id || a.name);
            return b
        }, o.getAffiliateName = function() {
            var a = m(),
                b = a && (a.apAffiliate || a.ipAffiliate);
            return b && b.name
        }, o.getAuthenticationToken = c, a
    }(espn || {}),
    espn = function(a) {
        function b() {
            return atv.sessionStorage["espn.session"]
        }

        function c(a) {
            return null !== a && void 0 !== a && (atv.sessionStorage["espn.session"] = a), atv.sessionStorage["espn.session"]
        }

        function d() {
            atv.sessionStorage.removeItem("espn.session")
        }

        function e(a) {
            return null !== a && void 0 !== a && (atv.sessionStorage["espn.authz"] = a), atv.sessionStorage["espn.authz"]
        }

        function f() {
            atv.sessionStorage.removeItem("espn.authz")
        }

        function g(a) {
            return null !== a && void 0 !== a && (atv.sessionStorage["espn.isPolling"] = a), atv.sessionStorage["espn.isPolling"]
        }

        function h(b, d, e, f, g) {
            b = b.replace("https", "http"), a.settings.USE_QA_AUTH && (b = b.replace("broadband.espn.go.com", "broadband-qa.espn.go.com"));
            var h = CryptoJS.enc.Utf8.parse(d),
                i = CryptoJS.enc.Base64.stringify(h);
            return b = b + "&partner=watchespn&platform=appletv&token=" + encodeURIComponent(e) + "&tokenType=" + f + "&resource=" + encodeURIComponent(i) + "&v=2.0.0&clientVersion=" + a.settings.APP_VERSION + "&r=" + Math.random(), a.utils.qAjax({
                url: b,
                type: "POST",
                dataType: "json"
            }).then(function(b) {
                var d = !b || "success" != b.status;
                if (d) {
                    var e = b.message || "You are not authorized to view this video.";
                    throw new Error(e)
                }
                var f = b && b.session;
                return f.channelType = g, c(f), a.passThroughService.setPassThroughParams(b.session.passThroughBeaconURL, b.session.event.simulcastAiringId), b
            })
        }

        function i(b, c) {
            var d = 6e4,
                e = atv.sessionStorage["espn.programChangeTimeoutId"];
            e && atv.clearTimeout(e), e = atv.setTimeout(function() {
                g() && a.utils.qAjax({
                    url: c,
                    dataType: "json"
                }).then(function(c) {
                    var d = c && c.listings[0],
                        e = b != d.id;
                    e && (b = d.id, a.application.handleProgramChange(b))
                }).then(function() {
                    i(b, c)
                })
            }, d), atv.sessionStorage["espn.programChangeTimeoutId"] = e
        } {
            var j = a.authorizer = a.authorizer || {},
                k = a.settings.API_KEY;
            a.settings.DEBUG
        }
        return j.removeSession = d, j.watchSession = function() {
            var a = b(),
                c = a && a.event && a.event.id,
                d = a && a.channel,
                e = a && a.channelType,
                f = (a && a.programChangeUrl) + "&_appName=appletv&apikey=" + k;
            a && (g(!0), "online" != e && "espn3" != d && "secplus" != d && i(c, f))
        }, j.stopSession = function() {
            d(), g(!1)
        }, j.authorize = function(b) {
            var c = a.settings.DEVICE_ID,
                d = "espn3" == b.network && a.authenticator.isIpAuthenticated(),
                g = b.sessionUrl,
                i = a.adobePassClient.getResource(b);
            return d ? h(g, i, c, "DEVICE", b.channelType) : a.adobePassClient.authorize(i, c).then(function(d) {
                var f = d;
                return e(f), a.adobePassClient.getShortMediaToken(i, c).then(function(a) {
                    var c = a.serializedToken;
                    return h(g, i, c, "ADOBEPASS", b.channelType)
                })
            }, function(a) {
                throw f(), a
            })
        }, j.deauthorize = function() {
            var b = a.settings.DEVICE_ID;
            return f(), a.authenticator.deauthenticate(), a.adobePassClient.deauthorize(b)
        }, a
    }(espn || {}),
    preroller = function() {
        var a = atv.localStorage["espn.preRollInterval"] || 0,
            b = atv.localStorage["espn.preRollSuffix"] || "",
            c = function() {
                var a = atv.localStorage["espn.preRollCount"] || 0;
                return a
            },
            d = function(a) {
                var b;
                b = 1 == a ? 0 : c() + 1, console.log("incrementPreRollCount", b), atv.localStorage["espn.preRollCount"] = b
            };
        return {
            configure: function(c) {
                c && (a = c.preRollInterval || a, b = c.preRollSuffix || b)
            },
            preroll: function(e) {
                var f = e.playbackUrl,
                    g = c();
                if (a > 0 && g >= a - 1 && e.preRollPlaybackUrl) {
                    var h = -1 == e.preRollPlaybackUrl.indexOf("?") ? "?" : "&";
                    f = e.preRollPlaybackUrl + h + b, d(!0)
                } else d();
                return f
            },
            getInterval: function() {
                return a
            },
            getSuffix: function() {
                return b
            },
            getCount: c,
            increment: d
        }
    }(),
    espn = function(a, b) {
        function c(a) {
            atv.sessionStorage["espn.event"] = a
        }
        var d = a.player = a.player || {};
        return d.getEvent = function() {
            return atv.sessionStorage["espn.event"]
        }, d.play = function(d, e) {
            if ("string" == typeof d) {
                var f = document.getElementById(d),
                    g = f.getElementByTagName("stash"),
                    h = g.getElementByTagName("json");
                d = JSON.parse(h.textContent)
            }
            var i = atv.localStorage["espn.routes"],
                j = "upcoming" != d.type;
            if (d.startMethod = "manual", c(d), d.playbackUrl) {
                var k = d.playbackUrl;
                b && (k = b.preroll(d));
                var l = i.hfv + "?url=" + encodeURIComponent(k) + "&name=" + encodeURIComponent(d.name) + "&guid=" + encodeURIComponent(d.id) + "&network=" + encodeURIComponent(d.network) + "&description=" + encodeURIComponent(d.description) + "&imageHref=" + encodeURIComponent(d.imageHref) + "&channel=" + encodeURIComponent(d.channel) + "&indefinite=false";
                return void atvutils.loadURL(l)
            }
            if (j) {
                var m = atv.device.isInRetailDemoMode;
                if (m) {
                    var n = "This video is not available in store.",
                        o = i.error + "?title=Unable%20To%20Play%20Video&message=" + encodeURIComponent(n);
                    return void atvutils.loadURL(o)
                }
                var p = new atv.ProxyDocument;
                p.show(), a.authorizer.authorize(d).then(function(b) {
                    var f = b.session.playbackUrls["default"],
                        g = b.session.adInsertionEnabled || !1;
                    return d.cdnResource = b.session.analytics && b.session.analytics.conviva && b.session.analytics.conviva.resource, d.playbackUrl = f, a.freeWheelService.getFreeWheelSyncingToken(g, b.session.fwSyncTokenUrl).then(function(a) {
                        if ("undefined" != typeof a && "" !== a && (d.playbackUrl = d.playbackUrl + "&_fw_syncing_token=" + a), c(d), !d.playbackUrl) throw new Error("There was an error starting playback.");
                        var b = i.hls + "?url=" + encodeURIComponent(d.playbackUrl) + "&name=" + encodeURIComponent(d.name) + "&guid=" + encodeURIComponent(d.guid) + "&network=" + encodeURIComponent(d.network) + "&description=" + encodeURIComponent(d.description) + "&imageHref=" + encodeURIComponent(d.imageHref) + "&indefinite=" + ("live" == d.type ? "true" : "false");
                        e ? (p.cancel(), atvutils.loadAndSwapURL(b)) : p.loadURL(b)
                    }), b
                }).fail(function(a) {
                    var b = a.message || "Not authorized.";
                    if (b.toLowerCase().indexOf("not authenticated") > -1) p.loadURL(i.providers + "?imageHref=" + encodeURIComponent(d.imageHref) + "&title=" + encodeURIComponent(d.name) + "&summary=" + encodeURIComponent(d.description));
                    else {
                        b = a.details || a.message || "Not authorized.", "noAuthz" == b && (b = "This channel is not part of your TV package.");
                        var c = i.error + "?title=Unable%20To%20Play%20Video&message=" + encodeURIComponent(b);
                        e ? (p.cancel(), atvutils.loadAndSwapURL(c)) : p.loadURL(c)
                    }
                }).done()
            }
        }, d.startRegistration = function(b, c) {
            var d = atv.localStorage["espn.routes"];
            c ? atv.sessionStorage["espn.regCodeProviderName"] = c : atv.sessionStorage.removeItem("espn.regCodeProviderName"), a.authenticator.generateRegCode().then(function(a) {
                var c = d.regCode;
                return b ? atvutils.loadAndSwapURL(c) : atvutils.loadURL(c), a
            }).done()
        }, d.deauthorize = function() {
            a.authorizer.deauthorize().done(function() {
                atv.exitApp()
            })
        }, a
    }(espn || {}, preroller),
    $ = $ || {};
$.ajax = espn.utils.qAjax, atv.onPageLoad = function(a) {
    "watchespn:appletv:authentication:code" == a && espn.page.pollRegCode(), "watchespn:appletv:settings" == a && espn.page.addDeactivateMenuItem()
}, atv.onPageUnload = function() {}, atv.onPageBuried = function() {}, atv.onPageExhumed = function() {};
var espn = function(a) {
    var b = 1e4,
        c = atv.localStorage["espn.routes"],
        d = a.page = a.page || {},
        e = function(a, b) {
            var c = atv.parseXML(a.serializeToString()),
                d = c.getElementById(b),
                e = d.getElementByTagName("stash"),
                f = e.childElements[0],
                g = a.rootElement.getElementByTagName("menu"),
                h = g.getElementByTagName("sections");
            return f ? (f.removeFromParent(), g.replaceChild(h, f)) : h.removeFromParent(), a
        },
        f = function(b, c, d) {
            return b = a.page.populateLogo(b), b = a.page.accessorize(b, c, d)
        };
    return d.addDeactivateMenuItem = function() {
        var b = atv.device.isInRetailDemoMode;
        if (!b) {
            var d, e = a.authenticator.isAuthenticated(),
                f = document.rootElement.getElementsByTagName("items")[0],
                g = document.getElementById("deactivate-item"),
                h = document.getElementById("activate-item");
            if (e && !g) {
                var i = a.authenticator.getProvider(),
                    j = c.deactivate;
                if (g = document.makeElementNamed("oneLineMenuItem"), g.setAttribute("id", "deactivate-item"), g.setAttribute("accessibilityLabel", "Sign Out"), g.setAttribute("onSelect", "atvutils.loadURL('" + j + "')"), d = document.makeElementNamed("label"), d.textContent = "Sign Out", g.appendChild(d), i && i.name) {
                    var k = document.makeElementNamed("rightLabel");
                    k.textContent = i.name.replace("&", "&amp;"), g.appendChild(k)
                }
                f.appendChild(g), h && h.removeFromParent()
            } else if (!e && !h) {
                var l = a.player.getEvent(),
                    m = l && l.imageHref || "http://assets.espn.go.com/prod/assets/watchespn/appletv/images/watchespn-640x360.png",
                    n = l && l.name || "WatchESPN";
                h = document.makeElementNamed("oneLineMenuItem"), h.setAttribute("id", "activate-item"), h.setAttribute("accessibilityLabel", "Verify Your TV Provider"), h.setAttribute("onSelect", "atvutils.loadURL('" + c.providers + "?imageHref=" + encodeURIComponent(m) + "&title=" + encodeURIComponent(n) + "');"), d = document.makeElementNamed("label"), d.textContent = "Verify Your TV Provider", h.appendChild(d), f.appendChild(h), g && g.removeFromParent()
            }
        }
    }, d.handleRefresh = function() {
        console.log("handleRefresh called", document.serializeToString())
    }, d.pollRegCode = function() {
        var d = a.authenticator.getRegCode();
        atv.setTimeout(function() {
            a.authenticator.checkRegCode(d).then(function() {
                var b = a.player.getEvent();
                if (b) a.player.play(b, !0);
                else {
                    var d = "Congratulations!",
                        e = "You have successfully verified your TV provider.",
                        f = c.error;
                    f = f + "?title=" + encodeURIComponent(d) + "&description=" + encodeURIComponent(e), atvutils.loadAndSwapURL(f)
                }
            }, function(b) {
                if (b && b.message && b.message.toLowerCase().indexOf("expired") > -1) {
                    var d = c.regCodeExpired;
                    return void atvutils.loadAndSwapURL(d)
                }
                a.page.pollRegCode()
            }).done()
        }, b)
    }, d.loadFirstTab = function(a, b) {
        a = f(a, b);
        var c = 0,
            d = a.rootElement.getElementsByTagName("navigation");
        if (d && d.length > 0) {
            var g = d[0].getAttribute("currentIndex");
            g && (c = g)
        }
        var h = a.rootElement.getElementsByTagName("navigationItem");
        if (h && h.length > 0) {
            var i = h[c].getAttribute("id");
            e(a, i)
        }
        return a
    }, d.loadFirstTabAndCombineSimulcasts = function(a) {
        return d.loadFirstTab(a, !0)
    }, d.handleNavigate = function(b) {
        var c = b && b.navigationItemId;
        if (c) {
            var e = document.getElementById(c).getElementByTagName("url").textContent;
            e = d.personalizeUrl(e), a.utils.qAjax({
                url: e,
                dataType: "xml"
            }).then(function(a) {
                ("featured" == c || "nav1" == c) && (a = f(a, !0, !1)), b.success(a)
            }, function() {
                b.failure("Navigation failed to load.")
            })
        }
    }, d.handleTab = function(a) {
        var b = a && a.navigationItemId;
        if (b) {
            e(document, b);
            var c = document.getElementById("nav");
            if (c) {
                var d = b.split("-"),
                    f = d.length > 1 && d[d.length - 1];
                c.setAttribute("currentIndex", f)
            }
        }
    }, d.populateLogo = function(b) {
        var c = b.getElementById("affiliateLogo");
        if (c) {
            var d = a.authenticator.isIpAuthenticated(),
                e = a.authenticator.isAuthenticated();
            if (e || d) {
                var f = a.authenticator.getUser(),
                    g = f && (f.apAffiliate || f.ipAffiliate),
                    h = g && g.imageHref;
                h && c.setAttribute("src", h)
            }
        }
        return b
    }, d.handleLockAccessories = function(b) {
        var c = a.authenticator.isAuthenticated(),
            d = b.rootElement.getElementsByTagName("lock");
        c && d && d.length > 0 && d.forEach(function(a) {
            a.removeFromParent()
        }), atv.loadAndSwapXML(b)
    }, d.handleVolatileReload = function() {
        var b = document,
            e = c.liveShelves;
        return (e = d.personalizeUrl(e)) ? void a.utils.qAjax({
            url: e,
            dataType: "xml"
        }).then(function(c) {
            b = a.page.populateLogo(b), c = a.page.accessorize(c, !0, !1);
            var d = b.getElementById("live-tv-shelf"),
                e = b.getElementById("espn3-shelf"),
                f = c.getElementById("live-tv-shelf"),
                g = c.getElementById("espn3-shelf");
            f && (f.removeFromParent(), d && d.parent && d.parent.replaceChild(d, f)), g && (g.removeFromParent(), e && e.parent && e.parent.replaceChild(e, g));
            var h = b.getElementById("trending-shelf-items"),
                i = c.getElementById("trending-shelf-items");
            if (i && h) i.childElements.forEach(function(a, b) {
                var c = h.childElements[b];
                a.removeFromParent(), h.replaceChild(c, a)
            });
            else if (!h) {
                var j = c.getElementById("trending-shelf"),
                    k = c.getElementById("trending-shelf-items"),
                    l = b.rootElement.getElementByTagName("items"),
                    m = l.childElements[0],
                    n = c.getElementById("trending-shelf-divider"),
                    o = atv.parseXML(b.serializeToString()),
                    p = o.getElementById("must-see-shelf-items"),
                    q = o.getElementById("best-of-shelf-items"),
                    r = null;
                if (j) {
                    if (p) {
                        var s = p.childElements[0];
                        s && (r = s.getElementByTagName("subtitle"), r.textContent = "Must See Moments", s.removeFromParent(), k.appendChild(s))
                    }
                    if (q) {
                        var t = q.childElements[0];
                        t && (r = t.getElementByTagName("subtitle"), r.textContent = "ESPN Presents", t.removeFromParent(), k.appendChild(t))
                    }
                    n.removeFromParent(), j.removeFromParent(), "showcase" == m.tagName ? (l.insertChildAfter(j, m), l.insertChildAfter(n, m)) : (l.insertChildBefore(n, m), l.insertChildBefore(j, m))
                }
            }
            atv.loadAndSwapXML(b)
        }, function() {
            atv.loadAndSwapXML(document)
        }) : void atv.loadAndSwapXML(b)
    }, d.accessorize = function(b, c, d) {
        var e = b.rootElement.getElementsByTagName("blackouts").length > 0 || b.rootElement.getElementsByTagName("simulcastEventId").length > 0;
        if (!e) return b;
        var f = a.authenticator.getUser(),
            g = {
                dma: a.authenticator.getUserDma(f),
                timezone: a.authenticator.getUserTimeZone(f),
                state: a.authenticator.getUserState(f),
                country: a.authenticator.getUserCountry(f)
            },
            h = atv.parseXML(b.serializeToString()),
            i = h.rootElement.getElementsByTagName("blackouts"),
            j = h.rootElement.getElementsByTagName("simulcastEventId"),
            k = [],
            l = [];
        [i, j].forEach(function(a) {
            a.forEach(function(a) {
                var b = a.parent,
                    c = b && b.getElementByTagName("id"),
                    d = c && c.textContent; - 1 == k.indexOf(d) && l.push(b), k.push(d)
            })
        }), d = d || !0;
        for (var m = 0; m < l.length; m++) {
            var n = l[m],
                o = n.getElementByTagName("blackouts"),
                p = n && n.getElementByTagName("id");
            if (p) {
                for (var q = p.textContent, r = n.getElementByTagName("networkCode").textContent, s = (n.getElementByTagName("type").textContent, o && o.childElements || []), t = "", u = 0; u < s.length; u++) {
                    var v = s[u],
                        w = v.getElementByTagName("type").textContent,
                        x = [];
                    v.getElementByTagName("detail").childElements && (x = v.getElementByTagName("detail").childElements);
                    var y, z = 0,
                        A = g[w];
                    for (z = 0, y = x.length; y > z; z++) {
                        var B = x[z];
                        if (B && A == B.textContent) {
                            t = "This event is subject to blackout.";
                            break
                        }
                    }
                    if ("" !== t) break
                }
                if (d && t) {
                    var C = b.getElementById(q + "-metadataValues"),
                        D = C && C.childElements[2];
                    D && (D.textContent = t)
                }
                if (c && "espn3" == r) {
                    var E = n.getElementByTagName("simulcastEventId");
                    if (E) {
                        var F = E.textContent,
                            G = b.getElementById(F);
                        if (G)
                            if (t) {
                                var H = b.getElementById(q);
                                H.removeFromParent()
                            } else G.removeFromParent()
                    }
                }
            }
        }
        return b
    }, d.personalizeUrl = function(b) {
        var c = a.authenticator.isAuthenticated(),
            d = a.authenticator.isIpAuthenticated(),
            e = a.authenticator.getUserTimeZone() || "America/New_York",
            f = -1 == b.indexOf("?") ? "?" : "&";
        return b = c ? b + f + "authnd=true&tz=" + encodeURIComponent(e) : d ? b + f + "authnd=ip&tz=" + encodeURIComponent(e) : b + f + "tz=" + encodeURIComponent(e)
    }, d.loadSportPage = function(b) {
        b = d.personalizeUrl(b), atvutils.loadURL({
            url: b,
            processXML: a.page.loadFirstTabAndCombineSimulcasts
        })
    }, d.loadChannelPage = function(b) {
        b = d.personalizeUrl(b), atvutils.loadURL({
            url: b,
            processXML: a.page.loadFirstTab
        })
    }, d.loadUrl = function(a) {
        a = d.personalizeUrl(a), atvutils.loadURL(a)
    }, d.loadMore = function(a, b, c) {
        c = c + "&navigationItemId=" + b, c = d.personalizeUrl(c);
        var f = document.getElementById(a),
            g = document.makeElementNamed("accessories");
        g.appendChild(document.makeElementNamed("spinner")), f.appendChild(g), e(document, b);
        var h = f.parent.parent,
            i = f.parent,
            j = i.parent,
            k = j.parent;
        $.ajax({
            url: c,
            dataType: "xml"
        }).then(function(a) {
            h.removeFromParent();
            var c = k.getElementsByTagName("menuSection"),
                d = c[c.length - 1],
                f = d.getElementByTagName("header").getElementByTagName("horizontalDivider").getElementByTagName("title").textContent,
                g = a.rootElement.getElementsByTagName("menuSection");
            g.forEach(function(a, b) {
                var c = a.getElementByTagName("header").getElementByTagName("horizontalDivider").getElementByTagName("title").textContent;
                if (0 == b && c == f) {
                    var e = a.getElementByTagName("items").childElements;
                    e.forEach(function(a) {
                        a.removeFromParent(), d.getElementByTagName("items").appendChild(a)
                    })
                } else a.removeFromParent(), k.appendChild(a)
            }), e(document, b)
        })
    }, a
}(espn || {});