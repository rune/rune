<script setup lang="ts">
const props = defineProps<{
  cellIndex: number
  playerIndex: number
  dim: boolean
}>()

function claimCell() {
  Dusk.actions.claimCell(props.cellIndex)
}
</script>

<template>
  <button :class="[`player${playerIndex}`, dim ? 'dimmed' : '']" @click="claimCell"></button>
</template>
