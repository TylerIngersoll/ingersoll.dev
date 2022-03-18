<template>
  <div v-if="data.untappdData" class="beers">
    <template v-if="icons">
      <template v-for="(beerItem, index) in beerData">
        <div v-if="index + 1 <= maxItems" class="beer" :key="index">
          <img
            class="icon"
            :src="beerItem.beer.beer_label"
            :alt="beerItem.beer.beer_name"
            @click="onIconClick"
          />
          <div class="info">
            <img
              class="icon"
              :src="beerItem.beer.beer_label"
              :alt="beerItem.beer.beer_name"
            />
            <h3 v-html="beerItem.beer.beer_name" />
            <p v-html="beerItem.beer.beer_description" />
          </div>
        </div>
      </template>
    </template>

    <ul v-else-if="list">
      <li v-for="(beerItem, index) in beerData" :key="index">
        ({{ beerItem.count }}) <strong v-html="beerItem.beer.beer_name" /> by
        <em v-html="beerItem.brewery.brewery_name" /> <br />{{
          beerItem.beer.beer_style
        }}
        / {{ beerItem.beer.beer_abv }}% ABV
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, reactive, inject, computed, onMounted } from "vue";
import { getApiData } from "@/services/api.service";

const mediaQuery = inject("mediaQuery");

const untappd = defineProps({
  heading: {
    type: String,
  },
  content: {
    type: Array,
    default: () => [],
  },
  sort: {
    type: String,
  },
  user: {
    type: String,
    default: "drinkingisawesome",
  },
  limit: {
    type: String,
    default: "10",
  },
  icons: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Boolean,
    default: false,
  },
});

const data = reactive({
  untappdData: undefined,
});

const beerData = computed(() => {
  return data.untappdData ? data.untappdData.response.beers.items : null;
});

const maxItems = computed(() => {
  return mediaQuery.isSmall ? 9 : untappd.limit;
});

const getUntappdData = async () => {
  const domain = "https://api.untappd.com";
  const api = "v4";
  const method = "user/beers";
  const clientId = process.env.VUE_APP_UNTAPPD_CLIENT_ID;
  const clientSecret = process.env.VUE_APP_UNTAPPD_CLIENT_SECRET;
  const apiUrl = `${domain}/${api}/${method}/${untappd.user}?client_id=${clientId}&client_secret=${clientSecret}&limit=${untappd.limit}&sort=${untappd.sort}`;

  const apiData = await getApiData(apiUrl);
  data.untappdData = apiData;
};

const onIconClick = () => {
  // console.log('click', e);
};

onMounted(() => {
  getUntappdData();
});
</script>

<style lang="scss" scoped>
.beers {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  margin: 2rem -0.5rem 0;
}

.beer {
  flex: 1 0 33.333%;
  padding: 0.5rem;

  @media screen and (min-width: 480px) {
    flex: 1 0 20%;
  }
}

.icon {
  width: 100%;
  height: auto;
  box-shadow: 0;
  transition: all 0.25s;
  border: 2px solid #ff6f69;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
      rgba(0, 0, 0, 0.05) 0px 5px 10px;
    border: 2px solid #000;
  }
}

.info {
  display: none;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
