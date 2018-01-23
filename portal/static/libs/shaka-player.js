(function() {
    var g = {};
    (function(window) {
        var k, aa = this;
        aa.Eb = !0;

        function m(a, b) {
            var c = a.split("."),
                d = aa;
            c[0] in d || !d.execScript || d.execScript("var " + c[0]);
            for (var e; c.length && (e = c.shift());) c.length || void 0 === b ? d[e] ? d = d[e] : d = d[e] = {} : d[e] = b
        }

        function ba(a) {
            var b = ca;

            function c() {}
            c.prototype = b.prototype;
            a.Ib = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.Fb = function(a, c, f) {
                return b.prototype[c].apply(a, Array.prototype.slice.call(arguments, 2))
            }
        };
        /*

         Copyright 2016 Google Inc.

         Licensed under the Apache License, Version 2.0 (the "License");
         you may not use this file except in compliance with the License.
         You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing, software
         distributed under the License is distributed on an "AS IS" BASIS,
         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         See the License for the specific language governing permissions and
         limitations under the License.
        */
        function da(a) {
            this.c = Math.exp(Math.log(.5) / a);
            this.a = this.b = 0
        }

        function ea(a, b, c) {
            var d = Math.pow(a.c, b);
            a.b = c * (1 - d) + d * a.b;
            a.a += b
        }

        function fa(a) {
            return a.b / (1 - Math.pow(a.c, a.a))
        };

        function ga() {
            this.a = new da(3);
            this.c = new da(10);
            this.b = 5E5
        }

        function ha(a) {
            return .5 > a.a.a ? a.b : Math.min(fa(a.a), fa(a.c))
        };

        function ia() {
            this.h = null;
            this.c = !1;
            this.b = new ga;
            this.g = {};
            this.a = {};
            this.i = !1;
            this.f = null
        }
        k = ia.prototype;
        k.stop = function() {
            this.h = null;
            this.c = !1;
            this.g = {};
            this.a = {};
            this.f = null
        };
        k.init = function(a) {
            this.h = a
        };
        k.chooseStreams = function(a) {
            this.g = a;
            this.a = {};
            return ja(this)
        };
        k.enable = function() {
            this.c = !0
        };
        k.disable = function() {
            this.c = !1
        };
        k.segmentDownloaded = function(a, b, c) {
            var d = this.b;
            a = b - a;
            65536 > c || (a = Math.max(a, 50), c = 8E3 * c / a, a /= 1E3, ea(d.a, a, c), ea(d.c, a, c));
            if (null != this.f && this.c) a: {
                d = Date.now() - this.f;
                if (!this.i) {
                    if (4E3 > d) break a;
                    this.i = !0
                } else if (8E3 > d) break a;
                d = this.a.audio;
                c = this.a.video;
                a = ja(this);
                a.audio == d && a.video == c || this.h(a)
            }
        };
        k.getBandwidthEstimate = function() {
            return ha(this.b)
        };
        k.setDefaultEstimate = function(a) {
            this.b.b = a
        };

        function ja(a) {
            var b = {},
                c;
            (c = a.g.audio) ? (c = ka(c), c = c[Math.floor(c.length / 2)]) : c = null;
            c && (b.audio = c, a.a.audio = c);
            if (c = a.g.video) {
                c = ka(c);
                for (var d = a.a.audio, d = d && d.bandwidth || 0, e = ha(a.b), f = c[0], g = 0; g < c.length; ++g) {
                    var h = c[g],
                        l = g + 1 < c.length ? c[g + 1] : {
                            bandwidth: Number.POSITIVE_INFINITY
                        };
                    h.bandwidth && (l = (l.bandwidth + d) / .85, e >= (h.bandwidth + d) / .95 && e <= l && (f = h))
                }
                c = f
            } else c = null;
            c && (b.video = c, a.a.video = c);
            a.f = Date.now();
            return b
        }

        function ka(a) {
            return a.streams.slice(0).sort(function(a, c) {
                return a.bandwidth - c.bandwidth
            })
        };
        var la = {},
            ma = {};
        m("shaka.media.ManifestParser.registerParserByExtension", function(a, b) {
            ma[a] = b
        });
        m("shaka.media.ManifestParser.registerParserByMime", function(a, b) {
            la[a] = b
        });

        function na() {
            var a = {
                    basic: !0
                },
                b;
            for (b in la) a[b] = !0;
            for (b in ma) a[b] = !0;
            ["application/dash+xml", "application/x-mpegurl", "application/vnd.apple.mpegurl", "application/vnd.ms-sstr+xml"].forEach(function(b) {
                a[b] = !!la[b]
            });
            ["mpd", "m3u8", "ism"].forEach(function(b) {
                a[b] = !!ma[b]
            });
            return a
        };

        function oa(a, b, c, d, e) {
            this.a = a;
            this.c = b;
            this.b = c;
            this.g = d;
            this.f = e
        }
        m("shaka.media.PresentationTimeline", oa);

        function p(a) {
            return null == a.c || a.b == Number.POSITIVE_INFINITY ? 0 : Math.max(0, pa(a) - a.b)
        }

        function pa(a) {
            return null == a.c ? a.a : Math.min(Math.max(0, (Date.now() + a.f) / 1E3 - a.g - a.c), a.a)
        };

        function qa(a, b, c) {
            this.uris = a;
            this.c = b;
            this.b = c
        }
        m("shaka.media.InitSegmentReference", qa);

        function v(a, b, c, d, e, f) {
            this.position = a;
            this.startTime = b;
            this.a = c;
            this.uris = d;
            this.c = e;
            this.b = f
        }
        m("shaka.media.SegmentReference", v);

        function ra(a, b) {
            if (!a) return 0;
            for (var c = 0; c < a.length; ++c)
                if (b + 1E-4 >= a.start(c) && b < a.end(c)) return a.end(c) - b;
            return 0
        };
        m("shaka.polyfill.installAll", function() {
            for (var a = 0; a < sa.length; ++a) sa[a]()
        });
        var sa = [];

        function ta(a) {
            sa.push(a)
        }
        m("shaka.polyfill.register", ta);

        function ua(a) {
            var b = a.type.replace(/^(webkit|moz|MS)/, "").toLowerCase(),
                b = new Event(b, a);
            a.target.dispatchEvent(b)
        }
        ta(function() {
            if (window.Document) {
                var a = Element.prototype;
                a.requestFullscreen = a.requestFullscreen || a.mozRequestFullScreen || a.msRequestFullscreen || a.webkitRequestFullscreen;
                a = Document.prototype;
                // a.exitFullscreen = a.exitFullscreen || a.mozCancelFullScreen || a.msExitFullscreen || a.webkitExitFullscreen;
                // "fullscreenElement" in document || Object.defineProperty(document, "fullscreenElement", {
                //     get: function() {
                //         return document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement
                //     }
                // });
                // document.addEventListener("webkitfullscreenchange",
                //     ua);
                // document.addEventListener("webkitfullscreenerror", ua);
                // document.addEventListener("mozfullscreenchange", ua);
                // document.addEventListener("mozfullscreenerror", ua);
                // document.addEventListener("MSFullscreenChange", ua);
                // document.addEventListener("MSFullscreenError", ua)
            }
        });

        function va() {
            return Promise.reject(Error("The key system specified is not supported."))
        }

        function wa(a) {
            return null == a ? Promise.resolve() : Promise.reject(Error("MediaKeys not supported."))
        }

        function xa() {
            throw new TypeError("Illegal constructor.");
        }
        xa.prototype.createSession = function() {};
        xa.prototype.setServerCertificate = function() {};

        function za() {
            throw new TypeError("Illegal constructor.");
        }
        za.prototype.getConfiguration = function() {};
        za.prototype.createMediaKeys = function() {};

        function w(a) {
            this.c = [];
            this.b = [];
            this.Y = Aa;
            if (a) try {
                a(this.N.bind(this), this.a.bind(this))
            } catch (b) {
                this.a(b)
            }
        }
        var Aa = 0;

        function Ba(a) {
            var b = new w;
            b.N(a);
            return b
        }

        function Ca(a) {
            var b = new w;
            b.a(a);
            return b
        }

        function Da(a) {
            function b(a, b, c) {
                a.Y == Aa && (e[b] = c, d++, d == e.length && a.N(e))
            }
            var c = new w;
            if (!a.length) return c.N([]), c;
            for (var d = 0, e = Array(a.length), f = c.a.bind(c), g = 0; g < a.length; ++g) a[g] && a[g].then ? a[g].then(b.bind(null, c, g), f) : b(c, g, a[g]);
            return c
        }

        function Ea(a) {
            for (var b = new w, c = b.N.bind(b), d = b.a.bind(b), e = 0; e < a.length; ++e) a[e] && a[e].then ? a[e].then(c, d) : c(a[e]);
            return b
        }
        w.prototype.then = function(a, b) {
            var c = new w;
            switch (this.Y) {
                case 1:
                    Fa(this, c, a);
                    break;
                case 2:
                    Fa(this, c, b);
                    break;
                case Aa:
                    this.c.push({
                        C: c,
                        ua: a
                    }), this.b.push({
                        C: c,
                        ua: b
                    })
            }
            return c
        };
        w.prototype.then = w.prototype.then;
        w.prototype["catch"] = function(a) {
            return this.then(void 0, a)
        };
        w.prototype["catch"] = w.prototype["catch"];
        w.prototype.N = function(a) {
            if (this.Y == Aa) {
                this.sa = a;
                this.Y = 1;
                for (a = 0; a < this.c.length; ++a) Fa(this, this.c[a].C, this.c[a].ua);
                this.c = [];
                this.b = []
            }
        };
        w.prototype.a = function(a) {
            if (this.Y == Aa) {
                this.sa = a;
                this.Y = 2;
                for (a = 0; a < this.b.length; ++a) Fa(this, this.b[a].C, this.b[a].ua);
                this.c = [];
                this.b = []
            }
        };

        function Fa(a, b, c) {
            Ga.push(function() {
                if (c && "function" == typeof c) {
                    try {
                        var a = c(this.sa)
                    } catch (f) {
                        b.a(f);
                        return
                    }
                    var e;
                    try {
                        e = a && a.then
                    } catch (f) {
                        b.a(f);
                        return
                    }
                    a instanceof w ? a == b ? b.a(new TypeError("Chaining cycle detected")) : a.then(b.N.bind(b), b.a.bind(b)) : e ? Ha(a, e, b) : b.N(a)
                } else 1 == this.Y ? b.N(this.sa) : b.a(this.sa)
            }.bind(a));
            null == Ia && (Ia = Ja(Ka))
        }

        function Ha(a, b, c) {
            try {
                var d = !1;
                b.call(a, function(a) {
                    if (!d) {
                        d = !0;
                        var b;
                        try {
                            b = a && a.then
                        } catch (g) {
                            c.a(g);
                            return
                        }
                        b ? Ha(a, b, c) : c.N(a)
                    }
                }, c.a.bind(c))
            } catch (e) {
                c.a(e)
            }
        }

        function Ka() {
            for (; Ga.length;) {
                null != Ia && (La(Ia), Ia = null);
                var a = Ga;
                Ga = [];
                for (var b = 0; b < a.length; ++b) a[b]()
            }
        }

        function Ja() {
            return 0
        }

        function La() {}
        var Ia = null,
            Ga = [];
        ta(function() {
            window.Promise || (window.Promise = w, window.Promise.resolve = Ba, window.Promise.reject = Ca, window.Promise.all = Da, window.Promise.race = Ea, window.setImmediate ? (Ja = function(a) {
                return window.setImmediate(a)
            }, La = function(a) {
                return window.clearImmediate(a)
            }) : (Ja = function(a) {
                return window.setTimeout(a, 0)
            }, La = function(a) {
                return window.clearTimeout(a)
            }))
        });

        function Ma() {
            return {
                droppedVideoFrames: this.webkitDroppedFrameCount,
                totalVideoFrames: this.webkitDecodedFrameCount,
                corruptedVideoFrames: 0,
                creationTime: NaN,
                totalFrameDelay: 0
            }
        }
        ta(function() {
            if (window.HTMLVideoElement) {
                var a = HTMLVideoElement.prototype;
                !a.getVideoPlaybackQuality && "webkitDroppedFrameCount" in a && (a.getVideoPlaybackQuality = Ma)
            }
        });

        function Na(a, b, c) {
            for (var d = 0; d < a.length; ++d)
                if (c(a[d], b)) return d;
            return -1
        };

        function x(a, b, c) {
            this.category = a;
            this.code = b;
            this.data = Array.prototype.slice.call(arguments, 2)
        }
        m("shaka.util.Error", x);
        x.prototype.toString = function() {
            return "shaka.util.Error " + JSON.stringify(this, null, "  ")
        };
        x.Category = {
            NETWORK: 1,
            TEXT: 2,
            MEDIA: 3,
            MANIFEST: 4,
            STREAMING: 5,
            DRM: 6
        };
        x.Code = {
            UNSUPPORTED_SCHEME: 1E3,
            BAD_HTTP_STATUS: 1001,
            HTTP_ERROR: 1002,
            TIMEOUT: 1003,
            MALFORMED_DATA_URI: 1004,
            UNKNOWN_DATA_URI_ENCODING: 1005,
            INVALID_TEXT_HEADER: 2E3,
            INVALID_TEXT_CUE: 2001,
            INVALID_TEXT_SETTINGS: 2002,
            UNABLE_TO_DETECT_ENCODING: 2003,
            BAD_ENCODING: 2004,
            BUFFER_READ_OUT_OF_BOUNDS: 3E3,
            JS_INTEGER_OVERFLOW: 3001,
            EBML_OVERFLOW: 3002,
            EBML_BAD_FLOATING_POINT_SIZE: 3003,
            MP4_SIDX_WRONG_BOX_TYPE: 3004,
            MP4_SIDX_INVALID_TIMESCALE: 3005,
            MP4_SIDX_TYPE_NOT_SUPPORTED: 3006,
            WEBM_CUES_ELEMENT_MISSING: 3007,
            WEBM_EBML_HEADER_ELEMENT_MISSING: 3008,
            WEBM_SEGMENT_ELEMENT_MISSING: 3009,
            WEBM_INFO_ELEMENT_MISSING: 3010,
            WEBM_DURATION_ELEMENT_MISSING: 3011,
            WEBM_CUE_TRACK_POSITIONS_ELEMENT_MISSING: 3012,
            WEBM_CUE_TIME_ELEMENT_MISSING: 3013,
            MEDIA_SOURCE_OPERATION_FAILED: 3014,
            MEDIA_SOURCE_OPERATION_THREW: 3015,
            VIDEO_ERROR: 3016,
            UNABLE_TO_GUESS_MANIFEST_TYPE: 4E3,
            DASH_INVALID_XML: 4001,
            DASH_NO_SEGMENT_INFO: 4002,
            DASH_EMPTY_ADAPTATION_SET: 4003,
            DASH_EMPTY_PERIOD: 4004,
            DASH_WEBM_MISSING_INIT: 4005,
            DASH_UNSUPPORTED_CONTAINER: 4006,
            DASH_PSSH_BAD_ENCODING: 4007,
            DASH_NO_COMMON_KEY_SYSTEM: 4008,
            DASH_MULTIPLE_KEY_IDS_NOT_SUPPORTED: 4009,
            DASH_CONFLICTING_KEY_IDS: 4010,
            UNPLAYABLE_PERIOD: 4011,
            INCONSISTENT_BUFFER_STATE: 5E3,
            INVALID_SEGMENT_INDEX: 5001,
            SEGMENT_DOES_NOT_EXIST: 5002,
            BAD_SEGMENT: 5004,
            INVALID_STREAMS_CHOSEN: 5005,
            NO_RECOGNIZED_KEY_SYSTEMS: 6E3,
            REQUESTED_KEY_SYSTEMS_UNAVAILABLE: 6001,
            FAILED_TO_CREATE_CDM: 6002,
            FAILED_TO_ATTACH_TO_VIDEO: 6003,
            INVALID_SERVER_CERTIFICATE: 6004,
            FAILED_TO_CREATE_SESSION: 6005,
            FAILED_TO_GENERATE_LICENSE_REQUEST: 6006,
            LICENSE_REQUEST_FAILED: 6007,
            LICENSE_RESPONSE_REJECTED: 6008,
            ENCRYPTED_CONTENT_WITHOUT_DRM_INFO: 6010
        };

        function Oa(a) {
            this.b = a;
            this.c = 0 == Pa;
            this.a = 0
        }
        var Pa = 1;

        function Qa(a) {
            return a.a < a.b.byteLength
        }

        function Ra(a) {
            try {
                var b = a.b.getUint8(a.a)
            } catch (c) {
                Sa()
            }
            a.a += 1;
            return b
        }

        function A(a) {
            try {
                var b = a.b.getUint32(a.a, a.c)
            } catch (c) {
                Sa()
            }
            a.a += 4;
            return b
        }

        function Ua(a) {
            var b, c;
            try {
                a.c ? (b = a.b.getUint32(a.a, !0), c = a.b.getUint32(a.a + 4, !0)) : (c = a.b.getUint32(a.a, !1), b = a.b.getUint32(a.a + 4, !1))
            } catch (d) {
                Sa()
            }
            if (2097151 < c) throw new x(3, 3001);
            a.a += 8;
            return c * Math.pow(2, 32) + b
        }

        function Va(a) {
            a.a + 16 > a.b.byteLength && Sa();
            var b = new Uint8Array(a.b.buffer, a.a, 16);
            a.a += 16;
            return b
        }

        function B(a, b) {
            a.a + b > a.b.byteLength && Sa();
            a.a += b
        }

        function Sa() {
            throw new x(3, 3E3);
        };

        function C(a) {
            this.b = a;
            this.a = new Oa(a);
            Wa || (Wa = [new Uint8Array([255]), new Uint8Array([127, 255]), new Uint8Array([63, 255, 255]), new Uint8Array([31, 255, 255, 255]), new Uint8Array([15, 255, 255, 255, 255]), new Uint8Array([7, 255, 255, 255, 255, 255]), new Uint8Array([3, 255, 255, 255, 255, 255, 255]), new Uint8Array([1, 255, 255, 255, 255, 255, 255, 255])])
        }
        var Wa;

        function D(a) {
            var b;
            b = Xa(a);
            if (7 < b.length) throw new x(3, 3002);
            for (var c = 0, d = 0; d < b.length; d++) c = 256 * c + b[d];
            b = c;
            c = Xa(a);
            a: {
                for (d = 0; d < Wa.length; d++)
                    if (E(c, Wa[d])) {
                        d = !0;
                        break a
                    }
                d = !1
            }
            if (d) c = a.b.byteLength - a.a.a;
            else {
                if (8 == c.length && c[1] & 224) throw new x(3, 3001);
                for (var d = c[0] & (1 << 8 - c.length) - 1, e = 1; e < c.length; e++) d = 256 * d + c[e];
                c = d
            }
            c = a.a.a + c <= a.b.byteLength ? c : a.b.byteLength - a.a.a;
            d = new DataView(a.b.buffer, a.b.byteOffset + a.a.a, c);
            B(a.a, c);
            return new Ya(b, d)
        }

        function Xa(a) {
            var b = Ra(a.a),
                c;
            for (c = 1; 8 >= c && !(b & 1 << 8 - c); c++);
            if (8 < c) throw new x(3, 3002);
            var d = new Uint8Array(c);
            d[0] = b;
            for (b = 1; b < c; b++) d[b] = Ra(a.a);
            return d
        }

        function Ya(a, b) {
            this.id = a;
            this.a = b
        }

        function Za(a) {
            if (8 < a.a.byteLength) throw new x(3, 3002);
            if (8 == a.a.byteLength && a.a.getUint8(0) & 224) throw new x(3, 3001);
            for (var b = 0, c = 0; c < a.a.byteLength; c++) var d = a.a.getUint8(c),
                b = 256 * b + d;
            return b
        };

        function F(a, b) {
            var c = b || {},
                d;
            for (d in c) this[d] = c[d];
            this.defaultPrevented = this.cancelable = this.bubbles = !1;
            this.timeStamp = window.performance ? window.performance.now() : Date.now();
            this.type = a;
            this.isTrusted = !1;
            this.target = this.currentTarget = null;
            this.a = !1
        }
        F.prototype.preventDefault = function() {};
        F.prototype.stopImmediatePropagation = function() {
            this.a = !0
        };
        F.prototype.stopPropagation = function() {};

        function $a(a, b) {
            return a.reduce(function(a, b, e) {
                return b["catch"](a.bind(null, e))
            }.bind(null, b), Promise.reject())
        }

        function ab(a, b) {
            return a.concat(b)
        }

        function G() {}

        function H(a) {
            return null != a
        }

        function bb(a) {
            return function(b) {
                return b != a
            }
        };

        function I(a) {
            this.a = a
        }
        m("shaka.media.SegmentIndex", I);
        I.prototype.u = function() {
            this.a = null;
            return Promise.resolve()
        };
        I.prototype.b = function(a) {
            for (var b = this.a.length - 1; 0 <= b; --b) {
                var c = this.a[b];
                if (a >= c.startTime && a < c.a) return c.position
            }
            return null
        };
        I.prototype.get = function(a) {
            if (0 == this.a.length) return null;
            a -= this.a[0].position;
            return 0 > a || a >= this.a.length ? null : this.a[a]
        };

        function cb(a, b) {
            for (var c = [], d = 0, e = 0; d < a.a.length && e < b.length;) {
                var f = a.a[d],
                    g = b[e];
                f.startTime < g.startTime ? (c.push(f), d++) : (f.startTime > g.startTime || (f.a != g.a ? c.push(g) : c.push(f), d++), e++)
            }
            for (; d < a.a.length;) c.push(a.a[d++]);
            if (c.length)
                for (d = c[c.length - 1].position + 1; e < b.length;) g = b[e++], g = new v(d++, g.startTime, g.a, g.uris, g.c, g.b), c.push(g);
            else c = b;
            a.a = c
        }

        function db(a, b) {
            for (var c = 0; c < a.a.length && !(a.a[c].a > b); ++c);
            a.a.splice(0, c)
        };

        function eb(a, b) {
            this.g = fb[b];
            this.c = a;
            this.h = 0;
            this.f = Number.POSITIVE_INFINITY;
            this.a = this.b = null
        }
        var fb = {};
        m("shaka.media.TextEngine.registerParser", function(a, b) {
            fb[a] = b
        });
        m("shaka.media.TextEngine.unregisterParser", function(a) {
            delete fb[a]
        });
        eb.prototype.u = function() {
            this.c && gb(this, function() {
                return !0
            });
            this.c = this.g = null;
            return Promise.resolve()
        };

        function hb(a, b, c, d) {
            var e = a.h;
            c += e;
            d += e;
            return Promise.resolve().then(function() {
                for (var a = this.g(b), g = 0; g < a.length; ++g) {
                    a[g].startTime += e;
                    a[g].endTime += e;
                    if (a[g].startTime >= this.f) break;
                    this.c.addCue(a[g])
                }
                null == this.b && (this.b = c);
                this.a = Math.min(d, this.f)
            }.bind(a))
        }

        function ib(a, b, c) {
            return Promise.resolve().then(function() {
                gb(this, function(a) {
                    return a.startTime >= c || a.endTime <= b ? !1 : !0
                });
                null == this.b || c <= this.b || b >= this.a || (b <= this.b && c >= this.a ? this.b = this.a = null : b <= this.b && c < this.a ? this.b = c : b > this.b && c >= this.a && (this.a = b))
            }.bind(a))
        }

        function jb(a, b) {
            return null == a.a || a.a < b || b < a.b ? 0 : a.a - b
        }

        function gb(a, b) {
            for (var c = a.c.cues, d = [], e = 0; e < c.length; ++e) b(c[e]) && d.push(c[e]);
            for (e = 0; e < d.length; ++e) a.c.removeCue(d[e])
        };

        function kb(a) {
            a = a.toLowerCase().split("-");
            var b = lb[a[0]];
            b && (a[0] = b);
            return a.join("-")
        }
        var lb = {
            aar: "aa",
            abk: "ab",
            afr: "af",
            aka: "ak",
            alb: "sq",
            amh: "am",
            ara: "ar",
            arg: "an",
            arm: "hy",
            asm: "as",
            ava: "av",
            ave: "ae",
            aym: "ay",
            aze: "az",
            bak: "ba",
            bam: "bm",
            baq: "eu",
            bel: "be",
            ben: "bn",
            bih: "bh",
            bis: "bi",
            bod: "bo",
            bos: "bs",
            bre: "br",
            bul: "bg",
            bur: "my",
            cat: "ca",
            ces: "cs",
            cha: "ch",
            che: "ce",
            chi: "zh",
            chu: "cu",
            chv: "cv",
            cor: "kw",
            cos: "co",
            cre: "cr",
            cym: "cy",
            cze: "cs",
            dan: "da",
            deu: "de",
            div: "dv",
            dut: "nl",
            dzo: "dz",
            ell: "el",
            eng: "en",
            epo: "eo",
            est: "et",
            eus: "eu",
            ewe: "ee",
            fao: "fo",
            fas: "fa",
            fij: "fj",
            fin: "fi",
            fra: "fr",
            fre: "fr",
            fry: "fy",
            ful: "ff",
            geo: "ka",
            ger: "de",
            gla: "gd",
            gle: "ga",
            glg: "gl",
            glv: "gv",
            gre: "el",
            grn: "gn",
            guj: "gu",
            hat: "ht",
            hau: "ha",
            heb: "he",
            her: "hz",
            hin: "hi",
            hmo: "ho",
            hrv: "hr",
            hun: "hu",
            hye: "hy",
            ibo: "ig",
            ice: "is",
            ido: "io",
            iii: "ii",
            iku: "iu",
            ile: "ie",
            ina: "ia",
            ind: "id",
            ipk: "ik",
            isl: "is",
            ita: "it",
            jav: "jv",
            jpn: "ja",
            kal: "kl",
            kan: "kn",
            kas: "ks",
            kat: "ka",
            kau: "kr",
            kaz: "kk",
            khm: "km",
            kik: "ki",
            kin: "rw",
            kir: "ky",
            kom: "kv",
            kon: "kg",
            kor: "ko",
            kua: "kj",
            kur: "ku",
            lao: "lo",
            lat: "la",
            lav: "lv",
            lim: "li",
            lin: "ln",
            lit: "lt",
            ltz: "lb",
            lub: "lu",
            lug: "lg",
            mac: "mk",
            mah: "mh",
            mal: "ml",
            mao: "mi",
            mar: "mr",
            may: "ms",
            mkd: "mk",
            mlg: "mg",
            mlt: "mt",
            mon: "mn",
            mri: "mi",
            msa: "ms",
            mya: "my",
            nau: "na",
            nav: "nv",
            nbl: "nr",
            nde: "nd",
            ndo: "ng",
            nep: "ne",
            nld: "nl",
            nno: "nn",
            nob: "nb",
            nor: "no",
            nya: "ny",
            oci: "oc",
            oji: "oj",
            ori: "or",
            orm: "om",
            oss: "os",
            pan: "pa",
            per: "fa",
            pli: "pi",
            pol: "pl",
            por: "pt",
            pus: "ps",
            que: "qu",
            roh: "rm",
            ron: "ro",
            rum: "ro",
            run: "rn",
            rus: "ru",
            sag: "sg",
            san: "sa",
            sin: "si",
            slk: "sk",
            slo: "sk",
            slv: "sl",
            sme: "se",
            smo: "sm",
            sna: "sn",
            snd: "sd",
            som: "so",
            sot: "st",
            spa: "es",
            sqi: "sq",
            srd: "sc",
            srp: "sr",
            ssw: "ss",
            sun: "su",
            swa: "sw",
            swe: "sv",
            tah: "ty",
            tam: "ta",
            tat: "tt",
            tel: "te",
            tgk: "tg",
            tgl: "tl",
            tha: "th",
            tib: "bo",
            tir: "ti",
            ton: "to",
            tsn: "tn",
            tso: "ts",
            tuk: "tk",
            tur: "tr",
            twi: "tw",
            uig: "ug",
            ukr: "uk",
            urd: "ur",
            uzb: "uz",
            ven: "ve",
            vie: "vi",
            vol: "vo",
            wel: "cy",
            wln: "wa",
            wol: "wo",
            xho: "xh",
            yid: "yi",
            yor: "yo",
            zha: "za",
            zho: "zh",
            zul: "zu"
        };

        function K(a) {
            return Object.keys(a).map(function(b) {
                return a[b]
            })
        }

        function mb(a, b) {
            return Object.keys(a).reduce(function(c, d) {
                c[d] = b(a[d], d);
                return c
            }, {})
        };

        function L() {
            this.a = {}
        }
        L.prototype.push = function(a, b) {
            this.a.hasOwnProperty(a) ? this.a[a].push(b) : this.a[a] = [b]
        };
        L.prototype.get = function(a) {
            return (a = this.a[a]) ? a.slice() : null
        };

        function nb(a, b, c) {
            if (a = a.a[b])
                for (b = 0; b < a.length; ++b) a[b] == c && (a.splice(b, 1), --b)
        }
        L.prototype.keys = function() {
            var a = [],
                b;
            for (b in this.a) a.push(b);
            return a
        };

        function M() {
            this.a = new L
        }
        M.prototype.u = function() {
            ob(this);
            this.a = null;
            return Promise.resolve()
        };

        function N(a, b, c, d) {
            b = new pb(b, c, d);
            a.a.push(c, b)
        }
        M.prototype.ea = function(a, b) {
            for (var c = this.a.get(b) || [], d = 0; d < c.length; ++d) {
                var e = c[d];
                e.target == a && (e.ea(), nb(this.a, b, e))
            }
        };

        function ob(a) {
            var b = a.a,
                c = [],
                d;
            for (d in b.a) c.push.apply(c, b.a[d]);
            for (b = 0; b < c.length; ++b) c[b].ea();
            a.a.a = {}
        }

        function pb(a, b, c) {
            this.target = a;
            this.type = b;
            this.a = c;
            this.target.addEventListener(b, c, !1)
        }
        pb.prototype.ea = function() {
            this.target && (this.target.removeEventListener(this.type, this.a, !1), this.a = this.target = null)
        };

        function qb(a, b, c, d, e, f) {
            this.a = a;
            this.b = b;
            this.l = c;
            this.g = e;
            this.m = f;
            this.c = new M;
            this.f = !1;
            this.h = 0;
            null == d && (d = b.a < Number.POSITIVE_INFINITY ? p(b) : Math.max(pa(b) - c, p(b)));
            this.o = d;
            0 < a.readyState ? this.i() : N(this.c, a, "loadedmetadata", this.i.bind(this))
        }
        qb.prototype.u = function() {
            var a = this.c.u();
            this.m = this.g = this.b = this.a = this.c = null;
            return a
        };

        function rb(a) {
            return sb(a, 0 < a.a.readyState ? a.a.currentTime : a.o)
        }

        function tb(a, b) {
            b && !a.f ? (a.h = a.a.playbackRate, a.a.playbackRate = 0, a.f = !0, a.g(!0)) : !b && a.f && (0 == a.a.playbackRate && (a.a.playbackRate = a.h), a.f = !1, a.g(!1))
        }
        qb.prototype.i = function() {
            this.c.ea(this.a, "loadedmetadata");
            N(this.c, this.a, "seeking", this.v.bind(this));
            var a = sb(this, this.o);
            this.a.currentTime != a && (this.a.currentTime = a)
        };
        qb.prototype.v = function() {
            var a = this.a.currentTime,
                b = ub(this, a);
            if (b != a) {
                this.a.currentTime = b;
                var c = 0,
                    d = function() {
                        !this.a || 10 <= c++ || this.a.currentTime != a || (this.a.currentTime = b, setTimeout(d, 100))
                    }.bind(this);
                setTimeout(d, 100)
            } else this.m()
        };

        function ub(a, b) {
            var c = a.b.b,
                d = p(a.b),
                e = pa(a.b);
            if (!(null != c && c < Number.POSITIVE_INFINITY)) return b < d ? d : b > e ? e : b;
            c = d + 1;
            d = c + a.l;
            return b >= d && b <= e || 0 != ra(a.a.buffered, b) && b >= c && b <= e ? b : b > e ? e : e < d && b >= c && b <= e ? b : Math.min(d + 2, e)
        }

        function sb(a, b) {
            var c = p(a.b);
            if (b < c) return c;
            c = pa(a.b);
            return b > c ? c : b
        };

        function ca() {
            this.v = new L
        }
        ca.prototype.addEventListener = function(a, b) {
            this.v.push(a, b)
        };
        ca.prototype.removeEventListener = function(a, b) {
            nb(this.v, a, b)
        };
        ca.prototype.dispatchEvent = function(a) {
            for (var b = this.v.get(a.type) || [], c = 0; c < b.length; ++c) {
                a.target = this;
                a.currentTarget = this;
                var d = b[c];
                try {
                    d.handleEvent ? d.handleEvent(a) : d.call(this, a)
                } catch (e) {}
                if (a.a) break
            }
            return a.defaultPrevented
        };

        function O() {
            var a, b, c = new Promise(function(c, e) {
                a = c;
                b = e
            });
            c.resolve = a;
            c.reject = b;
            return c
        };

        function vb(a, b, c) {
            this.i = a;
            this.f = b;
            this.l = c;
            this.c = {};
            this.b = null;
            this.a = {};
            this.g = new M;
            this.h = !1
        }

        function wb() {
            var a = {
                    basic: !!window.MediaSource
                },
                b = navigator.vendor,
                c = navigator.appVersion;
            b && 0 <= b.indexOf("Apple") && c && 0 <= c.indexOf("Version/8") && (a.basic = !1);
            a.basic && 'video/mp4; codecs="avc1.42E01E",audio/mp4; codecs="mp4a.40.2",video/webm; codecs="vp8",video/webm; codecs="vp9",audio/webm; codecs="vorbis",audio/webm; codecs="opus",video/mp2t; codecs="avc1.42E01E",video/mp2t; codecs="mp4a.40.2",text/vtt,application/mp4; codecs="wvtt",application/ttml+xml,application/mp4; codecs="stpp"'.split(",").forEach(function(b) {
                a[b] = !!fb[b] ||
                    MediaSource.isTypeSupported(b);
                var c = b.split(";")[0];
                a[c] = a[c] || a[b]
            });
            return a
        }
        k = vb.prototype;
        k.u = function() {
            this.h = !0;
            var a = [],
                b;
            for (b in this.a) {
                var c = this.a[b],
                    d = c[0];
                this.a[b] = c.slice(0, 1);
                d && a.push(d.p["catch"](G));
                for (d = 1; d < c.length; ++d) c[d].p["catch"](G), c[d].p.reject()
            }
            this.b && a.push(this.b.u());
            return Promise.all(a).then(function() {
                this.g.u();
                this.b = this.l = this.f = this.i = this.g = null;
                this.c = {};
                this.a = {}
            }.bind(this))
        };
        k.init = function(a) {
            for (var b in a) {
                var c = a[b];
                "text" == b ? this.b = new eb(this.l, c) : (c = this.f.addSourceBuffer(c), N(this.g, c, "error", this.zb.bind(this, b)), N(this.g, c, "updateend", this.za.bind(this, b)), this.c[b] = c, this.a[b] = [])
            }
        };

        function xb(a, b) {
            var c;
            c = "text" == b ? a.b.b : (c = a.c[b].buffered) ? c.length ? c.start(0) : null : null;
            return c
        }

        function yb(a, b, c, d) {
            "text" == b ? (b = jb(a.b, c), !b && d && (b = jb(a.b, c + d)) && (b += d)) : (a = a.c[b].buffered, b = ra(a, c), !b && d && (b = ra(a, c + d)) && (b += d));
            return b
        }

        function zb(a, b, c, d, e) {
            return "text" == b ? hb(a.b, c, d, e) : Ab(a, b, a.yb.bind(a, b, c))
        }

        function Bb(a, b) {
            return "text" == b ? ib(a.b, 0, Number.POSITIVE_INFINITY) : Ab(a, b, a.Ha.bind(a, b, 0, a.f.duration))
        }

        function Cb(a, b, c) {
            return "text" == b ? (a.b.h = c, Promise.resolve()) : Ab(a, b, a.rb.bind(a, b, c))
        }

        function Db(a, b, c) {
            return "text" == b ? (a.b.f = c, Promise.resolve()) : Ab(a, b, a.pb.bind(a, b, c))
        }
        k.endOfStream = function(a) {
            return Fb(this, function() {
                a ? this.f.endOfStream(a) : this.f.endOfStream()
            }.bind(this))
        };

        function Gb(a, b) {
            Fb(a, function() {
                this.f.duration = b
            }.bind(a))
        }
        k.yb = function(a, b) {
            this.c[a].appendBuffer(b)
        };
        k.Ha = function(a, b, c) {
            this.c[a].remove(b, c)
        };
        k.rb = function(a, b) {
            this.c[a].timestampOffset = b;
            this.za(a)
        };
        k.pb = function(a, b) {
            this.c[a].appendWindowEnd = b + 1 / 15;
            this.za(a)
        };
        k.zb = function(a) {
            this.a[a][0].p.reject(new x(3, 3014, this.i.error ? this.i.error.code : 0))
        };
        k.za = function(a) {
            this.a[a][0].p.resolve();
            Hb(this, a)
        };

        function Ab(a, b, c) {
            if (a.h) return Promise.reject();
            c = {
                start: c,
                p: new O
            };
            a.a[b].push(c);
            if (1 == a.a[b].length) try {
                c.start()
            } catch (d) {
                c.p.reject(new x(3, 3015, d)), Hb(a, b)
            }
            return c.p
        }

        function Fb(a, b) {
            if (a.h) return Promise.reject();
            var c = [],
                d;
            for (d in a.c) {
                var e = new O,
                    f = {
                        start: function(a) {
                            a.resolve()
                        }.bind(null, e),
                        p: e
                    };
                a.a[d].push(f);
                c.push(e);
                1 == a.a[d].length && f.start()
            }
            return Promise.all(c).then(function() {
                var a, c;
                try {
                    b()
                } catch (d) {
                    c = Promise.reject(new x(3, 3015, d))
                }
                for (a in this.c) Hb(this, a);
                return c
            }.bind(a), function() {
                return Promise.reject()
            }.bind(a))
        }

        function Hb(a, b) {
            a.a[b].shift();
            var c = a.a[b][0];
            if (c) try {
                c.start()
            } catch (d) {
                c.p.reject(new x(3, 3015, d)), Hb(a, b)
            }
        };

        function Ib(a) {
            if (!a) return "";
            a = String.fromCharCode.apply(null, new Uint8Array(a));
            a = escape(a);
            try {
                return decodeURIComponent(a)
            } catch (b) {
                throw new x(2, 2004);
            }
        }

        function Jb(a, b) {
            if (!a) return "";
            if (0 != a.byteLength % 2) throw new x(2, 2004);
            var c;
            if (a instanceof ArrayBuffer) c = a;
            else {
                var d = new Uint8Array(a.byteLength);
                d.set(new Uint8Array(a));
                c = d.buffer
            }
            var d = [],
                e = a.byteLength / 2;
            c = new DataView(c);
            for (var f = 0; f < e; f++) d[f] = c.getUint16(2 * f, b);
            return String.fromCharCode.apply(null, d)
        }

        function Kb(a) {
            var b = new Uint8Array(a);
            if (239 == b[0] && 187 == b[1] && 191 == b[2]) return Ib(b.subarray(3));
            if (254 == b[0] && 255 == b[1]) return Jb(b.subarray(2), !1);
            if (255 == b[0] && 254 == b[1]) return Jb(b.subarray(2), !0);
            var c = function(a, b) {
                return a.byteLength <= b || 32 <= a[b] && 126 >= a[b]
            }.bind(null, b);
            if (0 == b[0] && 0 == b[2]) return Jb(a, !1);
            if (0 == b[1] && 0 == b[3]) return Jb(a, !0);
            if (c(0) && c(1) && c(2) && c(3)) return Ib(a);
            throw new x(2, 2003);
        }

        function Lb(a) {
            a = unescape(encodeURIComponent(a));
            for (var b = new Uint8Array(a.length), c = 0; c < a.length; ++c) b[c] = a.charCodeAt(c);
            return b.buffer
        };

        function Mb(a) {
            this.b = a;
            this.a = 0
        }

        function Nb(a, b) {
            var c;
            b.lastIndex = a.a;
            c = b.exec(a.b);
            c = null == c ? null : {
                position: c.index,
                length: c[0].length,
                nb: c
            };
            if (a.a == a.b.length || null == c || c.position != a.a) return null;
            a.a += c.length;
            return c.nb
        }

        function Ob(a) {
            return a.a == a.b.length ? null : (a = Nb(a, /[^ \t\n]*/gm)) ? a[0] : null
        };

        function P(a) {
            a = Kb(a);
            a = a.replace(/\r\n|\r(?=[^\n]|$)/gm, "\n");
            a = a.split(/\n{2,}/m);
            if (!/^WEBVTT($|[ \t\n])/m.test(a[0])) throw new x(2, 2E3);
            for (var b = [], c = 1; c < a.length; c++) {
                var d = P.b(a[c].split("\n"));
                d && b.push(d)
            }
            return b
        }
        P.b = function(a) {
            if (1 == a.length && !a[0] || /^NOTE($|[ \t])/.test(a[0])) return null;
            var b = null;
            0 > a[0].indexOf("--\x3e") && (b = a[0], a.splice(0, 1));
            var c = new Mb(a[0]),
                d = P.a(c),
                e = Nb(c, /[ \t]+--\x3e[ \t]+/g),
                f = P.a(c);
            if (null == d || null == e || null == f) throw new x(2, 2001);
            a = a.slice(1).join("\n");
            if (window.VTTCue)
                for (d = new VTTCue(d, f, a), Nb(c, /[ \t]+/gm), f = Ob(c); f;) {
                    if (!P.c(d, f)) throw new x(2, 2002);
                    Nb(c, /[ \t]+/gm);
                    f = Ob(c)
                } else d = new TextTrackCue(d, f, a);
            null != b && (d.id = b);
            return d
        };
        P.c = function(a, b) {
            var c = null;
            if (c = /^align:(start|middle|end)$/.exec(b)) a.align = c[1];
            else if (c = /^vertical:(lr|rl)$/.exec(b)) a.c = c[1];
            else if (c = /^size:(\d{1,2}|100)%$/.exec(b)) a.size = Number(c[1]);
            else if (c = /^position:(\d{1,2}|100)%$/.exec(b)) a.position = Number(c[1]);
            else if (c = /^line:(\d{1,2}|100)%$/.exec(b)) a.b = !1, a.a = Number(c[1]);
            else if (c = /^line:(-?\d+)$/.exec(b)) a.b = !0, a.a = Number(c[1]);
            else return !1;
            return !0
        };
        P.a = function(a) {
            a = Nb(a, /(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})/g);
            if (null == a) return null;
            var b = Number(a[2]),
                c = Number(a[3]);
            return 59 < b || 59 < c ? null : Number(a[4]) / 1E3 + c + 60 * b + 3600 * (Number(a[1]) || 0)
        };
        fb["text/vtt"] = P;

        function Pb(a) {
            return window.btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/, "")
        }

        function Qb(a) {
            a = window.atob(a.replace(/-/g, "+").replace(/_/g, "/"));
            for (var b = new Uint8Array(a.length), c = 0; c < a.length; ++c) b[c] = a.charCodeAt(c);
            return b
        }

        function Rb(a) {
            for (var b = new Uint8Array(a.length / 2), c = 0; c < a.length; c += 2) b[c / 2] = window.parseInt(a.substr(c, 2), 16);
            return b
        }

        function Sb(a) {
            for (var b = "", c = 0; c < a.length; ++c) {
                var d = a[c].toString(16);
                1 == d.length && (d = "0" + d);
                b += d
            }
            return b
        }

        function E(a, b) {
            if (!a && !b) return !0;
            if (!a || !b || a.length != b.length) return !1;
            for (var c = 0; c < a.length; ++c)
                if (a[c] != b[c]) return !1;
            return !0
        };

        function Tb(a, b, c) {
            this.h = "";
            this.m = [];
            this.l = this.g = null;
            this.o = !1;
            this.f = new M;
            this.v = "";
            this.a = [];
            this.B = a;
            this.c = null;
            this.i = b;
            this.G = c;
            this.b = !1
        }
        k = Tb.prototype;
        k.u = function() {
            this.b = !0;
            this.a.forEach(function(a) {
                a.Aa.close()["catch"](G)
            });
            var a = [];
            this.f && a.push(this.f.u());
            this.l && a.push(this.l.setMediaKeys(null)["catch"](G));
            this.m = [];
            this.f = this.l = this.g = null;
            this.a = [];
            this.i = this.c = this.B = null;
            return Promise.all(a)
        };
        k.configure = function(a) {
            this.c = a
        };
        k.init = function(a, b) {
            var c = {},
                d = [];
            Ub(this, a, b, c, d);
            return d.length ? Vb(this, c, d) : (this.o = !0, Promise.resolve())
        };

        function Wb(a, b) {
            if (!a.g) return N(a.f, b, "encrypted", function() {
                this.f.ea(b, "encrypted");
                this.i(new x(6, 6010))
            }.bind(a)), Promise.resolve();
            var c = [],
                d = [],
                e = [];
            Xb(a, c, d, e);
            a.v = c[0];
            a.l = b;
            var c = a.l.setMediaKeys(a.g),
                c = c["catch"](function(a) {
                    return Promise.reject(new x(6, 6003, a.message))
                }),
                f = null;
            d.length && (f = a.g.setServerCertificate(d[0]), f = f["catch"](function(a) {
                return Promise.reject(new x(6, 6004, a.message))
            }));
            return Promise.all([c, f]).then(function() {
                if (this.b) return Promise.reject();
                e.length ? e.forEach(function(a) {
                    Yb(this,
                        a.initDataType, a.initData)
                }.bind(this)) : N(this.f, this.l, "encrypted", this.Wa.bind(this))
            }.bind(a))["catch"](function(a) {
                return this.b ? Promise.resolve() : Promise.reject(a)
            }.bind(a))
        }
        k.keySystem = function() {
            return this.h
        };

        function Ub(a, b, c, d, e) {
            var f = Zb(a);
            b.periods.forEach(function(a) {
                a.streamSets.forEach(function(a) {
                    "text" != a.type && (f && (a.drmInfos = [f]), a.drmInfos.forEach(function(b) {
                        $b(this, b);
                        var f = d[b.keySystem];
                        f || (f = {
                            initDataTypes: void 0,
                            audioCapabilities: [],
                            videoCapabilities: [],
                            distinctiveIdentifier: "optional",
                            persistentState: c ? "required" : "optional",
                            sessionTypes: [c ? "persistent-license" : "temporary"],
                            label: b.keySystem,
                            mimeTypes: {},
                            drmInfos: []
                        }, d[b.keySystem] = f, e.push(b.keySystem));
                        f.drmInfos.push(b);
                        b.distinctiveIdentifierRequired &&
                            (f.distinctiveIdentifier = "required");
                        b.persistentStateRequired && (f.persistentState = "required");
                        var g = "video" == a.type ? f.videoCapabilities : f.audioCapabilities,
                            t = ("video" == a.type ? b.videoRobustness : b.audioRobustness) || "";
                        a.streams.forEach(function(a) {
                            a = a.mimeType;
                            f.mimeTypes[a] || (g.push({
                                robustness: t,
                                contentType: a
                            }), f.mimeTypes[a] = !0)
                        }.bind(this))
                    }.bind(this)))
                }.bind(this))
            }.bind(a))
        }

        function Vb(a, b, c) {
            var d = new O,
                e = d;
            if (1 == c.length && "" == c[0]) return Promise.reject(new x(6, 6E3));
            c.forEach(function(a) {
                var c = b[a];
                c.drmInfos.some(function(a) {
                    return !!a.licenseServerUri
                }) && (0 == c.audioCapabilities.length && (c.audioCapabilities = void 0), 0 == c.videoCapabilities.length && (c.videoCapabilities = void 0), e = e["catch"](function() {
                    return this.b ? Promise.reject() : navigator.requestMediaKeySystemAccess(a, [c])
                }.bind(this)))
            }.bind(a));
            e = e["catch"](function() {
                return Promise.reject(new x(6, 6001))
            });
            e = e.then(function(a) {
                if (this.b) return Promise.reject();
                this.m = b[a.keySystem].drmInfos;
                this.h = a.keySystem;
                return a.createMediaKeys()
            }.bind(a)).then(function(a) {
                if (this.b) return Promise.reject();
                this.g = a;
                this.o = !0
            }.bind(a))["catch"](function(a) {
                if (this.b) return Promise.resolve();
                if (a instanceof x) return Promise.reject(a);
                this.h = "";
                this.m = [];
                return Promise.reject(new x(6, 6002, a.message))
            }.bind(a));
            d.reject();
            return e
        }

        function $b(a, b) {
            var c = b.keySystem;
            if (c) {
                if (!b.licenseServerUri) {
                    var d = a.c.servers[c];
                    d && (b.licenseServerUri = d)
                }
                if (c = a.c.advanced[c]) b.distinctiveIdentifierRequired || (b.distinctiveIdentifierRequired = c.distinctiveIdentifierRequired), b.persistentStateRequired || (b.persistentStateRequired = c.persistentStateRequired), b.videoRobustness || (b.videoRobustness = c.videoRobustness), b.audioRobustness || (b.audioRobustness = c.audioRobustness), b.serverCertificate || (b.serverCertificate = c.serverCertificate)
            }
        }

        function Zb(a) {
            var b = a.c.clearKeys;
            if (!b || 0 == Object.keys(b).length) return null;
            var c = [],
                b = [],
                d;
            for (d in a.c.clearKeys) {
                var e = a.c.clearKeys[d],
                    f = Rb(d),
                    e = Rb(e),
                    f = {
                        kty: "oct",
                        kid: Pb(f),
                        k: Pb(e)
                    };
                c.push(f);
                b.push(f.kid)
            }
            a = JSON.stringify({
                keys: c
            });
            b = JSON.stringify({
                kids: b
            });
            b = [{
                initData: new Uint8Array(Lb(b)),
                initDataType: "keyids"
            }];
            return {
                keySystem: "org.w3.clearkey",
                licenseServerUri: "data:application/json;base64," + window.btoa(a),
                distinctiveIdentifierRequired: !1,
                persistentStateRequired: !1,
                audioRobustness: "",
                videoRobustness: "",
                serverCertificate: null,
                initData: b
            }
        }

        function Xb(a, b, c, d) {
            function e(a, b) {
                return a.initDataType == b.initDataType && E(a.initData, b.initData)
            }
            a.m.forEach(function(a) {
                -1 == b.indexOf(a.licenseServerUri) && b.push(a.licenseServerUri);
                a.serverCertificate && -1 == Na(c, a.serverCertificate, E) && c.push(a.serverCertificate);
                a.initData && a.initData.forEach(function(a) {
                    -1 == Na(d, a, e) && d.push(a)
                })
            })
        }
        k.Wa = function(a) {
            for (var b = new Uint8Array(a.initData), c = 0; c < this.a.length; ++c)
                if (E(b, this.a[c].initData)) return;
            Yb(this, a.initDataType, b)
        };

        function Yb(a, b, c) {
            var d;
            try {
                d = a.g.createSession()
            } catch (e) {
                a.i(new x(6, 6005, e.message));
                return
            }
            N(a.f, d, "message", a.ab.bind(a));
            N(a.f, d, "keystatuseschange", a.Xa.bind(a));
            b = d.generateRequest(b, c.buffer);
            a.a.push({
                initData: c,
                Aa: d
            });
            b["catch"](function(a) {
                if (!this.b) {
                    for (var b = 0; b < this.a.length; ++b)
                        if (this.a[b].Aa == d) {
                            this.a.splice(b, 1);
                            break
                        }
                    this.i(new x(6, 6006, a.message))
                }
            }.bind(a))
        }
        k.ab = function(a) {
            var b = a.target,
                c = ac,
                d = bc([this.v], this.c.retryParameters);
            d.body = a.message;
            d.method = "POST";
            "com.microsoft.playready" == this.h && cc(d);
            this.B.request(c, d).then(function(a) {
                return this.b ? Promise.reject() : b.update(a.data)
            }.bind(this), function(a) {
                if (this.b) return Promise.resolve();
                this.i(new x(6, 6007, a))
            }.bind(this))["catch"](function(a) {
                if (this.b) return Promise.resolve();
                this.i(new x(6, 6008, a.message))
            }.bind(this))
        };

        function cc(a) {
            for (var b = Jb(a.body, !0), b = (new DOMParser).parseFromString(b, "application/xml"), c = b.getElementsByTagName("HttpHeader"), d = 0; d < c.length; ++d) a.headers[c[d].querySelector("name").textContent] = c[d].querySelector("value").textContent;
            a.body = Qb(b.querySelector("Challenge").textContent).buffer
        }
        k.Xa = function(a) {
            a = a.target;
            var b = {};
            a.keyStatuses.forEach(function(a, c) {
                if ("string" == typeof a) {
                    var f = a;
                    a = c;
                    c = f
                }
                if ("com.microsoft.playready" == this.h && 16 == a.byteLength) {
                    var f = new DataView(a),
                        g = f.getUint32(0, !0),
                        h = f.getUint16(4, !0),
                        l = f.getUint16(6, !0);
                    f.setUint32(0, g, !1);
                    f.setUint16(4, h, !1);
                    f.setUint16(6, l, !1)
                }
                "com.microsoft.playready" == this.h && "status-pending" == c && (c = "usable");
                f = Sb(new Uint8Array(a));
                b[f] = c
            }.bind(this));
            if (a.expiration < Date.now()) {
                for (var c = 0; c < this.a.length; ++c)
                    if (this.a[c].Aa == a) {
                        this.a.splice(c,
                            1);
                        break
                    }
                a.close()
            }
            this.G(b)
        };

        function dc() {
            var a = {
                    basic: !!window.MediaKeys && !!window.navigator && !!window.navigator.requestMediaKeySystemAccess && !!window.MediaKeySystemAccess && !!window.MediaKeySystemAccess.prototype.getConfiguration
                },
                b = [];
            a.basic && "org.w3.clearkey com.widevine.alpha com.microsoft.playready com.apple.fps.2_0 com.apple.fps.1_0 com.apple.fps com.adobe.primetime".split(" ").forEach(function(c) {
                var d = navigator.requestMediaKeySystemAccess(c, [{}]).then(function() {
                    a[c] = !0
                }, function() {
                    a[c] = !1
                });
                b.push(d)
            });
            return Promise.all(b).then(function() {
                return a
            })
        };

        function ec(a, b) {
            try {
                var c = new fc(a, b);
                return Promise.resolve(c)
            } catch (d) {
                return Promise.reject(d)
            }
        }

        function gc(a) {
            var b = this.mediaKeys;
            b && b != a && hc(b, null);
            delete this.mediaKeys;
            (this.mediaKeys = a) && hc(a, this);
            return Promise.resolve()
        }

        function fc(a, b) {
            this.a = this.keySystem = a;
            var c = !0;
            "org.w3.clearkey" == a && (this.a = "webkit-org.w3.clearkey", c = !1);
            var d = !1,
                e;
            e = document.getElementsByTagName("video");
            e = e.length ? e[0] : document.createElement("video");
            for (var f = 0; f < b.length; ++f) {
                var g = b[f],
                    h = {
                        audioCapabilities: [],
                        videoCapabilities: [],
                        persistentState: "optional",
                        distinctiveIdentifier: "optional",
                        initDataTypes: g.initDataTypes,
                        sessionTypes: ["temporary"],
                        label: g.label
                    },
                    l = !1;
                if (g.audioCapabilities)
                    for (var n = 0; n < g.audioCapabilities.length; ++n) {
                        var q =
                            g.audioCapabilities[n];
                        q.contentType && (l = !0, e.canPlayType(q.contentType.split(";")[0], this.a) && (h.audioCapabilities.push(q), d = !0))
                    }
                if (g.videoCapabilities)
                    for (n = 0; n < g.videoCapabilities.length; ++n) q = g.videoCapabilities[n], q.contentType && (l = !0, e.canPlayType(q.contentType, this.a) && (h.videoCapabilities.push(q), d = !0));
                l || (d = e.canPlayType("video/mp4", this.a) || e.canPlayType("video/webm", this.a));
                "required" == g.persistentState && (c ? (h.persistentState = "required", h.sessionTypes = ["persistent-license"]) : d = !1);
                if (d) {
                    this.b =
                        h;
                    return
                }
            }
            c = "Unsupported keySystem";
            if ("org.w3.clearkey" == a || "com.widevine.alpha" == a) c = "None of the requested configurations were supported.";
            c = Error(c);
            c.name = "NotSupportedError";
            c.code = DOMException.NOT_SUPPORTED_ERR;
            throw c;
        }
        fc.prototype.createMediaKeys = function() {
            var a = new ic(this.a);
            return Promise.resolve(a)
        };
        fc.prototype.getConfiguration = function() {
            return this.b
        };

        function ic(a) {
            this.g = a;
            this.b = null;
            this.a = new M;
            this.c = [];
            this.f = {}
        }

        function hc(a, b) {
            a.b = b;
            ob(a.a);
            b && (N(a.a, b, "webkitneedkey", a.gb.bind(a)), N(a.a, b, "webkitkeymessage", a.fb.bind(a)), N(a.a, b, "webkitkeyadded", a.cb.bind(a)), N(a.a, b, "webkitkeyerror", a.eb.bind(a)))
        }
        k = ic.prototype;
        k.createSession = function(a) {
            var b = a || "temporary";
            if ("temporary" != b && "persistent-license" != b) throw new TypeError("Session type " + a + " is unsupported on this platform.");
            a = this.b || document.createElement("video");
            a.src || (a.src = "about:blank");
            b = new jc(a, this.g, b);
            this.c.push(b);
            return b
        };
        k.setServerCertificate = function() {
            return Promise.reject(Error("setServerCertificate not supported on this platform."))
        };
        k.gb = function(a) {
            this.b.dispatchEvent(new F("encrypted", {
                initDataType: "webm",
                initData: a.initData
            }))
        };
        k.fb = function(a) {
            var b = kc(this, a.sessionId);
            b && (a = new F("message", {
                messageType: void 0 == b.keyStatuses.wa() ? "licenserequest" : "licenserenewal",
                message: a.message
            }), b.b && (b.b.resolve(), b.b = null), b.dispatchEvent(a))
        };
        k.cb = function(a) {
            if (a = kc(this, a.sessionId)) lc(a, "usable"), a.a && a.a.resolve(), a.a = null
        };
        k.eb = function(a) {
            var b = kc(this, a.sessionId);
            if (b) {
                var c = Error("EME v0.1b key error");
                c.errorCode = a.errorCode;
                c.errorCode.systemCode = a.systemCode;
                !a.sessionId && b.b ? (c.method = "generateRequest", 45 == a.systemCode && (c.message = "Unsupported session type."), b.b.reject(c), b.b = null) : a.sessionId && b.a ? (c.method = "update", b.a.reject(c), b.a = null) : (c = a.systemCode, a.errorCode.code == MediaKeyError.MEDIA_KEYERR_OUTPUT ? lc(b, "output-restricted") : 1 == c ? lc(b, "expired") : lc(b, "internal-error"))
            }
        };

        function kc(a, b) {
            var c = a.f[b];
            return c ? c : (c = a.c.shift()) ? (c.sessionId = b, a.f[b] = c) : null
        }

        function jc(a, b, c) {
            this.v = new L;
            this.f = a;
            this.h = !1;
            this.a = this.b = null;
            this.c = b;
            this.g = c;
            this.sessionId = "";
            this.expiration = NaN;
            this.closed = new O;
            this.keyStatuses = new mc
        }
        ba(jc);

        function nc(a, b, c) {
            if (a.h) return Promise.reject(Error("The session is already initialized."));
            a.h = !0;
            var d;
            try {
                if ("persistent-license" == a.g)
                    if (c) d = new Uint8Array(Lb("LOAD_SESSION|" + c));
                    else {
                        var e = Lb("PERSISTENT|"),
                            f = new Uint8Array(e.byteLength + b.byteLength);
                        f.set(new Uint8Array(e), 0);
                        f.set(new Uint8Array(b), e.byteLength);
                        d = f
                    } else d = new Uint8Array(b)
            } catch (g) {
                return Promise.reject(g)
            }
            a.b = new O;
            try {
                a.f.webkitGenerateKeyRequest(a.c, d)
            } catch (g) {
                if ("InvalidStateError" != g.name) return a.b = null, Promise.reject(g);
                setTimeout(function() {
                    try {
                        this.f.webkitGenerateKeyRequest(this.c, d)
                    } catch (a) {
                        this.b.reject(a), this.b = null
                    }
                }.bind(a), 10)
            }
            return a.b
        }
        k = jc.prototype;
        k.Da = function(a, b) {
            if (this.a) this.a.then(this.Da.bind(this, a, b))["catch"](this.Da.bind(this, a, b));
            else {
                this.a = a;
                var c, d;
                "webkit-org.w3.clearkey" == this.c ? (c = Ib(b), d = JSON.parse(c), "oct" != d.keys[0].kty && (this.a.reject(Error("Response is not a valid JSON Web Key Set.")), this.a = null), c = Qb(d.keys[0].k), d = Qb(d.keys[0].kid)) : (c = new Uint8Array(b), d = null);
                try {
                    this.f.webkitAddKey(this.c, c, d, this.sessionId)
                } catch (e) {
                    this.a.reject(e), this.a = null
                }
            }
        };

        function lc(a, b) {
            a.keyStatuses.Ba(b);
            a.dispatchEvent(new F("keystatuseschange"))
        }
        k.generateRequest = function(a, b) {
            return nc(this, b, null)
        };
        k.load = function(a) {
            return "persistent-license" == this.g ? nc(this, null, a) : Promise.reject(Error("Not a persistent session."))
        };
        k.update = function(a) {
            var b = new O;
            this.Da(b, a);
            return b
        };
        k.close = function() {
            if ("persistent-license" != this.g) {
                if (!this.sessionId) return this.closed.reject(Error("The session is not callable.")), this.closed;
                this.f.webkitCancelKeyRequest(this.c, this.sessionId)
            }
            this.closed.resolve();
            return this.closed
        };
        k.remove = function() {
            return "persistent-license" != this.g ? Promise.reject(Error("Not a persistent session.")) : this.close()
        };

        function mc() {
            this.size = 0;
            this.a = void 0
        }
        var oc;
        k = mc.prototype;
        k.Ba = function(a) {
            this.size = void 0 == a ? 0 : 1;
            this.a = a
        };
        k.wa = function() {
            return this.a
        };
        k.forEach = function(a) {
            this.a && a(oc, this.a)
        };
        k.get = function(a) {
            if (this.has(a)) return this.a
        };
        k.has = function(a) {
            var b = oc;
            return this.a && E(new Uint8Array(a), new Uint8Array(b)) ? !0 : !1
        };

        function pc(a) {
            this.systemIds = [];
            this.cencKeyIds = [];
            this.a = [];
            for (a = new Oa(new DataView(a.buffer)); Qa(a);) {
                var b = a.a,
                    c = A(a),
                    d = A(a);
                1 == c ? c = Ua(a) : 0 == c && (c = a.b.byteLength - b);
                if (1886614376 != d) B(a, c - (a.a - b));
                else {
                    var e = Ra(a);
                    if (1 < e) B(a, c - (a.a - b));
                    else {
                        B(a, 3);
                        var d = Sb(Va(a)),
                            f = [];
                        if (0 < e)
                            for (var e = A(a), g = 0; g < e; ++g) {
                                var h = Sb(Va(a));
                                f.push(h)
                            }
                        e = A(a);
                        B(a, e);
                        this.cencKeyIds.push.apply(this.cencKeyIds, f);
                        this.systemIds.push(d);
                        this.a.push({
                            start: b,
                            end: a.a - 1
                        });
                        a.a != b + c && B(a, c - (a.a - b))
                    }
                }
            }
        };

        function qc(a, b) {
            try {
                var c = new rc(a, b);
                return Promise.resolve(c)
            } catch (d) {
                return Promise.reject(d)
            }
        }

        function rc(a, b) {
            this.keySystem = a;
            for (var c = !1, d = 0; d < b.length; ++d) {
                var e = b[d],
                    f = {
                        audioCapabilities: [],
                        videoCapabilities: [],
                        persistentState: "optional",
                        distinctiveIdentifier: "optional",
                        initDataTypes: e.initDataTypes,
                        sessionTypes: ["temporary"],
                        label: e.label
                    },
                    g = !1;
                if (e.audioCapabilities)
                    for (var h = 0; h < e.audioCapabilities.length; ++h) {
                        var l = e.audioCapabilities[h];
                        if (l.contentType) {
                            var g = !0,
                                n = l.contentType.split(";")[0];
                            MSMediaKeys.isTypeSupported(this.keySystem, n) && (f.audioCapabilities.push(l), c = !0)
                        }
                    }
                if (e.videoCapabilities)
                    for (h =
                        0; h < e.videoCapabilities.length; ++h) l = e.videoCapabilities[h], l.contentType && (g = !0, n = l.contentType.split(";")[0], MSMediaKeys.isTypeSupported(this.keySystem, n) && (f.videoCapabilities.push(l), c = !0));
                g || (c = MSMediaKeys.isTypeSupported(this.keySystem, "video/mp4"));
                "required" == e.persistentState && (f.persistentState = "required", f.sessionTypes = ["persistent-license"]);
                if (c) {
                    this.a = f;
                    return
                }
            }
            c = Error("Unsupported keySystem");
            c.name = "NotSupportedError";
            c.code = DOMException.NOT_SUPPORTED_ERR;
            throw c;
        }
        rc.prototype.createMediaKeys = function() {
            var a = new sc(this.keySystem);
            return Promise.resolve(a)
        };
        rc.prototype.getConfiguration = function() {
            return this.a
        };

        function tc(a) {
            var b = this.mediaKeys;
            b && b != a && uc(b, null);
            delete this.mediaKeys;
            return (this.mediaKeys = a) ? uc(a, this) : Promise.resolve()
        }

        function sc(a) {
            this.a = new MSMediaKeys(a);
            this.b = new M
        }
        sc.prototype.createSession = function(a) {
            if ("temporary" != (a || "temporary")) throw new TypeError("Session type " + a + " is unsupported on this platform.");
            return new vc(this.a)
        };
        sc.prototype.setServerCertificate = function() {
            return Promise.reject(Error("setServerCertificate not supported on this platform."))
        };

        function uc(a, b) {
            function c() {
                b.msSetMediaKeys(d.a);
                b.removeEventListener("loadedmetadata", c)
            }
            ob(a.b);
            if (!b) return Promise.resolve();
            N(a.b, b, "msneedkey", wc);
            var d = a;
            try {
                return 1 <= b.readyState ? b.msSetMediaKeys(a.a) : b.addEventListener("loadedmetadata", c), Promise.resolve()
            } catch (e) {
                return Promise.reject(e)
            }
        }

        function vc(a) {
            this.v = new L;
            this.c = null;
            this.g = a;
            this.b = this.a = null;
            this.f = new M;
            this.sessionId = "";
            this.expiration = NaN;
            this.closed = new O;
            this.keyStatuses = new xc
        }
        ba(vc);
        k = vc.prototype;
        k.generateRequest = function(a, b) {
            this.a = new O;
            try {
                this.c = this.g.createSession("video/mp4", new Uint8Array(b), null), N(this.f, this.c, "mskeymessage", this.$a.bind(this)), N(this.f, this.c, "mskeyadded", this.Ya.bind(this)), N(this.f, this.c, "mskeyerror", this.Za.bind(this)), yc(this, "status-pending")
            } catch (c) {
                this.a.reject(c)
            }
            return this.a
        };
        k.load = function() {
            return Promise.reject(Error("MediaKeySession.load not yet supported"))
        };
        k.update = function(a) {
            this.b = new O;
            try {
                this.c.update(new Uint8Array(a))
            } catch (b) {
                this.b.reject(b)
            }
            return this.b
        };
        k.close = function() {
            try {
                this.c.close(), this.closed.resolve(), ob(this.f)
            } catch (a) {
                this.closed.reject(a)
            }
            return this.closed
        };
        k.remove = function() {
            return Promise.reject(Error("MediaKeySession.remove is only applicable for persistent licenses, which are not supported on this platform"))
        };

        function wc(a) {
            var b = document.createEvent("CustomEvent");
            b.initCustomEvent("encrypted", !1, !1, null);
            b.initDataType = "cenc";
            if (a = a.initData) {
                var c = new pc(a);
                if (!(1 >= c.a.length)) {
                    for (var d = [], e = 0; e < c.a.length; e++) d.push(a.subarray(c.a[e].start, c.a[e].end + 1));
                    e = zc;
                    a = [];
                    for (c = 0; c < d.length; ++c) {
                        for (var f = !1, g = 0; g < a.length && !(f = e ? e(d[c], a[g]) : d[c] === a[g]); ++g);
                        f || a.push(d[c])
                    }
                    for (e = d = 0; e < a.length; e++) d += a[e].length;
                    d = new Uint8Array(d);
                    for (e = c = 0; e < a.length; e++) d.set(a[e], c), c += a[e].length;
                    a = d
                }
            }
            b.initData =
                a;
            this.dispatchEvent(b)
        }

        function zc(a, b) {
            return E(a, b)
        }
        k.$a = function(a) {
            this.a && (this.a.resolve(), this.a = null);
            this.dispatchEvent(new F("message", {
                messageType: void 0 == this.keyStatuses.wa() ? "licenserequest" : "licenserenewal",
                message: a.message.buffer
            }))
        };
        k.Ya = function() {
            this.a ? (yc(this, "usable"), this.a.resolve(), this.a = null) : this.b && (yc(this, "usable"), this.b.resolve(), this.b = null)
        };
        k.Za = function() {
            var a = Error("EME v20140218 key error");
            a.errorCode = this.c.error;
            if (null != this.a) this.a.reject(a), this.a = null;
            else if (null != this.b) this.b.reject(a), this.b = null;
            else switch (this.c.error.code) {
                case MSMediaKeyError.MS_MEDIA_KEYERR_OUTPUT:
                case MSMediaKeyError.MS_MEDIA_KEYERR_HARDWARECHANGE:
                    yc(this, "output-not-allowed");
                default:
                    yc(this, "internal-error")
            }
        };

        function yc(a, b) {
            a.keyStatuses.Ba(b);
            a.dispatchEvent(new F("keystatuseschange"))
        }

        function xc() {
            this.size = 0;
            this.a = void 0
        }
        var Ac;
        k = xc.prototype;
        k.Ba = function(a) {
            this.size = void 0 == a ? 0 : 1;
            this.a = a
        };
        k.wa = function() {
            return this.a
        };
        k.forEach = function(a) {
            this.a && a(Ac, this.a)
        };
        k.get = function(a) {
            if (this.has(a)) return this.a
        };
        k.has = function(a) {
            var b = Ac;
            return this.a && E(new Uint8Array(a), new Uint8Array(b)) ? !0 : !1
        };
        ta(function() {
            !window.HTMLVideoElement || navigator.requestMediaKeySystemAccess && MediaKeySystemAccess.prototype.getConfiguration || (HTMLMediaElement.prototype.webkitGenerateKeyRequest ? (oc = (new Uint8Array([0])).buffer, navigator.requestMediaKeySystemAccess = ec, delete HTMLMediaElement.prototype.mediaKeys, HTMLMediaElement.prototype.mediaKeys = null, HTMLMediaElement.prototype.setMediaKeys = gc, window.MediaKeys = ic, window.MediaKeySystemAccess = fc) : window.MSMediaKeys ? (Ac = (new Uint8Array([0])).buffer, delete HTMLMediaElement.prototype.mediaKeys,
                HTMLMediaElement.prototype.mediaKeys = null, HTMLMediaElement.prototype.setMediaKeys = tc, window.MediaKeys = sc, window.MediaKeySystemAccess = rc, navigator.requestMediaKeySystemAccess = qc) : (navigator.requestMediaKeySystemAccess = va, delete HTMLMediaElement.prototype.mediaKeys, HTMLMediaElement.prototype.mediaKeys = null, HTMLMediaElement.prototype.setMediaKeys = wa, window.MediaKeys = xa, window.MediaKeySystemAccess = za))
        });

        function Bc(a, b) {
            var c = Q(a, b);
            return 1 != c.length ? null : c[0]
        }

        function Q(a, b) {
            return Array.prototype.filter.call(a.childNodes, function(a) {
                return a.tagName == b
            })
        }

        function Dc(a) {
            return (a = a.firstChild) && a.nodeType == Node.TEXT_NODE ? a.nodeValue.trim() : null
        }

        function R(a, b, c, d) {
            var e = null;
            a = a.getAttribute(b);
            null != a && (e = c(a));
            return null == e ? void 0 !== d ? d : null : e
        }

        function Ec(a) {
            if (!a) return null;
            a = Date.parse(a);
            return isNaN(a) ? null : Math.floor(a / 1E3)
        }

        function S(a) {
            if (!a) return null;
            a = /^P(?:([0-9]*)Y)?(?:([0-9]*)M)?(?:([0-9]*)D)?(?:T(?:([0-9]*)H)?(?:([0-9]*)M)?(?:([0-9.]*)S)?)?$/.exec(a);
            if (!a) return null;
            a = 31536E3 * Number(a[1] || null) + 2592E3 * Number(a[2] || null) + 86400 * Number(a[3] || null) + 3600 * Number(a[4] || null) + 60 * Number(a[5] || null) + Number(a[6] || null);
            return isFinite(a) ? a : null
        }

        function Gc(a) {
            var b = /([0-9]+)-([0-9]+)/.exec(a);
            if (!b) return null;
            a = Number(b[1]);
            if (!isFinite(a)) return null;
            b = Number(b[2]);
            return isFinite(b) ? {
                start: a,
                end: b
            } : null
        }

        function Hc(a) {
            a = Number(a);
            return 0 === a % 1 ? a : null
        }

        function Ic(a) {
            a = Number(a);
            return 0 === a % 1 && 0 < a ? a : null
        }

        function Jc(a) {
            a = Number(a);
            return 0 === a % 1 && 0 <= a ? a : null
        };
        var Kc = {
            "urn:uuid:1077efec-c0b2-4d02-ace3-3c1e52e2fb4b": "org.w3.clearkey",
            "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed": "com.widevine.alpha",
            "urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95": "com.microsoft.playready",
            "urn:uuid:f239e769-efa3-4850-9c16-a903c6932efb": "com.adobe.primetime"
        };

        function Lc(a, b) {
            var c = Mc(a),
                d = null,
                e = c.filter(function(a) {
                    return "urn:mpeg:dash:mp4protection:2011" == a.Ia ? (d = a.init || d, !1) : !0
                }),
                f = c.map(function(a) {
                    return a.keyId
                }).filter(H),
                g = null;
            if (0 < f.length && (g = f[0], f.some(bb(g)))) throw new x(4, 4010);
            f = [];
            0 < e.length ? (f = Nc(d, b, e), 0 == f.length && (f = [Oc("", d)])) : 0 < c.length && (f = K(Kc).map(function(a) {
                return Oc(a, d)
            }));
            return {
                Fa: g,
                Hb: d,
                drmInfos: f,
                Ga: !0
            }
        }

        function Pc(a, b, c) {
            var d = Lc(a, b);
            if (c.Ga) {
                a = 1 == c.drmInfos.length && !c.drmInfos[0].keySystem;
                b = 0 == d.drmInfos.length;
                if (0 == c.drmInfos.length || a && !b) c.drmInfos = d.drmInfos;
                c.Ga = !1
            } else if (0 < d.drmInfos.length && (c.drmInfos = c.drmInfos.filter(function(a) {
                    return d.drmInfos.some(function(b) {
                        return b.keySystem == a.keySystem
                    })
                }), 0 == c.drmInfos.length)) throw new x(4, 4008);
            return d.Fa || c.Fa
        }

        function Oc(a, b) {
            return {
                keySystem: a,
                licenseServerUri: "",
                distinctiveIdentifierRequired: !1,
                persistentStateRequired: !1,
                audioRobustness: "",
                videoRobustness: "",
                serverCertificate: null,
                initData: b || []
            }
        }

        function Nc(a, b, c) {
            return c.map(function(c) {
                var e = Kc[c.Ia];
                return e ? [Oc(e, c.init || a)] : b(c.node) || []
            }).reduce(ab, [])
        }

        function Mc(a) {
            return a.map(function(a) {
                var c = a.getAttribute("schemeIdUri"),
                    d = a.getAttribute("cenc:default_KID"),
                    e = Q(a, "cenc:pssh").map(Dc);
                if (!c) return null;
                c = c.toLowerCase();
                if (d && (d = d.replace(/-/g, "").toLowerCase(), 0 <= d.indexOf(" "))) throw new x(4, 4009);
                var f = [];
                try {
                    f = e.map(function(a) {
                        return {
                            initDataType: "cenc",
                            initData: Qb(a)
                        }
                    })
                } catch (g) {
                    throw new x(4, 4007);
                }
                return {
                    node: a,
                    Ia: c,
                    keyId: d,
                    init: 0 < f.length ? f : null
                }
            }).filter(H)
        };
        var Qc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;

        function T(a) {
            var b;
            a instanceof T ? (Rc(this, a.I), this.Z = a.Z, this.K = a.K, Sc(this, a.ca), this.F = a.F, Tc(this, Uc(a.a)), this.V = a.V) : a && (b = String(a).match(Qc)) ? (Rc(this, b[1] || "", !0), this.Z = Vc(b[2] || ""), this.K = Vc(b[3] || "", !0), Sc(this, b[4]), this.F = Vc(b[5] || "", !0), Tc(this, b[6] || "", !0), this.V = Vc(b[7] || "")) : this.a = new U(null)
        }
        k = T.prototype;
        k.I = "";
        k.Z = "";
        k.K = "";
        k.ca = null;
        k.F = "";
        k.V = "";
        k.toString = function() {
            var a = [],
                b = this.I;
            b && a.push(Wc(b, Xc, !0), ":");
            if (b = this.K) {
                a.push("//");
                var c = this.Z;
                c && a.push(Wc(c, Xc, !0), "@");
                a.push(encodeURIComponent(b).replace(/%25([0-9a-fA-F]{2})/g, "%$1"));
                b = this.ca;
                null != b && a.push(":", String(b))
            }
            if (b = this.F) this.K && "/" != b.charAt(0) && a.push("/"), a.push(Wc(b, "/" == b.charAt(0) ? Yc : Zc, !0));
            (b = this.a.toString()) && a.push("?", b);
            (b = this.V) && a.push("#", Wc(b, $c));
            return a.join("")
        };
        k.resolve = function(a) {
            var b = new T(this);
            "data" === b.I && (b = new T);
            var c = !!a.I;
            c ? Rc(b, a.I) : c = !!a.Z;
            c ? b.Z = a.Z : c = !!a.K;
            c ? b.K = a.K : c = null != a.ca;
            var d = a.F;
            if (c) Sc(b, a.ca);
            else if (c = !!a.F) {
                if ("/" != d.charAt(0))
                    if (this.K && !this.F) d = "/" + d;
                    else {
                        var e = b.F.lastIndexOf("/"); - 1 != e && (d = b.F.substr(0, e + 1) + d)
                    }
                if (".." == d || "." == d) d = "";
                else if (-1 != d.indexOf("./") || -1 != d.indexOf("/.")) {
                    for (var e = 0 == d.lastIndexOf("/", 0), d = d.split("/"), f = [], g = 0; g < d.length;) {
                        var h = d[g++];
                        "." == h ? e && g == d.length && f.push("") : ".." == h ? ((1 < f.length ||
                            1 == f.length && "" != f[0]) && f.pop(), e && g == d.length && f.push("")) : (f.push(h), e = !0)
                    }
                    d = f.join("/")
                }
            }
            c ? b.F = d : c = "" !== a.a.toString();
            c ? Tc(b, Uc(a.a)) : c = !!a.V;
            c && (b.V = a.V);
            return b
        };

        function Rc(a, b, c) {
            a.I = c ? Vc(b, !0) : b;
            a.I && (a.I = a.I.replace(/:$/, ""))
        }

        function Sc(a, b) {
            if (b) {
                b = Number(b);
                if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
                a.ca = b
            } else a.ca = null
        }

        function ad(a) {
            return a.F
        }

        function Tc(a, b, c) {
            b instanceof U ? a.a = b : (c || (b = Wc(b, bd)), a.a = new U(b))
        }

        function Vc(a, b) {
            return a ? b ? decodeURI(a) : decodeURIComponent(a) : ""
        }

        function Wc(a, b, c) {
            return "string" == typeof a ? (a = encodeURI(a).replace(b, cd), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
        }

        function cd(a) {
            a = a.charCodeAt(0);
            return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
        }
        var Xc = /[#\/\?@]/g,
            Zc = /[\#\?:]/g,
            Yc = /[\#\?]/g,
            bd = /[\#\?@]/g,
            $c = /#/g;

        function U(a) {
            this.b = a || null
        }
        U.prototype.a = null;
        U.prototype.c = null;
        U.prototype.toString = function() {
            if (this.b) return this.b;
            if (!this.a) return "";
            var a = [],
                b;
            for (b in this.a)
                for (var c = encodeURIComponent(b), d = this.a[b], e = 0; e < d.length; e++) {
                    var f = c;
                    "" !== d[e] && (f += "=" + encodeURIComponent(d[e]));
                    a.push(f)
                }
            return this.b = a.join("&")
        };

        function Uc(a) {
            var b = new U;
            b.b = a.b;
            if (a.a) {
                var c = {},
                    d;
                for (d in a.a) c[d] = a.a[d].concat();
                b.a = c;
                b.c = a.c
            }
            return b
        };
        var dd = 1 / 15;

        function ed(a, b, c, d, e) {
            null !== e && (e = Math.round(e));
            var f = {
                RepresentationID: b,
                Number: c,
                Bandwidth: d,
                Time: e
            };
            return a.replace(/\$(RepresentationID|Number|Bandwidth|Time)?(?:%0([0-9]+)d)?\$/g, function(a, b, c) {
                if ("$$" == a) return "$";
                var d = f[b];
                if (null == d) return a;
                "RepresentationID" == b && c && (c = void 0);
                a = d.toString();
                c = window.parseInt(c, 10) || 1;
                return Array(Math.max(0, c - a.length) + 1).join("0") + a
            })
        }

        function fd(a, b) {
            if (0 != b.length) {
                var c = b[0];
                c.startTime <= dd && (b[0] = new v(c.position, 0, c.a, c.uris, c.c, c.b));
                null != a && a != Number.POSITIVE_INFINITY && (c = b[b.length - 1], c.startTime > a || (b[b.length - 1] = new v(c.position, c.startTime, a, c.uris, c.c, c.b)))
            }
        }

        function V(a, b) {
            if (0 == b.length) return a;
            var c = b.map(function(a) {
                return new T(a)
            });
            return a.map(function(a) {
                return new T(a)
            }).map(function(a) {
                return c.map(a.resolve.bind(a))
            }).reduce(ab, []).map(function(a) {
                return a.toString()
            })
        }

        function gd(a, b) {
            var c = W(a, b, "timescale"),
                d = 1;
            c && (d = Ic(c) || 1);
            c = W(a, b, "duration");
            (c = Ic(c || "")) && (c /= d);
            var e = W(a, b, "startNumber"),
                f = W(a, b, "presentationTimeOffset"),
                g = Jc(e || "");
            if (null == e || null == g) g = 1;
            var h = hd(a, b, "SegmentTimeline"),
                e = null;
            if (h) {
                for (var e = d, l = Number(f), n = a.M.duration || Number.POSITIVE_INFINITY, h = Q(h, "S"), q = [], t = 0, Y = 0; Y < h.length; ++Y) {
                    var y = h[Y],
                        z = R(y, "t", Jc),
                        Ta = R(y, "d", Jc),
                        y = R(y, "r", Hc);
                    null != z && (z -= l);
                    if (!Ta) break;
                    z = null != z ? z : t;
                    y = y || 0;
                    if (0 > y)
                        if (Y + 1 < h.length) {
                            y = R(h[Y + 1], "t", Jc);
                            if (null ==
                                y) break;
                            else if (z >= y) break;
                            y = Math.ceil((y - z) / Ta) - 1
                        } else {
                            if (n == Number.POSITIVE_INFINITY) break;
                            else if (z / e >= n) break;
                            y = Math.ceil((n * e - z) / Ta) - 1
                        }
                    0 < q.length && z != t && (q[q.length - 1].end = z / e);
                    for (var Cc = 0; Cc <= y; ++Cc) t = z + Ta, q.push({
                        start: z / e,
                        end: t / e
                    }), z = t
                }
                e = q
            }
            return {
                ra: d,
                w: c,
                X: g,
                presentationTimeOffset: Number(f) / d || 0,
                s: e
            }
        }

        function W(a, b, c) {
            return [b(a.j), b(a.A), b(a.H)].filter(H).map(function(a) {
                return a.getAttribute(c)
            }).reduce(function(a, b) {
                return a || b
            })
        }

        function hd(a, b, c) {
            return [b(a.j), b(a.A), b(a.H)].filter(H).map(function(a) {
                return Bc(a, c)
            }).reduce(function(a, b) {
                return a || b
            })
        };

        function id(a, b) {
            var c = hd(a, b, "Initialization");
            if (!c) return null;
            var d = a.j.D,
                e = c.getAttribute("sourceURL");
            e && (d = V(a.j.D, [e]));
            var e = 0,
                f = null;
            if (c = R(c, "range", Gc)) e = c.start, f = c.end;
            return new qa(d, e, f)
        }

        function jd(a, b) {
            var c = W(a, kd, "presentationTimeOffset"),
                d = id(a, kd),
                e;
            e = Number(c);
            var f = a.j.mimeType.split("/")[1];
            if ("text" != a.j.contentType && "mp4" != f && "webm" != f) throw new x(4, 4006);
            if ("webm" == f && !d) throw new x(4, 4005);
            var g = hd(a, kd, "RepresentationIndex"),
                h = W(a, kd, "indexRange"),
                l = a.j.D,
                h = Gc(h || "");
            if (g) {
                var n = g.getAttribute("sourceURL");
                n && (l = V(a.j.D, [n]));
                h = R(g, "range", Gc, h)
            }
            if (!h) throw new x(4, 4002);
            e = ld(a, b, d, l, h.start, h.end, f, e);
            return {
                createSegmentIndex: e.createSegmentIndex,
                findSegmentPosition: e.findSegmentPosition,
                getSegmentReference: e.getSegmentReference,
                initSegmentReference: d,
                presentationTimeOffset: Number(c) || 0
            }
        }

        function ld(a, b, c, d, e, f, g, h) {
            var l = a.M.duration,
                n = b,
                q = null;
            return {
                createSegmentIndex: function() {
                    var a = [n(d, e, f), "webm" == g ? n(c.uris, c.c, c.b) : null];
                    n = null;
                    return Promise.all(a).then(function(a) {
                        var b, c, f, n = a[0];
                        a = a[1] || null;
                        var r = null;
                        if ("mp4" == g) {
                            a = [];
                            var r = new Oa(new DataView(n)),
                                t = A(r);
                            if (1936286840 != A(r)) throw new x(3, 3004);
                            1 == t && (t = Ua(r));
                            n = Ra(r);
                            B(r, 3);
                            B(r, 4);
                            b = A(r);
                            if (0 == b) throw new x(3, 3005);
                            var J;
                            0 == n ? (c = A(r), J = A(r)) : (c = Ua(r), J = Ua(r));
                            B(r, 2);
                            try {
                                var u = r.b.getUint16(r.a, r.c)
                            } catch (se) {
                                Sa()
                            }
                            r.a +=
                                2;
                            n = u;
                            u = c - h;
                            t = e + t + J;
                            for (J = 0; J < n; J++) {
                                f = A(r);
                                c = (f & 2147483648) >>> 31;
                                f &= 2147483647;
                                var ya = A(r);
                                B(r, 4);
                                if (1 == c) throw new x(3, 3006);
                                a.push(new v(a.length, u / b, (u + ya) / b, d, t, t + f - 1));
                                u += ya;
                                t += f
                            }
                            r = a
                        } else {
                            a = new C(new DataView(a));
                            if (440786851 != D(a).id) throw new x(3, 3008);
                            r = D(a);
                            if (408125543 != r.id) throw new x(3, 3009);
                            a = r.a.byteOffset;
                            r = new C(r.a);
                            for (b = null; Qa(r.a);)
                                if (u = D(r), 357149030 == u.id) {
                                    b = u;
                                    break
                                }
                            if (!b) throw new x(3, 3010);
                            r = new C(b.a);
                            b = 1E6;
                            for (u = null; Qa(r.a);)
                                if (t = D(r), 2807729 == t.id) b = Za(t);
                                else if (17545 ==
                                t.id)
                                if (u = t, 4 == u.a.byteLength) u = u.a.getFloat32(0);
                                else if (8 == u.a.byteLength) u = u.a.getFloat64(0);
                            else throw new x(3, 3003);
                            if (null == u) throw new x(3, 3011);
                            r = b / 1E9;
                            b = u * r;
                            u = D(new C(new DataView(n)));
                            if (475249515 != u.id) throw new x(3, 3007);
                            n = [];
                            u = new C(u.a);
                            for (J = t = -1; Qa(u.a);)
                                if (c = D(u), 187 == c.id) {
                                    f = new C(c.a);
                                    c = D(f);
                                    if (179 != c.id) throw new x(3, 3013);
                                    c = Za(c);
                                    f = D(f);
                                    if (183 != f.id) throw new x(3, 3012);
                                    ya = new C(f.a);
                                    for (f = 0; Qa(ya.a);) {
                                        var Fc = D(ya);
                                        if (241 == Fc.id) {
                                            f = Za(Fc);
                                            break
                                        }
                                    }
                                    c = r * (c - h);
                                    f = a + f;
                                    0 <= t && n.push(new v(n.length,
                                        t, c, d, J, f - 1));
                                    t = c;
                                    J = f
                                }
                            0 <= t && n.push(new v(n.length, t, b, d, J, null));
                            r = n
                        }
                        fd(l, r);
                        q = new I(r)
                    })
                },
                findSegmentPosition: function(a) {
                    return q.b(a)
                },
                getSegmentReference: function(a) {
                    return q.get(a)
                }
            }
        }

        function kd(a) {
            return a.ia
        };

        function md(a, b, c) {
            var d = id(a, nd),
                e = od(a);
            pd(a, e);
            var f = null,
                g = null;
            a.H.id && a.j.id && (g = a.H.id + "," + a.j.id, f = b[g]);
            var h = qd(a.M.duration, e.X, a.j.D, e);
            fd(a.M.duration, h);
            f ? (cb(f, h), db(f, p(c.presentationTimeline))) : (a.ga = h.reduce(function(a, b) {
                return Math.max(a, b.a - b.startTime)
            }, a.ga), f = new I(h), g && (b[g] = f));
            return {
                createSegmentIndex: Promise.resolve.bind(Promise),
                findSegmentPosition: f.b.bind(f),
                getSegmentReference: f.get.bind(f),
                initSegmentReference: d,
                presentationTimeOffset: e.presentationTimeOffset
            }
        }

        function nd(a) {
            return a.S
        }

        function od(a) {
            var b = rd(a);
            a = gd(a, nd);
            var c = a.X;
            0 === c && (c = 1);
            var d = 0;
            a.w ? d = a.w * (c - 1) - a.presentationTimeOffset : a.s && 0 < a.s.length && (d = a.s[0].start);
            return {
                w: a.w,
                startTime: d,
                X: c,
                presentationTimeOffset: a.presentationTimeOffset,
                s: a.s,
                aa: b
            }
        }

        function pd(a, b) {
            if (!b.w && !b.s && 1 < b.aa.length) throw new x(4, 4002);
            if (!b.w && !a.M.duration && !b.s && 1 == b.aa.length) throw new x(4, 4002);
            if (b.s && 0 == b.s.length) throw new x(4, 4002);
        }

        function qd(a, b, c, d) {
            var e = d.aa.length;
            d.s && d.s.length != d.aa.length && (e = Math.min(d.s.length, d.aa.length));
            for (var f = [], g = d.startTime, h = 0; h < e; h++) {
                var l = d.aa[h],
                    n = V(c, [l.Va]),
                    q;
                q = null != d.w ? g + d.w : d.s ? d.s[h].end : g + a;
                f.push(new v(h + b, g, q, n, l.start, l.end));
                g = q
            }
            return f
        }

        function rd(a) {
            return [a.j.S, a.A.S, a.H.S].filter(H).map(function(a) {
                return Q(a, "SegmentURL")
            }).reduce(function(a, c) {
                return 0 < a.length ? a : c
            }).map(function(a) {
                var c = a.getAttribute("media");
                a = R(a, "mediaRange", Gc, {
                    start: 0,
                    end: null
                });
                return {
                    Va: c,
                    start: a.start,
                    end: a.end
                }
            })
        };

        function sd(a, b, c, d) {
            var e = td(a),
                f = ud(a);
            vd(f);
            var g = null;
            if (f.fa) g = wd(a, b, e, f);
            else if (f.w) g = xd(a, f);
            else {
                g = b = null;
                a.H.id && a.j.id && (g = a.H.id + "," + a.j.id, b = c[g]);
                var h = yd(a, f);
                fd(a.M.duration, h);
                b ? (cb(b, h), db(b, p(d.presentationTimeline))) : (a.ga = h.reduce(function(a, b) {
                    return Math.max(a, b.a - b.startTime)
                }, a.ga), b = new I(h), g && (c[g] = b));
                g = {
                    createSegmentIndex: Promise.resolve.bind(Promise),
                    findSegmentPosition: b.b.bind(b),
                    getSegmentReference: b.get.bind(b)
                }
            }
            return {
                createSegmentIndex: g.createSegmentIndex,
                findSegmentPosition: g.findSegmentPosition,
                getSegmentReference: g.getSegmentReference,
                initSegmentReference: e,
                presentationTimeOffset: f.presentationTimeOffset
            }
        }

        function zd(a) {
            return a.ja
        }

        function ud(a) {
            var b = gd(a, zd),
                c = W(a, zd, "media");
            a = W(a, zd, "index");
            return {
                w: b.w,
                ra: b.ra,
                X: b.X,
                presentationTimeOffset: b.presentationTimeOffset,
                s: b.s,
                xa: c,
                fa: a
            }
        }

        function vd(a) {
            var b;
            b = 0 + (a.fa ? 1 : 0);
            b += a.s ? 1 : 0;
            b += a.w ? 1 : 0;
            if (0 == b) throw new x(4, 4002);
            1 != b && (a.fa && (a.s = null), a.w = null);
            if (!a.fa && !a.xa) throw new x(4, 4002);
        }

        function wd(a, b, c, d) {
            var e = a.j.mimeType.split("/")[1];
            if ("mp4" != e && "webm" != e) throw new x(4, 4006);
            if ("webm" == e && !c) throw new x(4, 4005);
            var f = ed(d.fa, a.j.id, null, a.bandwidth || null, null),
                f = V(a.j.D, [f]);
            return ld(a, b, c, f, 0, null, e, d.presentationTimeOffset)
        }

        function xd(a, b) {
            var c = a.M.duration,
                d = b.w,
                e = b.X,
                f = b.ra,
                g = b.xa,
                h = a.bandwidth || null,
                l = a.j.id,
                n = a.j.D;
            return {
                createSegmentIndex: Promise.resolve.bind(Promise),
                findSegmentPosition: function(a) {
                    return 0 > a || c && a >= c ? null : Math.floor(a / d)
                },
                getSegmentReference: function(a) {
                    var b = a * d,
                        c = ed(g, l, a + e, h, b * f),
                        c = V(n, [c]);
                    return new v(a, b, b + d, c, 0, null)
                }
            }
        }

        function yd(a, b) {
            for (var c = [], d = 0; d < b.s.length; d++) {
                var e = b.s[d].start,
                    f = b.s[d].end,
                    g = d + b.X,
                    h = ed(b.xa, a.j.id, g, a.bandwidth || null, (e + b.presentationTimeOffset) * b.ra),
                    h = V(a.j.D, [h]);
                c.push(new v(g, e, f, h, 0, null))
            }
            return c
        }

        function td(a) {
            var b = W(a, zd, "initialization");
            if (!b) return null;
            b = ed(b, a.j.id, null, a.bandwidth || null, null);
            a = V(a.j.D, [b]);
            return new qa(a, 0, null)
        };

        function X(a) {
            this.f = !1;
            this.a = [];
            this.b = [];
            this.c = [];
            this.h = a || null
        }
        var ac = 2;
        m("shaka.net.NetworkingEngine.RequestType", {
            MANIFEST: 0,
            SEGMENT: 1,
            LICENSE: ac
        });
        var Ad = {};
        m("shaka.net.NetworkingEngine.registerScheme", function(a, b) {
            Ad[a] = b
        });
        m("shaka.net.NetworkingEngine.unregisterScheme", function(a) {
            delete Ad[a]
        });
        X.prototype.jb = function(a) {
            this.b.push(a)
        };
        X.prototype.registerRequestFilter = X.prototype.jb;
        X.prototype.Cb = function(a) {
            var b = this.b;
            a = b.indexOf(a);
            0 <= a && b.splice(a, 1)
        };
        X.prototype.unregisterRequestFilter = X.prototype.Cb;
        X.prototype.Oa = function() {
            this.b = []
        };
        X.prototype.clearAllRequestFilters = X.prototype.Oa;
        X.prototype.kb = function(a) {
            this.c.push(a)
        };
        X.prototype.registerResponseFilter = X.prototype.kb;
        X.prototype.Db = function(a) {
            var b = this.c;
            a = b.indexOf(a);
            0 <= a && b.splice(a, 1)
        };
        X.prototype.unregisterResponseFilter = X.prototype.Db;
        X.prototype.Pa = function() {
            this.c = []
        };
        X.prototype.clearAllResponseFilters = X.prototype.Pa;

        function Bd() {
            return {
                maxAttempts: 1,
                baseDelay: 1E3,
                backoffFactor: 2,
                fuzzFactor: .5,
                timeout: 0
            }
        }

        function bc(a, b) {
            return {
                uris: a,
                method: "GET",
                body: null,
                headers: {},
                allowCrossSiteCredentials: !1,
                retryParameters: b
            }
        }
        X.prototype.u = function() {
            this.f = !0;
            this.b = [];
            this.c = [];
            for (var a = [], b = 0; b < this.a.length; ++b) a.push(this.a[b]["catch"](G));
            return Promise.all(a)
        };
        X.prototype.request = function(a, b) {
            if (this.f) return Promise.reject();
            for (var c = Date.now(), d = this.b, e = 0; e < d.length; e++) try {
                d[e](a, b)
            } catch (l) {
                return Promise.reject(l)
            }
            for (var e = b.retryParameters || {}, d = e.maxAttempts || 1, f = e.backoffFactor || 2, g = null == e.baseDelay ? 1E3 : e.baseDelay, h = this.g(a, b, 0), e = 1; e < d; e++) h = h["catch"](this.i.bind(this, a, b, g, e % b.uris.length)), g *= f;
            this.a.push(h);
            return h.then(function(b) {
                this.a.splice(this.a.indexOf(h), 1);
                var d = Date.now();
                this.h && 1 == a && this.h(c, d, b.data.byteLength);
                return b
            }.bind(this))["catch"](function(a) {
                this.a.splice(this.a.indexOf(h),
                    1);
                return Promise.reject(a)
            }.bind(this))
        };
        X.prototype.request = X.prototype.request;
        X.prototype.g = function(a, b, c) {
            if (this.f) return Promise.reject();
            var d = new T(b.uris[c]),
                e = d.I;
            e || (e = location.protocol, e = e.slice(0, -1), Rc(d, e), b.uris[c] = d.toString());
            return (e = Ad[e]) ? e(b.uris[c], b).then(function(b) {
                for (var c = this.c, d = 0; d < c.length; d++) c[d](a, b);
                return b
            }.bind(this)) : Promise.reject(new x(1, 1E3, d))
        };
        X.prototype.i = function(a, b, c, d) {
            var e = new O,
                f = b.retryParameters || {};
            window.setTimeout(e.resolve, c * (1 + (2 * Math.random() - 1) * (null == f.fuzzFactor ? .5 : f.fuzzFactor)));
            return e.then(this.g.bind(this, a, b, d))
        };

        function Cd() {
            this.m = this.l = this.c = this.b = null;
            this.g = [];
            this.a = null;
            this.h = [];
            this.v = 1;
            this.i = {};
            this.o = 0;
            this.f = null
        }
        k = Cd.prototype;
        k.configure = function(a) {
            this.c = a
        };
        k.start = function(a, b, c, d) {
            this.g = [a];
            this.b = b;
            this.l = c;
            this.m = d;
            return Dd(this).then(function() {
                Ed(this, 0);
                return this.a
            }.bind(this))
        };
        k.stop = function() {
            this.c = this.m = this.l = this.b = null;
            this.g = [];
            this.a = null;
            this.h = [];
            this.i = {};
            null != this.f && (window.clearTimeout(this.f), this.f = null);
            return Promise.resolve()
        };

        function Dd(a) {
            return a.b.request(0, bc(a.g, a.c.retryParameters)).then(function(a) {
                if (this.b) return Fd(this, a.data, a.uri)
            }.bind(a))
        }

        function Fd(a, b, c) {
            var d = Kb(b),
                e = new DOMParser,
                f = null;
            b = null;
            try {
                f = e.parseFromString(d, "text/xml")
            } catch (z) {}
            f && "MPD" == f.documentElement.tagName && (b = f.documentElement);
            if (!b) throw new x(4, 4001);
            c = [c];
            d = Q(b, "Location").map(Dc).filter(H);
            0 < d.length && (c = a.g = d);
            d = Q(b, "BaseURL").map(Dc);
            c = V(c, d);
            var g = {
                    H: null,
                    M: null,
                    A: null,
                    j: null,
                    bandwidth: void 0,
                    ga: 1
                },
                h = R(b, "minBufferTime", S);
            a.o = R(b, "minimumUpdatePeriod", S) || 0;
            var l = R(b, "availabilityStartTime", Ec),
                n = R(b, "timeShiftBufferDepth", S),
                q = R(b, "suggestedPresentationDelay",
                    S),
                t = R(b, "maxSegmentDuration", S);
            c = Gd(a, g, c, b);
            var Y = c.duration,
                y = c.periods;
            b = Q(b, "UTCTiming");
            return Hd(a, b).then(function(a) {
                this.b && (null == l ? n = null : null == n && (n = Number.POSITIVE_INFINITY), this.a ? this.a.presentationTimeline.b = n : (null != l && (l += null != q ? q : 2), this.a = {
                    periods: y,
                    presentationTimeline: new oa(Y || Number.POSITIVE_INFINITY, l, n, t || g.ga, a),
                    minBufferTime: h || 0
                }))
            }.bind(a))
        }

        function Gd(a, b, c, d) {
            var e = R(d, "mediaPresentationDuration", S),
                f = [],
                g = 0;
            d = Q(d, "Period");
            for (var h = 0; h < d.length; h++) {
                var l = d[h],
                    g = R(l, "start", S, g),
                    n = R(l, "duration", S);
                if (null == n)
                    if (h + 1 != d.length) {
                        var q = R(d[h + 1], "start", S);
                        null != q && (n = q - g)
                    } else null != e && (n = e - g);
                var q = a,
                    t = b,
                    l = {
                        start: g,
                        duration: n,
                        node: l
                    };
                t.H = Id(l.node, null, c);
                t.M = l;
                q = Q(l.node, "AdaptationSet").map(q.hb.bind(q, t));
                if (0 == q.length) throw new x(4, 4004);
                q = Jd(q);
                l = {
                    startTime: l.start,
                    streamSets: q
                };
                f.push(l);
                q = b.H.id;
                a.h.every(bb(q)) && (a.l(l), a.h.push(q),
                    a.a && a.a.periods.push(l));
                if (null == n) {
                    g = null;
                    break
                }
                g += n
            }
            return null != e ? {
                periods: f,
                duration: e
            } : {
                periods: f,
                duration: g
            }
        }
        k.hb = function(a, b) {
            a.A = Id(b, a.H, null);
            a.A.contentType || (a.A.contentType = a.A.mimeType.split("/")[0]);
            var c = !1,
                d = Bc(b, "Role"),
                e = void 0;
            "text" == a.A.contentType && (e = "subtitle");
            if (d) {
                var f = d.getAttribute("schemeIdUri");
                if (null == f || "urn:mpeg:dash:role:2011" == f) switch (d = d.getAttribute("value"), d) {
                    case "main":
                        c = !0;
                        break;
                    case "caption":
                    case "subtitle":
                        e = d
                }
            }
            var g = [];
            Q(b, "SupplementalProperty").forEach(function(a) {
                "http://dashif.org/descriptor/AdaptationSetSwitching" == a.getAttribute("schemeIdURI") && (a = a.getAttribute("value")) &&
                    g.push.apply(g, a.split(","))
            });
            d = Q(b, "ContentProtection");
            d = Lc(d, this.c.dash.customScheme);
            e = Q(b, "Representation").map(this.ib.bind(this, a, d, e));
            if (0 == e.length) throw new x(4, 4003);
            a.A.contentType || (a.A.contentType = e[0].mimeType.split("/")[0]);
            return {
                id: a.A.id || "__fake__" + this.v++,
                contentType: a.A.contentType,
                language: kb(b.getAttribute("lang") || "und"),
                Ua: c,
                streams: e,
                drmInfos: d.drmInfos,
                Ab: g
            }
        };
        k.ib = function(a, b, c, d) {
            a.j = Id(d, a.A, null);
            a.bandwidth = R(d, "bandwidth", Ic) || void 0;
            "text" != a.j.contentType && Kd(a.j);
            var e;
            e = this.lb.bind(this);
            if (a.j.ia) e = jd(a, e);
            else if (a.j.S) e = md(a, this.i, this.a);
            else if (a.j.ja) e = sd(a, e, this.i, this.a);
            else {
                var f = a.j.D,
                    g = a.M.duration || 0;
                e = {
                    createSegmentIndex: Promise.resolve.bind(Promise),
                    findSegmentPosition: function(a) {
                        return 0 <= a && a < g ? 1 : null
                    },
                    getSegmentReference: function(a) {
                        return 1 != a ? null : new v(1, 0, g, f, 0, null)
                    },
                    initSegmentReference: null,
                    presentationTimeOffset: 0
                }
            }
            d =
                Q(d, "ContentProtection");
            b = Pc(d, this.c.dash.customScheme, b);
            return {
                id: this.v++,
                createSegmentIndex: e.createSegmentIndex,
                findSegmentPosition: e.findSegmentPosition,
                getSegmentReference: e.getSegmentReference,
                initSegmentReference: e.initSegmentReference,
                presentationTimeOffset: e.presentationTimeOffset,
                mimeType: a.j.mimeType,
                codecs: a.j.va,
                bandwidth: a.bandwidth,
                width: a.j.width,
                height: a.j.height,
                kind: c,
                keyId: b
            }
        };
        k.xb = function() {
            this.f = null;
            var a = Date.now();
            Dd(this).then(function() {
                this.b && Ed(this, (Date.now() - a) / 1E3)
            }.bind(this))["catch"](function(a) {
                this.m(a);
                this.b && Ed(this, 0)
            }.bind(this))
        };

        function Ed(a, b) {
            0 != a.o && (a.f = window.setTimeout(a.xb.bind(a), 1E3 * Math.max(Math.max(3, a.o) - b, 0)))
        }

        function Id(a, b, c) {
            b = b || {
                contentType: "",
                mimeType: "",
                va: ""
            };
            c = c || b.D;
            var d = Q(a, "BaseURL").map(Dc);
            return {
                D: V(c, d),
                ia: Bc(a, "SegmentBase") || b.ia,
                S: Bc(a, "SegmentList") || b.S,
                ja: Bc(a, "SegmentTemplate") || b.ja,
                width: R(a, "width", Jc) || b.width,
                height: R(a, "height", Jc) || b.height,
                contentType: a.getAttribute("contentType") || b.contentType,
                mimeType: a.getAttribute("mimeType") || b.mimeType,
                va: a.getAttribute("codecs") || b.va,
                id: a.getAttribute("id")
            }
        }

        function Jd(a) {
            var b = {};
            a.forEach(function(a) {
                b[a.id] = [a]
            });
            a.forEach(function(a) {
                var c = b[a.id];
                a.Ab.forEach(function(a) {
                    (a = b[a]) && a != c && (c.push.apply(c, a), a.forEach(function(a) {
                        b[a.id] = c
                    }))
                })
            });
            var c = [],
                d = [];
            K(b).forEach(function(a) {
                if (!(0 <= d.indexOf(a))) {
                    d.push(a);
                    var b = new L;
                    a.forEach(function(a) {
                        b.push(a.contentType || "", a)
                    });
                    b.keys().forEach(function(a) {
                        var d = new L;
                        b.get(a).forEach(function(a) {
                            d.push(a.language, a)
                        });
                        d.keys().forEach(function(b) {
                            var e = d.get(b);
                            b = {
                                language: b,
                                type: a,
                                primary: e.some(function(a) {
                                    return a.Ua
                                }),
                                drmInfos: e.map(function(a) {
                                    return a.drmInfos
                                }).reduce(ab, []),
                                streams: e.map(function(a) {
                                    return a.streams
                                }).reduce(ab, [])
                            };
                            c.push(b)
                        })
                    })
                }
            });
            return c
        }

        function Kd(a) {
            var b;
            b = 0 + (a.ia ? 1 : 0);
            b += a.S ? 1 : 0;
            b += a.ja ? 1 : 0;
            if (0 == b) throw new x(4, 4002);
            1 != b && (a.ia && (a.S = null), a.ja = null)
        }

        function Ld(a, b, c) {
            b = bc([b], a.c.retryParameters);
            b.method = c;
            return a.b.request(0, b).then(function(a) {
                if ("HEAD" == c) {
                    if (!a.headers || !a.headers.date) return 0;
                    a = a.headers.date
                } else a = Kb(a.data);
                a = Date.parse(a);
                return isNaN(a) ? 0 : a - Date.now()
            })
        }

        function Hd(a, b) {
            return $a(b, function(a) {
                var b = a.getAttribute("schemeIdUri");
                a = a.getAttribute("value");
                switch (b) {
                    case "urn:mpeg:dash:utc:http-head:2014":
                    case "urn:mpeg:dash:utc:http-head:2012":
                        return Ld(this, a, "HEAD");
                    case "urn:mpeg:dash:utc:http-xsdate:2014":
                    case "urn:mpeg:dash:utc:http-iso:2014":
                    case "urn:mpeg:dash:utc:http-xsdate:2012":
                    case "urn:mpeg:dash:utc:http-iso:2012":
                        return Ld(this, a, "GET");
                    case "urn:mpeg:dash:utc:direct:2014":
                    case "urn:mpeg:dash:utc:direct:2012":
                        return b = Date.parse(a),
                            isNaN(b) ? 0 : b - Date.now();
                    case "urn:mpeg:dash:utc:http-ntp:2014":
                    case "urn:mpeg:dash:utc:ntp:2014":
                    case "urn:mpeg:dash:utc:sntp:2014":
                        return Promise.reject();
                    default:
                        return Promise.reject()
                }
            }.bind(a))["catch"](function() {
                return 0
            })
        }
        k.lb = function(a, b, c) {
            a = bc(a, this.c.retryParameters);
            null != b && (a.headers.Range = "bytes=" + b + "-" + (null != c ? c : ""));
            return this.b.request(1, a).then(function(a) {
                return a.data
            })
        };
        ma.mpd = Cd;
        la["application/dash+xml"] = Cd;

        function Md(a, b, c, d, e, f, g, h, l) {
            this.h = a;
            this.c = b;
            this.R = c;
            this.a = d;
            this.P = e;
            this.v = f;
            this.m = g;
            this.B = h || null;
            this.G = l || null;
            this.l = null;
            this.O = Promise.resolve();
            this.g = [];
            this.i = {};
            this.b = {};
            this.f = this.o = !1
        }
        Md.prototype.u = function() {
            for (var a in this.b) Nd(this.b[a]);
            this.l = this.b = this.i = this.g = this.G = this.B = this.m = this.v = this.P = this.O = this.a = this.R = this.c = this.h = null;
            this.f = !0;
            return Promise.resolve()
        };
        Md.prototype.configure = function(a) {
            this.l = a;
            this.h.l = Math.max(this.a.minBufferTime || 0, this.l.rebufferingGoal)
        };
        Md.prototype.init = function() {
            var a = this.P(this.a.periods[Od(this, rb(this.h))]);
            return a && 0 != Object.keys(a).length ? Pd(this, a).then(function() {
                this.B && this.B()
            }.bind(this)) : Promise.reject(new x(5, 5005))
        };

        function Qd(a) {
            return a.a.periods[Od(a, rb(a.h))]
        }

        function Rd(a) {
            return mb(a.b, function(a) {
                return a.stream
            })
        }

        function Sd(a, b) {
            var c = {};
            c.text = b;
            return Pd(a, c)
        }

        function Td(a, b, c, d) {
            if (b = a.b[b]) {
                var e = a.g[Ud(a, c)];
                e && e.da && (e = a.i[c.id]) && e.da && b.stream != c && (b.stream = c, b.ya = !0, !d || b.J || b.U || (b.ba ? b.J = !0 : (Nd(b), Vd(a, b))))
            }
        }

        function Pd(a, b) {
            var c = Od(a, rb(a.h)),
                d = mb(b, function(a) {
                    return a.mimeType + (a.codecs ? '; codecs="' + a.codecs + '"' : "")
                });
            a.c.init(d);
            Wd(a);
            d = K(b);
            return Xd(a, d).then(function() {
                for (var a in b) {
                    var d = b[a];
                    this.b[a] || (this.b[a] = {
                        stream: d,
                        type: a,
                        W: null,
                        L: null,
                        oa: null,
                        ya: !0,
                        ha: !1,
                        qa: c,
                        endOfStream: !1,
                        ba: !1,
                        T: null,
                        J: !1,
                        U: !1
                    });
                    Yd(this, this.b[a], 0)
                }
            }.bind(a))
        }

        function Zd(a, b) {
            var c = a.g[b];
            if (c) return c.C;
            c = {
                C: new O,
                da: !1
            };
            a.g[b] = c;
            var d = a.a.periods[b].streamSets.map(function(a) {
                return a.streams
            }).reduce(ab, []);
            a.O = a.O.then(function() {
                if (!this.f) return Xd(this, d)
            }.bind(a)).then(function() {
                this.f || (this.g[b].C.resolve(), this.g[b].da = !0)
            }.bind(a))["catch"](function(a) {
                this.f || (this.g[b].C.reject(), delete this.g[b], this.m(a))
            }.bind(a));
            return c.C
        }

        function Xd(a, b) {

            for (var c = [], d = 0; d < b.length; ++d) {
                var e = b[d],
                    f = a.i[e.id];
                f ? c.push(f.C) : (a.i[e.id] = {
                    C: new O,
                    da: !1
                }, c.push(e.createSegmentIndex()))
            }
            return Promise.all(c).then(function() {
                if (!this.f)
                    for (var a = 0; a < b.length; ++a) {
                        var c = this.i[b[a].id];
                        c.da || (c.C.resolve(), c.da = !0)
                    }
            }.bind(a))["catch"](function(a) {
                if (!this.f) return this.i[e.id].C.reject(), delete this.i[e.id], Promise.reject(a)
            }.bind(a))
        }


        function Wd(a) {
            var b = a.a.presentationTimeline.a;
            b < Number.POSITIVE_INFINITY ? Gb(a.c, b) : Gb(a.c, Math.pow(2, 32))
        }
        Md.prototype.$ = function(a) {
            if (!this.f && !a.ba && null != a.T && !a.U)
                if (a.T = null, a.J) Vd(this, a);
                else {
                    try {
                        var b = $d(this, a);
                        null != b && Yd(this, a, b)
                    } catch (c) {
                        this.m(c);
                        return
                    }
                    b = K(this.b);
                    tb(this.h, b.some(function(a) {
                        return a.ha
                    }));
                    ae(this, a);
                    b.every(function(a) {
                        return a.endOfStream
                    }) && this.c.endOfStream()
                }
        };

        function $d(a, b) {
            var c = rb(a.h),
                d = yb(a.c, b.type, c, .1),
                e = Math.max(a.a.minBufferTime || 0, a.l.rebufferingGoal);
            if (d >= Math.max(e, a.l.bufferingGoal)) return b.ha = !1, .5;
            var f = a.c,
                g = b.type;
            a: {
                f = "text" == g ? f.b.a : (f = f.c[g].buffered) ? f.length ? f.end(f.length - 1) : null : null;
                if (0 == d) {
                    if (null == f) {
                        if (null != b.W || b.L) throw new x(5, 5E3, b.type);
                        f = c;
                        break a
                    }
                    if (f > c) {
                        f = null;
                        break a
                    }
                }
                if (null == b.W || null == b.L) throw new x(5, 5E3, b.type);
                f = a.a.periods[b.W].startTime + b.L.a
            }
            if (null == f) return null;
            g = a.a.presentationTimeline;
            if (f >= g.a) return b.ha = !1, b.endOfStream = !0, null;
            b.endOfStream = !1;
            !a.o && d < e || 1 >= d ? b.ha = !0 : d >= e && (b.ha = !1);
            d = Ud(a, b.stream);
            e = Od(a, f);
            if (e != d) return b.qa = e, null;
            e = pa(g);
            if (f < p(g) || f > e) return 1;
            e = b.L ? d == b.W ? b.L.position + 1 : be(a, b, a.a.periods[b.W].startTime + b.L.a, d) : be(a, b, c, d);
            f = b.stream.getSegmentReference(e);
            if (!f) throw new x(5, 5001, b.type, d, e);
            ce(a, b, c, d, f);
            return null
        }

        function be(a, b, c, d) {
            a = c - a.a.periods[d].startTime - b.oa;
            a = Math.max(a, 0);
            a = b.stream.findSegmentPosition(a);
            if (null == a) throw new x(5, 5002, b.type, d, c);
            return a
        }

        function ce(a, b, c, d, e) {
            var f = a.a.periods[d + 1],
                g = null,
                g = f ? f.startTime : a.a.presentationTimeline.a,
                f = de(a, b, d, g);
            b.ba = !0;
            b.ya = !1;
            // console.log("Ts");
            g = ee(a, e);
            Promise.all([f, g]).then(function(a) {
                if (!this.f) return fe(this, b, c, d, e, a[1])
            }.bind(a)).then(function() {
                if (!this.f) {
                    var a;
                    if (null != b.oa) a = Promise.resolve();
                    else {
                        a = this.a.periods[d];
                        var f = xb(this.c, b.type);
                        null == f ? a = Promise.reject(new x(5, 5004, b.type)) : (b.oa = f - e.startTime - a.startTime, 0 == yb(this.c, b.type, c) && (b.J = !0), a = Promise.resolve())
                    }
                    return a
                }
            }.bind(a)).then(function() {
                b.ba = !1;
                Yd(this, b, 0);
                this.f || ge(this, b)
            }.bind(a))["catch"](function(a) {
                this.f || this.m(a)
            }.bind(a))
        }

        function de(a, b, c, d) {
            if (!b.ya) return Promise.resolve();
            c = Cb(a.c, b.type, a.a.periods[c].startTime - b.stream.presentationTimeOffset);
            d = null != d ? Db(a.c, b.type, d) : Promise.resolve();
            if (!b.stream.initSegmentReference) return Promise.all([c, d]);
            // console.log("init");
            a = ee(a, b.stream.initSegmentReference).then(function(a) {
                if (!this.f) return zb(this.c, b.type, a, null, null)
            }.bind(a));
            return Promise.all([c, d, a])
        }

        function fe(a, b, c, d, e, f) {
            return he(a, c).then(function() {
                if (!this.f) return zb(this.c, b.type, f, e.startTime, e.a)
            }.bind(a)).then(function() {
                if (!this.f) return b.W = d, b.L = e, Promise.resolve()
            }.bind(a))
        }

        function he(a, b) {
            var c = K(a.b),
                d = c.map(function(a) {
                    return xb(this.c, a.type)
                }.bind(a)).filter(H);
            if (0 == d.length) return Promise.resolve();
            var e = Math.min.apply(Math, d),
                f = b - e - a.l.bufferBehind;
            if (0 >= f) return Promise.resolve();
            c = c.map(function(a) {
                var b = this.c;
                a = a.type;
                var c = e + f;
                return "text" == a ? ib(b.b, e, c) : Ab(b, a, b.Ha.bind(b, a, e, c))
            }.bind(a));
            return Promise.all(c).then(function() {}.bind(a))
        }

        function ge(a, b) {
            if (!a.o && (a.o = K(a.b).every(function(a) {
                    return null != a.oa && !a.J && !a.U && a.L
                }), a.o)) {
                var c = Ud(a, b.stream);
                a.g[c] || Zd(a, c).then(function() {
                    this.v()
                }.bind(a))["catch"](G);
                for (c = 0; c < a.a.periods.length; ++c) Zd(a, c)["catch"](G);
                a.G && a.G()
            }
        }

        function ae(a, b) {
            if (b.qa != Ud(a, b.stream)) {
                var c = b.qa,
                    d = K(a.b);
                d.every(function(a) {
                    return a.qa == c
                }) && d.every(ie) && Zd(a, c).then(function() {
                    if (!this.f) {
                        var a = this.P(this.a.periods[c]),
                            b;
                        for (b in this.b)
                            if (!a[b]) {
                                this.m(new x(5, 5005));
                                return
                            }
                        for (b in a)
                            if (!this.b[b]) {
                                this.m(new x(5, 5005));
                                return
                            }
                        for (b in this.b) {
                            Td(this, b, a[b]);
                            var d = this.b[b];
                            ie(d) && Yd(this, d, 0)
                        }
                        this.v()
                    }
                }.bind(a))["catch"](G)
            }
        }

        function ie(a) {
            return !a.ba && null == a.T && !a.J && !a.U
        }

        function Od(a, b) {
            for (var c = a.a.periods.length - 1; 0 < c; --c)
                if (b >= a.a.periods[c].startTime) return c;
            return 0
        }

        function Ud(a, b) {
            for (var c = 0; c < a.a.periods.length; ++c)
                for (var d = a.a.periods[c], e = 0; e < d.streamSets.length; ++e)
                    if (0 <= d.streamSets[e].streams.indexOf(b)) return c;
            return -1
        }

        function ee(a, b) {
            var c = bc(b.uris, a.l.retryParameters);
            // console.log(b.uris);
            if (0 != b.c || null != b.b) {
                var d = "bytes=" + b.c + "-";
                null != b.b && (d += b.b);
                c.headers.Range = d
            }
            return a.R.request(1, c).then(function(a) {
                return a.data
            })
        }

        function Vd(a, b) {
            b.J = !1;
            b.U = !0;
            Bb(a.c, b.type).then(function() {
                this.f || (b.W = null, b.L = null, b.U = !1, Yd(this, b, 0))
            }.bind(a))
        }

        function Yd(a, b, c) {
            b.T = window.setTimeout(a.$.bind(a, b), 1E3 * c)
        }

        function Nd(a) {
            null != a.T && (window.clearTimeout(a.T), a.T = null)
        };
        Ad.data = function(a) {
            return new Promise(function(b) {
                var c = a.split(":");
                if (2 > c.length || "data" != c[0]) throw new x(1, 1004, a);
                c = c.slice(1).join(":").split(",");
                if (2 > c.length) throw new x(1, 1004, a);
                var d = c[0],
                    c = window.decodeURIComponent(c.slice(1).join(",")),
                    d = d.split(";"),
                    e = null;
                1 < d.length && (e = d[1]);
                if ("base64" == e) c = Qb(c).buffer;
                else {
                    if (e) throw new x(1, 1005, a);
                    c = Lb(c)
                }
                b({
                    uri: a,
                    data: c,
                    headers: {}
                })
            })
        };

        function je(a, b) {
            return new Promise(function(c, d) {
                var e = new XMLHttpRequest;
                var  cin_url=a.split('/');
                a=a+g_vid_policies[cin_url[4]];
                e.open(b.method, a, !0);
                e.responseType = "arraybuffer";
                e.timeout = b.retryParameters.timeout;
                e.withCredentials = b.allowCrossSiteCredentials;
                e.onload = function(b) {
                    b = b.target;
                    if (200 <= b.status && 299 >= b.status) {
                        var e = b.getAllResponseHeaders().split("\r\n").reduce(function(a, b) {
                            var c = b.split(": ");
                            a[c[0].toLowerCase()] = c.slice(1).join(": ");
                            return a
                        }, {});
                        b.mb && (a = b.mb);
                        c({
                            uri: a,
                            data: b.response,
                            headers: e
                        })
                    } else d(new x(1, 1001, a, b.status))
                };
                e.onerror = function() {
                    d(new x(1, 1002, a))
                };
                e.ontimeout = function() {
                    d(new x(1, 1003, a))
                };
                for (var f in b.headers) e.setRequestHeader(f, b.headers[f]);
                e.send(b.body)
            })
        }
        Ad.http = je;
        Ad.https = je;

        function Z(a) {
            this.v = new L;
            this.c = a;
            this.i = null;
            this.o = new M;
            this.Ea = new ia;
            this.l = new X(this.wb.bind(this));
            this.f = this.m = this.b = this.O = this.ma = this.G = this.B = this.g = null;
            this.La = 1E9;
            this.ta = !1;
            this.R = !0;
            this.pa = !1;
            this.h = {};
            this.a = ke(this);
            this.P = [];
            this.la = this.$ = this.na = 0;
            this.ma = le(this);
            for (a = 0; a < this.c.textTracks.length; ++a) {
                var b = this.c.textTracks[a];
                b.mode = "hidden";
                "Shaka Player TextTrack" == b.id && (this.i = b)
            }
            this.i || (this.i = this.c.addTextTrack("subtitles", "Shaka Player TextTrack"), this.i.mode =
                "hidden");
            N(this.o, this.c, "error", this.bb.bind(this))
        }
        ba(Z);
        m("shaka.Player", Z);
        Z.prototype.u = function() {
            var a = Promise.all([me(this), this.o ? this.o.u() : null, this.l ? this.l.u() : null]);
            this.a = this.l = this.Ea = this.o = this.i = this.c = null;
            return a
        };
        Z.prototype.destroy = Z.prototype.u;
        Z.version = "v2.0.0-beta";
        Z.support = function() {
            if (window.Promise && window.Uint8Array && Array.prototype.forEach) {
                var a = na(),
                    b = wb();
                return dc().then(function(c) {
                    return {
                        manifest: a,
                        media: b,
                        drm: c,
                        supported: a.basic && b.basic && c.basic
                    }
                })
            }
            return {
                then: function(a) {
                    a({
                        supported: !1
                    })
                }
            }
        };
        Z.prototype.load = function(a, b, c) {
            var d = c;
            c = Promise.resolve();
            var e;
            d || (e = ad(new T(a)).split("/").pop().split("."), 1 < e.length && (e = e.pop().toLowerCase(), d = ma[e]));
            d || (c = bc([a], this.a.manifest.retryParameters), c.method = "HEAD", c = this.l.request(0, c).then(function(b) {
                (b = b.headers["content-type"]) && (b = b.toLowerCase());
                d = la[b];
                if (!d) return Promise.reject(new x(4, 4E3, a))
            }, function() {
                return Promise.reject(new x(4, 4E3, a))
            }));
            c = c.then(function() {
                this.m = new d;
                this.m.configure(this.a.manifest);
                return this.m.start(a,
                    this.l, this.Ca.bind(this), this.ka.bind(this))
            }.bind(this)).then(function(a) {
                this.f = a;
                this.la = Date.now() / 1E3
            }.bind(this));
            e = Promise.resolve();
            this.c.src && (e = this.Ka());
            this.pa = !0;
            return Promise.all([e, c]).then(function() {
                this.g = new Tb(this.l, this.ka.bind(this), this.ub.bind(this));
                this.g.configure(this.a.drm);
                return this.g.init(this.f, !1)
            }.bind(this)).then(function() {
                this.f.periods.forEach(this.Ca.bind(this));
                return Promise.all([Wb(this.g, this.c), this.ma])
            }.bind(this)).then(function() {
                this.O = new qb(this.c,
                    this.f.presentationTimeline, Math.max(this.f.minBufferTime || 0, this.a.streaming.rebufferingGoal), b || null, this.sb.bind(this), this.vb.bind(this));
                this.G = new vb(this.c, this.B, this.i);
                this.b = new Md(this.O, this.G, this.l, this.f, this.tb.bind(this), this.Ma.bind(this), this.ka.bind(this));
                this.b.configure(this.a.streaming);
                return this.b.init()
            }.bind(this)).then(function() {
                this.f.periods.forEach(this.Ca.bind(this));
                ne(this);
                oe(this);
                this.pa = !1;
                this.a.abr.manager.init(this.Ja.bind(this))
            }.bind(this))["catch"](function(a) {
                this.pa = !1;
                return Promise.reject(a)
            })
        };
        Z.prototype.load = Z.prototype.load;

        function le(a) {
            a.B = new MediaSource;
            var b = new O;
            N(a.o, a.B, "sourceopen", b.resolve);
            a.c.src = window.URL.createObjectURL(a.B);
            return b
        }
        Z.prototype.configure = function(a) {
            var b = a.preferredAudioLanguage && a.preferredAudioLanguage !== this.a.preferredAudioLanguage,
                c = a.preferredTextLanguage && a.preferredTextLanguage !== this.a.preferredTextLanguage;
            a.abr && a.abr.manager && a.abr.manager != this.a.abr.manager && (this.a.abr.manager.stop(), a.abr.manager.init(this.Ja.bind(this)));
            pe(this, this.a, a, ke(this), "");
            this.m && this.m.configure(this.a.manifest);
            this.g && this.g.configure(this.a.drm);
            if (this.b) {
                this.b.configure(this.a.streaming);
                a = qe(this, Qd(this.b));
                for (var d in a)
                    if ("audio" == d && b || "text" == d && c) this.R ? this.h[d] = a[d] : Td(this.b, d, a[d], !0)
            }
            this.a.abr.enabled && !this.R ? this.a.abr.manager.enable() : this.a.abr.manager.disable();
            this.a.abr.manager.setDefaultEstimate(this.a.abr.defaultBandwidthEstimate)
        };
        Z.prototype.configure = Z.prototype.configure;
        Z.prototype.getConfiguration = function() {
            var a = ke(this);
            pe(this, a, this.a, ke(this), "");
            return a
        };
        Z.prototype.getConfiguration = Z.prototype.getConfiguration;
        Z.prototype.Qa = function() {
            return this.l
        };
        Z.prototype.getNetworkingEngine = Z.prototype.Qa;
        Z.prototype.Sa = function() {
            return this.f ? this.f.presentationTimeline.a == Number.POSITIVE_INFINITY : !1
        };
        Z.prototype.isLive = Z.prototype.Sa;
        Z.prototype.Ra = function() {
            return this.ta
        };
        Z.prototype.isBuffering = Z.prototype.Ra;
        Z.prototype.Ka = function() {
            return me(this).then(function() {
                this.ma = le(this)
            }.bind(this))
        };
        Z.prototype.unload = Z.prototype.Ka;
        Z.prototype.Bb = function() {};
        Z.prototype.trickPlay = Z.prototype.Bb;
        Z.prototype.Na = function() {};
        Z.prototype.cancelTrickPlay = Z.prototype.Na;
        Z.prototype.getTracks = function() {
            if (!this.b) return [];
            var a = Rd(this.b);
            return Qd(this.b).streamSets.map(function(b) {
                var c = a[b.type];
                return b.streams.map(function(a) {
                    return {
                        id: a.id,
                        active: c == a,
                        type: b.type,
                        bandwidth: a.bandwidth,
                        language: b.language,
                        kind: a.kind || null,
                        width: a.width || null,
                        height: a.height || null
                    }
                })
            }).reduce(ab, [])
        };
        Z.prototype.getTracks = Z.prototype.getTracks;
        Z.prototype.ob = function(a, b) {
            if (this.b) {
                var c;
                Qd(this.b).streamSets.forEach(function(b) {
                    b.streams.forEach(function(b) {
                        b.id == a.id && (c = b)
                    })
                });
                c && (this.P.push({
                    timestamp: Date.now() / 1E3,
                    id: c.id,
                    type: a.type,
                    fromAdaptation: !1
                }), "text" != a.type && this.configure({
                    abr: {
                        enabled: !1
                    }
                }), this.R ? this.h[a.type] = c : Td(this.b, a.type, c, b || "text" == a.type))
            }
        };
        Z.prototype.selectTrack = Z.prototype.ob;
        Z.prototype.Ta = function() {
            return "showing" == this.i.mode
        };
        Z.prototype.isTextTrackVisible = Z.prototype.Ta;
        Z.prototype.qb = function(a) {
            this.i.mode = a ? "showing" : "disabled"
        };
        Z.prototype.setTextTrackVisibility = Z.prototype.qb;
        Z.prototype.getStats = function() {
            re(this);
            var a = {},
                b = {},
                c = this.c && this.c.getVideoPlaybackQuality ? this.c.getVideoPlaybackQuality() : {};
            this.b && (b = Rd(this.b), a = b.video || {}, b = b.audio || {});
            return {
                width: a.width || 0,
                height: a.height || 0,
                streamBandwidth: a.bandwidth + b.bandwidth || 0,
                decodedFrames: Number(c.totalVideoFrames),
                droppedFrames: Number(c.droppedVideoFrames),
                estimatedBandwidth: this.a.abr.manager.getBandwidthEstimate(),
                playTime: this.na,
                bufferingTime: this.$,
                switchHistory: this.P.slice(0)
            }
        };
        Z.prototype.getStats = Z.prototype.getStats;
        Z.prototype.addTextTrack = function(a, b, c, d, e) {
            if (!this.f) return Promise.reject();
            for (var f = Qd(this.b), g, h = 0; h < this.f.periods.length; h++)
                if (this.f.periods[h] == f) {
                    if (h == this.f.periods.length - 1) {
                        if (g = this.f.presentationTimeline.a - f.startTime, g == Number.POSITIVE_INFINITY) return Promise.reject()
                    } else g = this.f.periods[h + 1].startTime - f.startTime;
                    break
                }
            var l = {
                    id: this.La++,
                    createSegmentIndex: Promise.resolve.bind(Promise),
                    findSegmentPosition: function() {
                        return 1
                    },
                    getSegmentReference: function(b) {
                        return 1 != b ? null :
                            new v(1, 0, g, [a], 0, null)
                    },
                    initSegmentReference: null,
                    presentationTimeOffset: 0,
                    mimeType: d,
                    codecs: e || "",
                    bandwidth: 0,
                    kind: c,
                    keyId: null
                },
                n = {
                    language: b,
                    type: "text",
                    primary: !0,
                    drmInfos: [],
                    streams: [l]
                };
            return Sd(this.b, l).then(function() {
                f.streamSets.push(n);
                return {
                    id: l.id,
                    active: !1,
                    type: "text",
                    bandwidth: 0,
                    language: b,
                    kind: c,
                    width: null,
                    height: null
                }
            })
        };
        Z.prototype.addTextTrack = Z.prototype.addTextTrack;

        function me(a) {
            a.o && a.o.ea(a.B, "sourceopen");
            a.c && (a.c.removeAttribute("src"), a.c.load());
            var b = Promise.all([a.a.abr.manager.stop(), a.g ? a.g.u() : null, a.G ? a.G.u() : null, a.O ? a.O.u() : null, a.b ? a.b.u() : null, a.m ? a.m.stop() : null]);
            a.g = null;
            a.G = null;
            a.O = null;
            a.b = null;
            a.m = null;
            a.f = null;
            a.ma = null;
            a.B = null;
            a.h = {};
            a.P = [];
            a.na = 0;
            a.$ = 0;
            return b
        }

        function pe(a, b, c, d, e) {
            var f = !!{
                    ".drm.servers": !0,
                    ".drm.clearKeys": !0,
                    ".drm.advanced": !0
                }[e],
                g = {
                    ".drm.servers": "string",
                    ".drm.clearKeys": "string"
                }[e] || "",
                h = {
                    ".drm.advanced": {
                        distinctiveIdentifierRequired: !1,
                        persistentStateRequired: !1,
                        videoRobustness: "",
                        audioRobustness: "",
                        serverCertificate: null
                    }
                }[e],
                l;
            for (l in c) {
                var n = e + "." + l,
                    q = d[l];
                h && (q = h);
                var t = !!{
                    ".abr.manager": !0
                }[n];
                (f || l in b) && (void 0 === c[l] ? void 0 === q ? delete b[l] : b[l] = q : t ? b[l] = c[l] : "object" == typeof b[l] && "object" == typeof c[l] ? pe(a, b[l], c[l],
                    q, n) : (f || typeof c[l] == typeof b[l]) && (g && typeof c[l] != g || "function" == typeof b[l] && b[l].length != c[l].length || (b[l] = c[l])))
            }
        }

        function ke(a) {
            return {
                drm: {
                    retryParameters: Bd(),
                    servers: {},
                    clearKeys: {},
                    advanced: {}
                },
                manifest: {
                    retryParameters: Bd(),
                    dash: {
                        customScheme: function(a) {
                            if (a) return null
                        }
                    }
                },
                streaming: {
                    retryParameters: Bd(),
                    rebufferingGoal: 2,
                    bufferingGoal: 30,
                    bufferBehind: 30
                },
                abr: {
                    manager: a.Ea,
                    enabled: !0,
                    defaultBandwidthEstimate: 5E5
                },
                preferredAudioLanguage: "",
                preferredTextLanguage: ""
            }
        }
        k = Z.prototype;
        k.Ca = function(a) {
            var b = "";
            this.g && this.g.o && (b = this.g.keySystem());
            var c = {};
            this.b && (c = Rd(this.b));
            for (var d = 0; d < a.streamSets.length; ++d) {
                var e = a.streamSets[d];
                if (b && 0 != e.drmInfos.length && !e.drmInfos.some(function(a) {
                        return a.keySystem == b
                    })) a.streamSets.splice(d, 1), --d;
                else {
                    for (var f = c[e.type], g = 0; g < e.streams.length; ++g) {
                        var h = e.streams[g];
                        if (f && "text" != e.type && h.mimeType != f.mimeType) e.streams.splice(g, 1), --g;
                        else {
                            var l = h.mimeType;
                            h.codecs && (l += '; codecs="' + h.codecs + '"');
                            fb[l] || MediaSource.isTypeSupported(l) ||
                                (e.streams.splice(g, 1), --g)
                        }
                    }
                    0 == e.streams.length && (a.streamSets.splice(d, 1), --d)
                }
            }
            0 == a.streamSets.length && this.ka(new x(4, 4011))
        };

        function re(a) {
            if (a.f) {
                var b = Date.now() / 1E3;
                a.ta ? a.$ += b - a.la : a.na += b - a.la;
                a.la = b
            }
        }
        k.wb = function(a, b, c) {
            this.a.abr.manager.segmentDownloaded(a, b, c)
        };
        k.sb = function(a) {
            re(this);
            this.ta = a;
            this.dispatchEvent(new F("buffering", {
                Gb: a
            }))
        };
        k.vb = function() {
            if (this.b) {
                var a = this.b,
                    b;
                for (b in a.b) {
                    var c = a.b[b];
                    c.U || (0 < yb(a.c, b, rb(a.h), .1) ? c.J = !1 : c.J || (c.ba ? c.J = !0 : null == xb(a.c, b) ? null == c.T && Yd(a, c, 0) : (Nd(c), Vd(a, c))))
                }
            }
        };

        function qe(a, b) {
            var c = {};
            b.streamSets.forEach(function(a) {
                a.type in c || (c[a.type] = a)
            });
            b.streamSets.forEach(function(a) {
                a.primary && (c[a.type] = a)
            });
            var d = {
                audio: !1,
                text: !1
            };
            [2, 1, 0].forEach(function(a) {
                b.streamSets.forEach(function(b) {
                    var e;
                    "audio" == b.type ? e = this.a.preferredAudioLanguage : "text" == b.type && (e = this.a.preferredTextLanguage);
                    if (e) {
                        e = kb(e);
                        var l = kb(b.language);
                        if (l == e || 1 <= a && l == e.split("-")[0] || 2 <= a && l.split("-")[0] == e.split("-")[0]) d[b.type] = !0, c[b.type] = b
                    }
                }.bind(this))
            }.bind(a));
            var e =
                a.a.abr.manager.chooseStreams(c);
            c.text && (e.text = c.text.streams[0], c.audio && d.text && c.text.language != c.audio.language && (a.i.mode = "showing"));
            return e
        }
        k.tb = function(a) {
            this.R = !0;
            a = qe(this, a);
            for (var b in this.h) a[b] = this.h[b];
            this.h = {};
            for (var c in a) this.P.push({
                timestamp: Date.now() / 1E3,
                id: a[c].id,
                type: c,
                fromAdaptation: !0
            });
            this.pa || ne(this);
            return a
        };
        k.Ma = function() {
            this.R = !1;
            this.a.abr.enabled && this.a.abr.manager.enable();
            for (var a in this.h) Td(this.b, a, this.h[a]);
            this.h = {}
        };
        k.Ja = function(a) {
            var b = Rd(this.b),
                c;
            for (c in a) {
                var d = a[c];
                b[c] != d && this.P.push({
                    timestamp: Date.now() / 1E3,
                    id: d.id,
                    type: c,
                    fromAdaptation: !0
                })
            }
            if (this.b) {
                for (c in a) Td(this.b, c, a[c]);
                oe(this)
            }
        };

        function oe(a) {
            Promise.resolve().then(function() {
                this.c && this.dispatchEvent(new F("adaptation"))
            }.bind(a))
        }

        function ne(a) {
            Promise.resolve().then(function() {
                this.c && this.dispatchEvent(new F("trackschanged"))
            }.bind(a))
        }
        k.ka = function(a) {
            this.dispatchEvent(new F("error", {
                detail: a
            }))
        };
        k.bb = function() {
            if (this.c.error) {
                var a = this.c.error.code;
                if (1 != a) {
                    var b = this.c.error.msExtendedCode;
                    b && (0 > b && (b += Math.pow(2, 32)), b = b.toString(16));
                    this.ka(new x(3, 3016, a, b))
                }
            }
        };
        k.ub = function() {};
    }.call(g, this));
    if (typeof(module) != "undefined" && module.exports) module.exports = g.shaka;
    else if (typeof(define) != "undefined" && define.amd) define(function() {
        return g.shaka
    });
    else this.shaka = g.shaka;
})();
