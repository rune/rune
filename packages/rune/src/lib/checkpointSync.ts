import { gql } from "@apollo/client/index.js"
import AdmZip from "adm-zip"
import fs from "fs"
import path from "path"
import fetch from "cross-fetch"

import { client } from "../apollo/client.js"

export const RUNE_JSON = "rune.json"

export interface RuneJson {
  gameKey: string
  base: string
  [key: string]: unknown
}

export function readRuneJson(dir: string): RuneJson | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, RUNE_JSON), "utf-8"))
  } catch {
    return null
  }
}

function writeRuneJson(dir: string, values: { gameKey: string; base: string }) {
  const existing = readRuneJson(dir) ?? {}
  fs.writeFileSync(
    path.join(dir, RUNE_JSON),
    JSON.stringify({ ...existing, ...values }, null, 2) + "\n"
  )
}

const CURRENT_CHECKPOINT = gql`
  query CurrentCheckpoint($gameKey: String!) {
    currentCheckpoint(gameKey: $gameKey)
  }
`

const CHECKPOINT_FILES = gql`
  query CheckpointFiles($gameKey: String!, $commitHash: String!) {
    checkpointFiles(gameKey: $gameKey, commitHash: $commitHash) {
      commitHash
      codeFiles {
        path
        content
      }
      assetFiles {
        path
        url
      }
    }
  }
`

const UPLOAD_CHECKPOINT = gql`
  mutation UploadCheckpoint(
    $gameKey: String!
    $content: Upload!
    $base: String!
    $release: Boolean
  ) {
    uploadCheckpoint(
      gameKey: $gameKey
      content: $content
      base: $base
      release: $release
    ) {
      commitHash
      previewLink
    }
  }
`

export async function currentCheckpoint(gameKey: string) {
  const { data } = await client.query({
    query: CURRENT_CHECKPOINT,
    variables: { gameKey },
    fetchPolicy: "no-cache",
  })
  return data.currentCheckpoint as string | null
}

// Paths the game owns; rune.json and dotfiles stay local.
function localGameFiles(dir: string, sub = ""): string[] {
  return fs
    .readdirSync(path.join(dir, sub), { withFileTypes: true })
    .flatMap((entry) => {
      const rel = path.posix.join(sub, entry.name)
      if (entry.name.startsWith(".") || entry.name === "node_modules") return []
      if (rel === RUNE_JSON) return []
      return entry.isDirectory() ? localGameFiles(dir, rel) : [rel]
    })
}

export async function pull(dir: string, gameKey: string) {
  const commitHash = await currentCheckpoint(gameKey)
  if (!commitHash) {
    throw new Error(
      "The game is between checkpoints (a revert may be running). Try again in a moment."
    )
  }
  const { data } = await client.query({
    query: CHECKPOINT_FILES,
    variables: { gameKey, commitHash },
    fetchPolicy: "no-cache",
  })
  const files = data.checkpointFiles

  fs.mkdirSync(dir, { recursive: true })
  const overwritten = localGameFiles(dir).length
  for (const stale of localGameFiles(dir)) fs.rmSync(path.join(dir, stale))

  for (const file of files.codeFiles) {
    const target = path.join(dir, file.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, file.content)
  }
  for (const asset of files.assetFiles) {
    const res = await fetch(asset.url)
    if (!res.ok) throw new Error(`Couldn't download ${asset.path}`)
    const target = path.join(dir, asset.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()))
  }

  writeRuneJson(dir, { gameKey, base: files.commitHash })
  return {
    commitHash: files.commitHash as string,
    fileCount: files.codeFiles.length + files.assetFiles.length,
    overwritten,
  }
}

export class PullFirstError extends Error {}

export async function uploadCheckpoint(dir: string, release: boolean) {
  const runeJson = readRuneJson(dir)
  if (!runeJson?.gameKey || !runeJson.base) {
    throw new PullFirstError(
      "No rune.json here. Run `rune pull <game key>` first to link this folder to its game."
    )
  }
  const { gameKey, base } = runeJson

  const current = await currentCheckpoint(gameKey)
  if (current !== base) {
    throw new PullFirstError(
      "The game changed in Rune since your last pull or upload. Run `rune pull` first."
    )
  }

  const zip = new AdmZip()
  for (const file of localGameFiles(dir)) {
    zip.addFile(file, fs.readFileSync(path.join(dir, file)))
  }

  try {
    const { data } = await client.mutate({
      mutation: UPLOAD_CHECKPOINT,
      variables: {
        gameKey,
        base,
        release,
        content: {
          name: "game.zip",
          content: zip.toBuffer(),
          type: "application/zip",
        },
      },
    })
    const commitHash = data.uploadCheckpoint.commitHash as string
    writeRuneJson(dir, { gameKey, base: commitHash })
    return {
      commitHash,
      previewLink: data.uploadCheckpoint.previewLink as string,
    }
  } catch (e) {
    const message = (e as Error).message
    if (/CHECKPOINT_MOVED/.test(message)) {
      throw new PullFirstError(
        "The game changed in Rune while uploading. Run `rune pull` first."
      )
    }
    throw e
  }
}
