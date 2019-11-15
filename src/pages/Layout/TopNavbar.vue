<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">

          <md-list>
            <md-list-item href="#/">
              <i class="material-icons">timeline</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>

            <li class="md-list-item">
              <a
                href="#"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
              >
                <div class="md-list-item-content">
                  <drop-down>
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>notifications</md-icon>
                      <span class="notification">{{this.noitification.length}}</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right" v-if="this.noitification.length>0">                     
                      <li v-for="noi in noitification" :key="noi"><a href="#">{{noi.type}} at {{noi.time}}</a></li>
                      <li><md-button @click="del()" class="md-danger btn-small" style="margin-left:5%">Remove all<md-icon>delete</md-icon></md-button></li>
                    </ul>
                    <ul class="dropdown-menu dropdown-menu-right" v-else>
                      <li><a href="">There are no new notifications</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import db from "@/pages/firebaseinit";
export default {
  data() {
    return {
      noitification:[],
    };
  },
  created() {
  db.collection("noitification")
    .orderBy("time")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          type: doc.data().type,
          time: doc.data().time,
        };
        this.noitification.push(data);
      });
    });
},
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    del(){
      for (let i = 0; i < this.noitification.length; i++) {
        db.collection('noitification').doc(this.noitification[i].id).delete();
      }
      for (let j = this.noitification.length-1; j >= 0; j--) {
        this.noitification.splice(j,1);
      }
    }
  },
}
</script>

<style lang="css"></style>
