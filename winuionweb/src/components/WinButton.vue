<template>
  <button class="win-btn" :class="{ primary }"><slot></slot></button>
</template>
<script setup>defineProps({ primary: Boolean });</script>
<style src="../styles/button.css"></style>
