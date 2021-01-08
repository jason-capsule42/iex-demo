<template>
  <article>
    <a
      :href="article.url"
      target="_blank"
    >
      <div class="articleImg">
        <img
          :src="article.image"
          alt=""
        >
      </div>
      <div class="content">
        <p class="source">
          {{ article.source }} • {{ articleTime }}
        </p>
        <h2>
          {{ article.headline }}
        </h2>
        <p class="summary">
          {{ article.summary }}
        </p>
      </div>
    </a>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    //
  },
  props: {
    article: Object,
  },
})
export default class ArticleMin extends Vue {
  get articleTime() {
    let dateStr = '';

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date(this.$props.article.datetime);

    const dayName = days[d.getDay()].substring(0, 3);
    const monthName = months[d.getMonth()].substring(0, 3);
    const year = d.getFullYear().toString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    dateStr += dayName;
    dateStr += '. ';
    dateStr += monthName;
    dateStr += '. ';
    dateStr += year;
    dateStr += ' ';
    dateStr += time;

    return dateStr;
  }
}
</script>

<style lang="scss" scoped>
  @import './src/styles/_variables';

  article {
    a {
      display: flex;

      text-decoration: none;

      color: inherit;

      &:hover {
        h2 {
          color: #3677a8;
        }
      }
    }

    .articleImg {
      width: 25%;
      min-width: 150px;
    }

    .content {
      flex: 1;
    }

    img {
      width: 100%;
      max-height: 130px;

      object-fit: cover;
    }

    .source {
      margin-bottom: 5px;
      margin-bottom: 0;

      font-size: .7em;
      line-height: .9em;

      color: #959595;
    }

    h2 {
      font-size: 1.15em;
      font-weight: 700;
      line-height: 1.15em;

      transition: color $transition-speed-default;
    }

    .summary {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;

      font-size: .9em;

      text-overflow: ellipsis;

      -webkit-line-clamp: 2;
    }
  }

  @media screen and (max-width: 599px) {
    article {
      flex-direction: column;
    }
  }

  @media screen and (min-width: 600px) {
    article {
      flex-direction: row;
    }

    .articleImg {
      margin-right: 15px;
    }
  }

</style>
