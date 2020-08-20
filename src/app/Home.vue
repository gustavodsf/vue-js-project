<template>
  <main>
    <section class="hero has-background-secondary is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <h1 class="title is-size-3-mobile is-size-2-desktop is-spaced">
                {{ $t("home.view.home.title") }}
              </h1>

              <h2 class="subtitle is-size-4-mobile is-size-3-desktop">
                {{ $t("home.view.home.subtitle") }}
              </h2>

              <router-link
                class="button is-primary is-medium is-rounded"
                v-bind:class="{ 'is-outlined': !isMobile }"
                v-bind:to="{ name: 'singUp' }"
              >
                {{ $t("home.view.home.button.letsStart") }}
              </router-link>
            </div>

            <div class="column">
              <figure class="image">
                <img src="@/assets/img/create.svg" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="features"
      v-for="(feature, index) in features"
      v-bind:key="index"
    >
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-two-fifths" v-if="index % 2 === 0 || isMobile">
            <figure class="image">
              <img v-bind:src="feature.img" />
            </figure>
          </div>

          <div class="column">
            <h3 class="title">
              {{ feature.title }}
            </h3>
            <p class="is-size-5-mobile is-size-4-desktop">
              {{ feature.description }}
            </p>
          </div>

          <div class="column is-two-fifths" v-if="index % 2 !== 0 && !isMobile">
            <figure class="image">
              <img v-bind:src="feature.img" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      isMobile: false,
      features: [
        {
          title: this.$t("home.view.home.features.shareKnowledge.title"),
          description: this.$t(
            "home.view.home.features.shareKnowledge.description"
          ),
          img: require("@/assets/img/brainstorming.svg")
        },
        {
          title: this.$t("home.view.home.features.tellUsStory.title"),
          description: this.$t(
            "home.view.home.features.tellUsStory.description"
          ),
          img: require("@/assets/img/group-chat.svg")
        },
        {
          title: this.$t(
            "home.view.home.features.inviteOthersToCollaborate.title"
          ),
          description: this.$t(
            "home.view.home.features.inviteOthersToCollaborate.description"
          ),
          img: require("@/assets/img/live-collaboration.svg")
        },
        {
          title: this.$t(
            "home.view.home.features.bestResultsInYourOrganization.title"
          ),
          description: this.$t(
            "home.view.home.features.bestResultsInYourOrganization.description"
          ),
          img: require("@/assets/img/visual-data.svg")
        }
      ]
    };
  },
  methods: {
    onResize() {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
  },
  created() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped>
.features {
  padding: 5rem 1.5rem;
}

.features img {
  max-height: 300px;
}
</style>
