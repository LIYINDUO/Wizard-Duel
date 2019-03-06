new Vue({
  el: "#app",
  data: {
    gameIsRunning: false,
    voldemortIsAttacking: false,
    harryHealth: 100,
    voldemortHealth: 100,
    harryIsCastingSpell: false,
    voldemortIsCastingSpell: false,
    controlsIsDisabled: false,
    harrySpells: {
      sectemSempra: false,
      protego: false,
      expectoPatronum: false
    },
    voldemortSpells: {
      avadaKedavra: false,
      summonDementor: false
    },
    logs: [],
    intervalId: null
  },
  methods: {
    startGame() {
      this.logs = [];
      this.intervalId = null;
      this.harryHealth = 100;
      this.voldemortHealth = 100;
      this.gameIsRunning = true;
      this.voldemortIsAttacking = true;
    },
    harryCastSpell(callback) {
      this.harryIsCastingSpell = true;
      this.controlsIsDisabled = true;
      setTimeout(() => {
        this.harryIsCastingSpell = false;
        this.controlsIsDisabled = false;
        callback();
      }, 1200);
    },
    castSectumSempra() {
      this.harrySpells.sectemSempra = true;
      const intervalIdTemp = this.intervalId;
      this.harryCastSpell(() => {
        if (intervalIdTemp !== this.intervalId) return;
        this.harrySpells.sectemSempra = false;
        this.voldemortHealth -= 10;
        this.logs.unshift({
          isHarry: true,
          text: "Harry dealt 10 damages to voldemort using sectumsempra."
        });
        this.checkWin();
      });
    },
    castProtego() {
      this.harrySpells.protego = true;
      this.harryCastSpell(() => {
        this.harrySpells.protego = false;
      });
    },
    castExpectoPatronum() {
      this.harrySpells.expectoPatronum = true;
      this.harryCastSpell(() => {
        this.harrySpells.expectoPatronum = false;
      });
    },
    checkWin() {
      if (this.voldemortHealth <= 0) {
        this.voldemortIsAttacking = false;
        clearInterval(this.intervalId);
        setTimeout(() => {
          if (confirm("You Won! Start new game?")) {
            this.gameIsRunning = false;
            this.startGame();
          } else {
            this.gameIsRunning = false;
          }
        }, 100);
      } else if (this.harryHealth <= 0) {
        this.voldemortIsAttacking = false;
        clearInterval(this.intervalId);
        setTimeout(() => {
          if (confirm("You Lost! Start new game?")) {
            this.gameIsRunning = false;
            this.startGame();
          } else {
            this.gameIsRunning = false;
          }
        }, 100);
      }
    }
  },
  watch: {
    voldemortIsAttacking() {
      if (this.voldemortIsAttacking) {
        this.intervalId = setInterval(() => {
          let spellIndex = Math.floor(Math.random() * 2);
          if (spellIndex === 0) {
            // avadaKedavra
            this.voldemortIsCastingSpell = true;
            this.voldemortSpells.avadaKedavra = true;
            const intervalIdTemp = this.intervalId;
            setTimeout(() => {
              this.voldemortIsCastingSpell = false;
              this.voldemortSpells.avadaKedavra = false;
              if (this.harrySpells.protego) {
                this.logs.unshift({
                  isHarry: true,
                  text: "Harry blocked the killing curse using protego."
                });
              } else {
                if (intervalIdTemp !== this.intervalId) return;
                this.harryHealth -= 20;
                this.logs.unshift({
                  isHarry: false,
                  text:
                    "Voldemort dealt 20 damages to Harry using avada kedavra."
                });
                this.checkWin();
              }
            }, 1600);
          } else if (spellIndex === 1) {
            // summonDementor
            this.voldemortIsCastingSpell = true;
            this.voldemortSpells.summonDementor = true;
            const intervalIdTemp = this.intervalId;
            setTimeout(() => {
              this.voldemortIsCastingSpell = false;
              this.voldemortSpells.summonDementor = false;
              if (this.harrySpells.expectoPatronum) {
                this.logs.unshift({
                  isHarry: true,
                  text: "Harry casted the dementor away using his patronum."
                });
              } else {
                if (intervalIdTemp !== this.intervalId) return;
                this.harryHealth -= 50;
                this.logs.unshift({
                  isHarry: false,
                  text:
                    "Voldemort dealt 50 damages to Harry through a dementor."
                });
                this.checkWin();
              }
            }, 1600);
          }
        }, 3000);
      }
    }
  }
});
