<template>
  <DsfrModal
    title="Certification de la base"
    :opened="true"
    @close="$emit('close')"
  >
    <TextBlock slug="baseCertificationModal" />
  </DsfrModal>
</template>
