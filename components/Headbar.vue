<template>
  <div class="headbar">
    <header ref="header" class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <div class="nav-icon" :class="{hide: !isMenuHidden}" @click="toggleMenu">
            <span />
            <span />
            <span />
            <span />
          </div>
        </el-col>
        <el-col :span="6">
          <span>Team: </span>
          <el-select :value="team" @change="changeTeam">
            <el-option
              v-for="team in teams"
              :key="team"
              :label="team"
              :value="team">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>Region: </span>
          <el-select :value="realm" @change="changeRealm">
            <el-option
              v-for="realm in realms"
              :key="realm"
              :label="realm"
              :value="realm">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </header>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import { Component, Getter, Inject } from 'nuxt-property-decorator'

@Component({
  methods: {
    ...mapActions(['toggleMenu', 'changeRealm', 'changeTeam'])
  }
})
export default class Headbar extends Vue {
  @Getter isMenuHidden
  @Getter realm
  @Getter realms
  @Getter team
  @Getter teams
}
</script>

<style lang="scss" scoped>
.headbar {
  height: 60px;
  position: relative;
  .header {
    @media (max-width: 768px) {
      .el-col p span {
        display: none;
      }
    }
    width: 100%;
    height: 60px;
    z-index: 100;
    line-height: 60px;
    border-bottom: 1px solid #c0ccda;
    transition: all 0.5s ease;
  }
}
</style>
