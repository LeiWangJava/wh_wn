var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function bytesToHex(r) {
    for (var t = [], n = 0; n < r.length; n++) t.push((r[n] >>> 4).toString(16)), t.push((15 & r[n]).toString(16));
    return t.join("");
}

function hexToBytes(r) {
    for (var t = [], n = 0; n < r.length; n += 2) t.push(parseInt(r.substr(n, 2), 16));
    return t;
}

function wordsToBytes(r) {
    for (var t = [], n = 0; n < 32 * r.length; n += 8) t.push(r[n >>> 5] >>> 24 - n % 32 & 255);
    return t;
}
function bytesToString(n) {
    for (var e = [], r = 0; r < n.length; r++) e.push(String.fromCharCode(n[r]));
    return e.join("");
}

function stringToBytes(n) {
    for (var e = [], r = 0; r < n.length; r++) e.push(255 & n.charCodeAt(r));
    return e;
}

function getNoncestr() {
    return (0, md)(Math.round(1e9 * Math.random()));
}

function md(n, e) {
    if (void 0 === n || null === n) throw new Error("Illegal argument " + n);
    var o = wordsToBytes(i(n, e));
    return e && e.asBytes ? o : e && e.asString ? bytesToString(o) : bytesToHex(o);
}

 function sortParams(e) {
    var t = Object.keys(e), r = {};
    return t.length > 0 ? (t.sort(), t.forEach(function(t) {
        var n = e[t];
        r[t] = encodeURIComponent(n);
    })) : r = [], r;
}

 function signPost(e, t, r, n) {
    var a = (sortParams(e), [ "key=" + r, "noncestr=" + t, "timestamp=" + n ]);
    return (0, entry)(a.join("&"));
}
function entry(e, s) {
    var o = wordsToBytes(n(e));
    return s && s.asBytes ? o : s && s.asString ? bytesToString(o) : bytesToHex(o);
}

