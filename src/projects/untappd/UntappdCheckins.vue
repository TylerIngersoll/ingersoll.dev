<template>
  <article class="untappedData">
    <h2>The last few beers I've sipped (according to Untappd)</h2>
    <div v-if="untappdData" class="beers">
      <img
        v-for="(beerItem, index) in recentBeer"
        class="icon"
        :key="index"
        :src="beerItem.beer.beer_label"
        :alt="beerItem.beer.beer_name"
      />
    </div>
  </article>
</template>

<script>
import { getApiData } from '@/services/api.service';

export default {
  name: "UntappdCheckins",

  props: {
    user: {
      type: String,
      default: "drinkingisawesome",
    },

    numberOfBeers: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      untappdData: undefined,
    };
  },

  computed: {
    beerData() {
      return this.untappdData
        ? this.untappdData.response.checkins.items
        : null;
    },

    recentBeer() {
      const lastBeers = [];
      if (this.beerData) {
        const beerIds = this.beerData.map((item) => item.beer.bid);
        const uniqueBeerIds = [...new Set(beerIds)];
        const recentBeerIds = uniqueBeerIds.slice(0, this.numberOfBeers);

        recentBeerIds.forEach((item) => {
          lastBeers.push(
            this.beerData.find((beerData) => beerData.beer.bid === item)
          );
        });
      }

      return lastBeers;
    },
  },

  methods: {
    async getUntappdData() {
      const domain = "https://api.untappd.com";
      const api = "v4";
      const method = "user/checkins";
      const clientId = "01424C2929B46EF03F1E12DD01A85B9EFDDC2D48";
      const clientSecret = "2A127A13659130B32D920E6E2E371ECF318526B9";
      const apiUrl = `${domain}/${api}/${method}/${
        this.user
      }?client_id=${clientId}&client_secret=${clientSecret}`;

     const apiData = await getApiData(apiUrl);
      this.untappdData = apiData;
    },
  },
  mounted() {
    // this.getUntappdData();
  },
};
</script>

<style lang="scss" scoped>
.beers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 1rem 0 0;
}

.icon {
  display: inline-block;
  width: 100%;
  height: auto;
  max-width: 50px;
  margin: 0.5rem 0.5rem 0 0;

  @media screen and (min-width: 768px) {
    max-width: 100px;
  }
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}
</style>
