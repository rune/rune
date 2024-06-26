import { add } from "./logic"
import { equalsB } from "./b"

export function equals() {
  return add(1, 2) + equalsB()
}