function n(t) {
    t.constructor == String ? t = stringToBytes(t) : "undefined" != typeof Buffer && "function" == typeof Buffer.isBuffer && Buffer.isBuffer(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || (t = t.toString());
    var n = bytesToWords(t), s = 8 * t.length, o = [], i = 1732584193, f = -271733879, c = -1732584194, u = 271733878, a = -1009589776;
    n[s >> 5] |= 128 << 24 - s % 32, n[15 + (s + 64 >>> 9 << 4)] = s;
    for (var y = 0; y < n.length; y += 16) {
        for (var g = i, l = f, B = c, p = u, v = a, d = 0; d < 80; d++) {
            if (d < 16) o[d] = n[y + d]; else {
                var h = o[d - 3] ^ o[d - 8] ^ o[d - 14] ^ o[d - 16];
                o[d] = h << 1 | h >>> 31;
            }
            var b = (i << 5 | i >>> 27) + a + (o[d] >>> 0) + (d < 20 ? 1518500249 + (f & c | ~f & u) : d < 40 ? 1859775393 + (f ^ c ^ u) : d < 60 ? (f & c | f & u | c & u) - 1894007588 : (f ^ c ^ u) - 899497514);
            a = u, u = c, c = f << 30 | f >>> 2, f = i, i = b;
        }
        i += g, f += l, c += B, u += p, a += v;
    }
    return [ i, f, c, u, a ];
}

function generateKey() {
    var e = new Date(),
        t = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
    return {
        timestamp: t,
        key: (0, md)(t.toString(2))
    };
}
function isBuffer(f) {
    return !!f.constructor && "function" == typeof f.constructor.isBuffer && f.constructor.isBuffer(f);
}

function isSlowBuffer(f) {
    return "function" == typeof f.readFloatLE && "function" == typeof f.slice && isBuffer(f.slice(0, 0));
}
function e(f) {
    return null != f && (isBuffer(f) || isSlowBuffer(f) || !!f._isBuffer);
}
function bytesToWords(r) {
    for (var t = [], n = 0, o = 0; n < r.length; n++, o += 8) t[o >>> 5] |= r[n] << 24 - o % 32;
    return t;
}
function _ff(r, n, e, t, i, o, s) {
    var a = r + (n & e | ~n & t) + (i >>> 0) + s;
    return (a << o | a >>> 32 - o) + n;
}

function _gg(r, n, e, t, i, o, s) {
    var a = r + (n & t | e & ~t) + (i >>> 0) + s;
    return (a << o | a >>> 32 - o) + n;
}

function _hh(r, n, e, t, i, o, s) {
    var a = r + (n ^ e ^ t) + (i >>> 0) + s;
    return (a << o | a >>> 32 - o) + n;
}

function _ii(r, n, e, t, i, o, s) {
    var a = r + (e ^ (n | ~t)) + (i >>> 0) + s;
    return (a << o | a >>> 32 - o) + n;
}

function rotl(r, t) {
    return r << t | r >>> 32 - t;
}
function endian(r) {
    if (r.constructor == Number) return 16711935 & rotl(r, 8) | 4278255360 & rotl(r, 24);
    for (var n = 0; n < r.length; n++) r[n] = endian(r[n]);
    return r;
}
function i(o, s) {
    o.constructor == String ? o = s && "binary" === s.encoding ? stringToBytes(o) : stringToBytes(o) : e(o) ? o = Array.prototype.slice.call(o, 0) : Array.isArray(o) || (o = o.toString());
    for (var a = bytesToWords(o), c = 8 * o.length, u = 1732584193, f = -271733879, g = -1732584194, y = 271733878, l = 0; l < a.length; l++)
        a[l] = 16711935 & (a[l] << 8 | a[l] >>> 24) | 4278255360 & (a[l] << 24 | a[l] >>> 8);
    a[c >>> 5] |= 128 << c % 32,
        a[14 + (c + 64 >>> 9 << 4)] = c;
    for (var h = _ff, v = _gg, _ = _hh, d = _ii, l = 0; l < a.length; l += 16) {
        var b = u
            , T = f
            , p = g
            , j = y;
        u = h(u, f, g, y, a[l + 0], 7, -680876936),
            y = h(y, u, f, g, a[l + 1], 12, -389564586),
            g = h(g, y, u, f, a[l + 2], 17, 606105819),
            f = h(f, g, y, u, a[l + 3], 22, -1044525330),
            u = h(u, f, g, y, a[l + 4], 7, -176418897),
            y = h(y, u, f, g, a[l + 5], 12, 1200080426),
            g = h(g, y, u, f, a[l + 6], 17, -1473231341),
            f = h(f, g, y, u, a[l + 7], 22, -45705983),
            u = h(u, f, g, y, a[l + 8], 7, 1770035416),
            y = h(y, u, f, g, a[l + 9], 12, -1958414417),
            g = h(g, y, u, f, a[l + 10], 17, -42063),
            f = h(f, g, y, u, a[l + 11], 22, -1990404162),
            u = h(u, f, g, y, a[l + 12], 7, 1804603682),
            y = h(y, u, f, g, a[l + 13], 12, -40341101),
            g = h(g, y, u, f, a[l + 14], 17, -1502002290),
            f = h(f, g, y, u, a[l + 15], 22, 1236535329),
            u = v(u, f, g, y, a[l + 1], 5, -165796510),
            y = v(y, u, f, g, a[l + 6], 9, -1069501632),
            g = v(g, y, u, f, a[l + 11], 14, 643717713),
            f = v(f, g, y, u, a[l + 0], 20, -373897302),
            u = v(u, f, g, y, a[l + 5], 5, -701558691),
            y = v(y, u, f, g, a[l + 10], 9, 38016083),
            g = v(g, y, u, f, a[l + 15], 14, -660478335),
            f = v(f, g, y, u, a[l + 4], 20, -405537848),
            u = v(u, f, g, y, a[l + 9], 5, 568446438),
            y = v(y, u, f, g, a[l + 14], 9, -1019803690),
            g = v(g, y, u, f, a[l + 3], 14, -187363961),
            f = v(f, g, y, u, a[l + 8], 20, 1163531501),
            u = v(u, f, g, y, a[l + 13], 5, -1444681467),
            y = v(y, u, f, g, a[l + 2], 9, -51403784),
            g = v(g, y, u, f, a[l + 7], 14, 1735328473),
            f = v(f, g, y, u, a[l + 12], 20, -1926607734),
            u = _(u, f, g, y, a[l + 5], 4, -378558),
            y = _(y, u, f, g, a[l + 8], 11, -2022574463),
            g = _(g, y, u, f, a[l + 11], 16, 1839030562),
            f = _(f, g, y, u, a[l + 14], 23, -35309556),
            u = _(u, f, g, y, a[l + 1], 4, -1530992060),
            y = _(y, u, f, g, a[l + 4], 11, 1272893353),
            g = _(g, y, u, f, a[l + 7], 16, -155497632),
            f = _(f, g, y, u, a[l + 10], 23, -1094730640),
            u = _(u, f, g, y, a[l + 13], 4, 681279174),
            y = _(y, u, f, g, a[l + 0], 11, -358537222),
            g = _(g, y, u, f, a[l + 3], 16, -722521979),
            f = _(f, g, y, u, a[l + 6], 23, 76029189),
            u = _(u, f, g, y, a[l + 9], 4, -640364487),
            y = _(y, u, f, g, a[l + 12], 11, -421815835),
            g = _(g, y, u, f, a[l + 15], 16, 530742520),
            f = _(f, g, y, u, a[l + 2], 23, -995338651),
            u = d(u, f, g, y, a[l + 0], 6, -198630844),
            y = d(y, u, f, g, a[l + 7], 10, 1126891415),
            g = d(g, y, u, f, a[l + 14], 15, -1416354905),
            f = d(f, g, y, u, a[l + 5], 21, -57434055),
            u = d(u, f, g, y, a[l + 12], 6, 1700485571),
            y = d(y, u, f, g, a[l + 3], 10, -1894986606),
            g = d(g, y, u, f, a[l + 10], 15, -1051523),
            f = d(f, g, y, u, a[l + 1], 21, -2054922799),
            u = d(u, f, g, y, a[l + 8], 6, 1873313359),
            y = d(y, u, f, g, a[l + 15], 10, -30611744),
            g = d(g, y, u, f, a[l + 6], 15, -1560198380),
            f = d(f, g, y, u, a[l + 13], 21, 1309151649),
            u = d(u, f, g, y, a[l + 4], 6, -145523070),
            y = d(y, u, f, g, a[l + 11], 10, -1120210379),
            g = d(g, y, u, f, a[l + 2], 15, 718787259),
            f = d(f, g, y, u, a[l + 9], 21, -343485551),
            u = u + b >>> 0,
            f = f + T >>> 0,
            g = g + p >>> 0,
            y = y + j >>> 0;
    }
    return endian([u, f, g, y]);
};

/*function sign() {
    var arr = ["a", "b", "c"];
    return Object.keys(arr)
}*/

function sign() {
    var t = getNoncestr(),
        r =  generateKey(),
        f = {"tour_id":"11155","card_code":"hda","sysInfo":{"brand":"devtools","model":"iPhone 5","system":"iOS 10.0.1","version":"8.0.5"}}
    return "noncestr=" +  t+"&timestamp=" + r.timestamp+"&sign=" + signPost(f, t, r.key, r.timestamp)
}