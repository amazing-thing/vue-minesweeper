<script setup lang='ts'>
import confetti from 'canvas-confetti'
const props = defineProps<{
  passed: boolean
}>()

function generator() {
  const defaultConfetti = {
    particleCount: 100,
    angle: 90,
    circle: ['square'],
    gravity: 0.5,
  } as confetti.Options
  confetti({
    ...defaultConfetti,
    spread: 80,
    origin: { y: 0.6 },
  })

  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      spread: 80,
      origin: { x: 0.2, y: 0.6 },
    })
  }, 150)

  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      spread: 80,
      origin: { x: 0.8, y: 0.6 },
    })
  }, 300)

  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      angle: 45,
      spread: 80,
      origin: { x: 0, y: 1 },
    })
  }, 450)

  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      angle: 135,
      spread: 80,
      origin: { x: 1, y: 1 },
    })
  }, 450)
  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      angle: -45,
      spread: 80,
      gravity: -0.5,
      origin: { x: 0, y: 0 },
    })
  }, 450)

  setTimeout(() => {
    confetti({
      ...defaultConfetti,
      angle: -135,
      spread: 80,
      gravity: -0.5,
      origin: { x: 1, y: 0 },
    })
  }, 450)
}

watch(
  () => props.passed,
  () => {
    if (props.passed) {
      setTimeout(() => {
        generator()
      }, 300)
    }
  },
  {
    flush: 'post',
  },
)

</script>

<template>
  <div />
</template>

<style scoped>
</style>
