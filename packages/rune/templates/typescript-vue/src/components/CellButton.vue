<script setup lang="ts">
const props = defineProps<{
  cellIndex: number
  playerIndex: number
  dim: boolean
  dataText?: string
}>()

function claimCell() {
  Rune.actions.claimCell(props.cellIndex)
}
</script>

<template>
  <button
    :class="[`player${playerIndex}`, dim ? 'dimmed' : '']"
    :data-text="dataText"
    @click="claimCell"
  />
</template>
