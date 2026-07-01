const readline = require('node:readline');


class Red_Black_Game {
	constructor() {
		this.user_color_choice = "";
		this.random_color = "";
		this.colors = [
			"r",
			"n"
		];
		this.win = false;
	}
	generate_random_color() {
		const random_nb = Math.floor(Math.random() * this.colors.length);
		const random_color = this.colors[random_nb]
		return random_color;
	}
	async get_color() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		while(true) {
			let color = "";
			const answer = await new Promise(resolve =>
				rl.question("Couleur (r/n) : ", resolve)
			)
			color = answer
			if(this.colors.includes(color)) {
				rl.close();
				return color;
			}
		}
	}
	async start() {
		this.random_color = this.generate_random_color();
		this.user_color_choice = await this.get_color();
		if(this.random_color === this.user_color_choice) {
			return this.win = true;
		}
		return this.win;
	}
}

 module.exports = Red_Black_Game;