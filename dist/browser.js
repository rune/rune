var Rune = (function () {
  "use strict"
  var e = function () {
      return (
        (e =
          Object.assign ||
          function (e) {
            for (var n, t = 1, r = arguments.length; t < r; t++)
              for (var o in (n = arguments[t]))
                Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
            return e
          }),
        e.apply(this, arguments)
      )
    },
    n = "RUNE_MSG;"
  function t(t) {
    return (
      (o = (r = { runeGameEvent: t }).runeGameEvent
        ? r.runeGameEvent
        : r.runeGameCommand),
      (i = e(e({}, r), o)),
      "".concat(n).concat(JSON.stringify(i))
    )
    var r, o, i
  }
  function r(e) {
    return (function (e, t) {
      if (
        !(function (e) {
          return "string" == typeof e.data && e.data.startsWith(n)
        })(e)
      )
        return null
      var r =
        "string" == typeof e.data ? ((o = e.data), JSON.parse(o.slice(n.length))) : e.data
      var o
      if (!r[t])
        throw new Error(
          "Wrong message received. Expected to find: "
            .concat(t, ", but the message was: ")
            .concat(JSON.stringify(r))
        )
      return r[t]
    })(e, "runeGameCommand")
  }
  var o,
    i,
    a = !1,
    u = {
      version: "1.5.0",
      init: function (e) {
        if (u._doneInit) throw new Error("Rune.init() should only be called once")
        u._doneInit = !0
        var n = e || {},
          t = n.startGame,
          r = n.resumeGame,
          o = n.pauseGame,
          i = n.getScore
        if ("function" != typeof t)
          throw new Error("Invalid startGame function provided to Rune.init()")
        if ("function" != typeof r)
          throw new Error("Invalid resumeGame function provided to Rune.init()")
        if ("function" != typeof o)
          throw new Error("Invalid pauseGame function provided to Rune.init()")
        if ("function" != typeof i)
          throw new Error("Invalid getScore function provided to Rune.init()")
        u._validateScore(i()),
          (u._startGame = function () {
            return a && u._resetDeterministicRandom(), (a = !0), t()
          }),
          (u._resumeGame = r),
          (u._pauseGame = o),
          (u._getScore = i),
          window.postRuneEvent &&
            window.postRuneEvent({ type: "INIT", version: u.version })
      },
      gameOver: function () {
        var e
        if (!u._doneInit) throw new Error("Rune.gameOver() called before Rune.init()")
        var n = u._getScore()
        u._validateScore(n),
          null === (e = window.postRuneEvent) ||
            void 0 === e ||
            e.call(window, {
              type: "GAME_OVER",
              score: n,
              challengeNumber: u.getChallengeNumber(),
            })
      },
      getChallengeNumber: function () {
        var e
        return null !== (e = window._runeChallengeNumber) && void 0 !== e ? e : 1
      },
      deterministicRandom: function () {
        return u._resetDeterministicRandom(), u.deterministicRandom()
      },
      _doneInit: !1,
      _requestScore: function () {
        var e,
          n = u._getScore()
        u._validateScore(n),
          null === (e = window.postRuneEvent) ||
            void 0 === e ||
            e.call(window, {
              type: "SCORE",
              score: n,
              challengeNumber: u.getChallengeNumber(),
            })
      },
      _startGame: function () {
        throw new Error("Rune._startGame() called before Rune.init()")
      },
      _resumeGame: function () {
        throw new Error("Rune._resumeGame() called before Rune.init()")
      },
      _pauseGame: function () {
        throw new Error("Rune._pauseGame() called before Rune.init()")
      },
      _getScore: function () {
        throw new Error("Rune._getScore() called before Rune.init()")
      },
      _validateScore: function (e) {
        if ("number" != typeof e)
          throw new Error("Score is not a number. Received: ".concat(typeof e))
        if (e < 0 || e > Math.pow(10, 9))
          throw new Error("Score is not between 0 and 1000000000. Received: ".concat(e))
        if (!Number.isInteger(e))
          throw new Error("Score is not an integer. Received: ".concat(e))
      },
      _randomNumberGenerator: function (e) {
        var n = u._hashFromString(e.toString())
        return function () {
          var e = (n += 1831565813)
          return (
            (e = Math.imul(e ^ (e >>> 15), 1 | e)),
            (((e ^= e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ (e >>> 14)) >>> 0) /
              4294967296
          )
        }
      },
      _hashFromString: function (e) {
        for (var n = 0, t = 1779033703 ^ e.length; n < e.length; n++)
          t = ((t = Math.imul(t ^ e.charCodeAt(n), 3432918353)) << 13) | (t >>> 19)
        return (
          (t = Math.imul(t ^ (t >>> 16), 2246822507)),
          (t = Math.imul(t ^ (t >>> 13), 3266489909)),
          (t ^= t >>> 16) >>> 0
        )
      },
      _resetDeterministicRandom: function () {
        u.deterministicRandom = u._randomNumberGenerator(u.getChallengeNumber())
      },
    }
  return (
    window.localStorage && window.localStorage.clear(),
    window.sessionStorage && window.sessionStorage.clear(),
    new URLSearchParams(window.location.search).get("enableInitialOverlayInBrowser") &&
      document.addEventListener("DOMContentLoaded", function () {
        var e = document.createElement("div")
        e.setAttribute(
          "style",
          "top: 0; bottom: 0; left: 0; right: 0; width: 100vw; height: 100vh; position: absolute; z-index: 9999;"
        ),
          e.addEventListener("click", function () {
            e.remove(),
              window.postRuneEvent &&
                window.postRuneEvent({ type: "BROWSER_INITIAL_OVERLAY_CLICKED" })
          }),
          document.body.appendChild(e),
          window.postRuneEvent && window.postRuneEvent({ type: "BROWSER_IFRAME_LOADED" })
      }),
    (i = +(null !==
      (o = new URLSearchParams(window.location.search).get("challengeNumber")) &&
    void 0 !== o
      ? o
      : "1")),
    Number.isInteger(i) && (window._runeChallengeNumber = i),
    (window.postRuneEvent = function (e) {
      var n = t(e)
      window.ReactNativeWebView
        ? window.ReactNativeWebView.postMessage(n)
        : window.parent.postMessage(n, "*")
    }),
    window.addEventListener("message", function (e) {
      if (window.Rune) {
        var n = r(e)
        if (!n) return
        if (!n.type || !window.Rune[n.type])
          throw new Error("Received incorrect message!: ".concat(n))
        window.Rune[n.type]()
      }
    }),
    u
  )
})()
