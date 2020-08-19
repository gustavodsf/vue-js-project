<template>
  <section class="section">
    <div class="container has-text-centered">
      <figure class="image">
        <img src="@/assets/img/page-not-found.svg">
      </figure>

      <p class="is-size-3 m-t-5">
        {{ $t('404.pageNotFound') }}
      </p>

      <router-link
        class="button is-primary is-rounded is-medium m-t-3"
        v-bind:to="{ name: 'home' }">
        {{ $t('404.button.backToHome') }}
      </router-link>
    </div>
  </section>
</template>

<style scoped>
img {
  max-height: 300px;
}
</style>
