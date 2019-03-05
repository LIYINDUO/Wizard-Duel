new Vue({
  el: "#app",
  data: {
    gameIsRunning: false,
    voldemortIsAttacking: false,
    harryHealth: 100,
    voldemortHealth: 100,
    ControlsIsDisabled: false,
    harryCastSpell: false,
    voldCastSpell: false,
    sectumsempra: false,
    protego: false,
    expecto: false,
    avadaKedavra: false,
    summonDementor: false,
    logs: [],
    intervalId: null
  },
  methods: {
    startGame() {
      this.logs = [];
      this.intervalId = null;
      this.gameIsRunning = true;
      this.voldemortIsAttacking = true;
      this.harryHealth = 100;
      this.voldemortHealth = 100;
    },
    attack() {
      this.ControlsIsDisabled = true;
      this.harryCastSpell = true;
      this.sectumsempra = true;
      setTimeout(() => {
        this.voldemortHealth -= 10;
        this.sectumsempra = false;
        this.harryCastSpell = false;
        this.ControlsIsDisabled = false;
        this.logs.unshift({
          isHarry: true,
          text: "Harry dealt 10 damages to Voldemort."
        });
        this.checkWin();
      }, 1000);
    },
    protect() {
      this.ControlsIsDisabled = true;
      this.harryCastSpell = true;
      this.protego = true;
      setTimeout(() => {
        this.protego = false;
        this.harryCastSpell = false;
        this.ControlsIsDisabled = false;
      }, 1000);
    },
    expectoPatronum() {
      this.ControlsIsDisabled = true;
      this.harryCastSpell = true;
      this.expecto = true;
      setTimeout(() => {
        this.expecto = false;
        this.harryCastSpell = false;
        this.ControlsIsDisabled = false;
      }, 1000);
    },
    checkWin() {
      if (!this.gameIsRunning) return;
      if (this.harryHealth <= 0) {
        clearInterval(this.intervalId);
        this.voldemortIsAttacking = false;
        setTimeout(() => {
          if (confirm("You Lost! New Game?")) {
            this.startGame();
          } else {
            this.gameIsRunning = false;
          }
        }, 1000);
      } else if (this.voldemortHealth <= 0) {
        clearInterval(this.intervalId);
        this.voldemortIsAttacking = false;
        setTimeout(() => {
          if (confirm("You Won! New Game?")) {
            this.gameIsRunning = false;
            this.startGame();
          } else {
            this.gameIsRunning = false;
          }
        }, 1000);
      }
    }
  },
  watch: {
    voldemortIsAttacking() {
      if (this.voldemortIsAttacking) {
        this.intervalId = setInterval(() => {
          let randomSpellIndex = Math.floor(Math.random() * 2);
          this.voldCastSpell = true;
          if (randomSpellIndex) {
            this.summonDementor = true;
          } else {
            this.avadaKedavra = true;
          }
          setTimeout(() => {
            this.voldCastSpell = false;
            if (randomSpellIndex) {
              this.summonDementor = false;
            } else {
              this.avadaKedavra = false;
            }
            if (randomSpellIndex === 0) {
              if (this.protego) {
                this.logs.unshift({
                  isHarry: true,
                  text: "Harry blocked the killing curse with a protego charm."
                });
              } else {
                this.harryHealth -= 20;
                this.logs.unshift({
                  isHarry: false,
                  text: "Voldemort dealt 20 damages to Harry."
                });
                this.checkWin();
              }
            } else {
              if (this.expecto) {
                this.logs.unshift({
                  isHarry: true,
                  text: "Harry cast the dementor away with a patronum charm."
                });
              } else {
                this.harryHealth -= 50;
                this.logs.unshift({
                  isHarry: false,
                  text: "Voldemort dealt 50 damages to Harry with a dementor."
                });
                this.checkWin();
              }
            }
          }, 1500);
        }, 3000);
      }
    }
  }
});
