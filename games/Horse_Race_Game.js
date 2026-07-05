const readline = require("node:readline");

class Horse_Race_Game {
	constructor() {
		
		// horses
		this.user_horse = 0;
		this.horses_states = [];
		this.horse_head = "O";
		this.winner_horses = [];
		this.max_horses = 40;
		this.horses_nb = 4;
		
		// state
		this.max_state = 200;
		this.max_progress = 5;
		this.start_state = 1;
		
		// race
		this.win = false;
		this.race_end = false;
		this.race_separator = 5;
		this.race_speed = 100; //ms
		
		
	}
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	generate_random_progress() {
		const progress =  this.max_progress + 1;
		let rand_progress = Math.floor(Math.random() * progress);
		return rand_progress;
	}
	async drawHorses() {
		let road = "";
		let progress = 0;
		let state = 0;
		if(this.horses_nb > this.max_horses) {
			this.horses_nb = this.max_horses;
		}
		while(true) {
			for(let i = 0 ; i < this.race_separator ; i ++) {
				console.log("");
			}
			for(let i = 0 ; i<this.horses_nb ; i ++) {
				if(!this.horses_states[i]) {
					this.horses_states[i] = this.start_state;
				} else {
					progress = await this.generate_random_progress();
					if(this.horses_states[i] + progress >= this.max_state) {
						progress = this.max_state - this.horses_states[i];
					}
					this.horses_states[i] += progress;
				}
				console.log(i,", mètres", this.horses_states[i]);
				
				road = "-".repeat(this.horses_states[i]) + this.horse_head;
				console.log(road);
			}
			this.horses_states.forEach((state, i) => {
				if(state >= this.max_state) {
					this.winner_horses.push(i);
					this.race_end = true;
				}
			})
			if(this.race_end) {
				return;
			}
			await this.sleep(this.race_speed);
		}
	}
	async choose_horse() {
		const rl = new readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		while(true) {
			let horse = 0;
			const res = await new Promise(resolve => {
				rl.question("Numéro de cheval : ", resolve);
			})
			horse = Number(res);
			if(Number.isInteger(horse) && horse >= 0 && horse < this.horses_nb) {
				rl.close();
				return horse;
			}
		}
	}
	async start() {
		console.log("Chevaux en course : ", 0, "-", this.horses_nb - 1);
		this.user_horse = await this.choose_horse();
		await this.drawHorses();
		console.log("Numéros gagnants : ", this.winner_horses);
		console.log("Votre numéro : ", this.user_horse);


		if(this.winner_horses.includes(this.user_horse)) {
			return this.win = true;
		}
		return this.win = false;
	}
}
module.exports = Horse_Race_Game;