<template>
    <div class="container">
        <h1>CRUD MP3</h1>
        <Mp3Form />
        <Mp3List />
        <Mp3Modal />
    </div>
</template>
<script setup lang="ts">
import Mp3Form from '@/components/mp3/Mp3Form.vue';
import Mp3Modal from '@/components/mp3/Mp3Modal.vue';
import Mp3List from '@/components/Mp3List.vue';

</script>