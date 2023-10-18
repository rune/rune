export function GettingReadyScreen() {
  return (
    <div
      style={{ color: "white", position: "absolute", left: "50%", top: "50%" }}
    >
      <button onClick={() => Rune.actions.setReady()}>ready</button>
    </div>
  )
}
