const { resolve } = require('node:dns');
const readline = require('node:readline');

// games
const game_path = "./games/";
const Red_Black_Game = require(game_path + "Red_Black_Game.js");
const Found_The_Quenn_Game = require(game_path + "Found_The_Quenn_Game.js");
const Horse_Race_Game = require(game_path + "Horse_Race_Game.js");


class Game_Session {
	constructor() {
		this.start_money = 100;
		this.money = this.start_money;
		this.bet = 0;
		this.last_bet = 0;
		this.games_names = [
			"Rouge ou Noir",
			"!!! Trouve la Dame",
			"Course de chevaux"
		]
		this.options = {
			exit: "exit"
		};
		// game_state
		this.end_message = {
			w: "Gagné + ",
			l: "Perdu -"
		};
	}
	valid_bet(bet) {
		if(!bet) {
			return false;
		}
		if(bet > this.money) {
			return false;
		}
		return true;
	}
	async get_bet() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		while(true) {
			let bet = 0;
			const answer = await new Promise(resolve => {
				rl.question(this.money.toFixed(2) + " €, Mise : ", resolve)
			})
			if(this.is_option(answer)) {
				rl.close();
				return answer;
			}
			if(answer === "t") {
				bet = this.money;
			}
			else if (answer === "d") {
				bet = this.last_bet * 2;
			}
			else if (answer === "p") {
				bet = this.last_bet;
			}
			else {
				bet = Number(answer);
			}
			if(this.valid_bet(bet)) {
				rl.close();
				return bet;
			}
		}
	}
	bet_info() {
		console.log("Mise : ");
		console.log("t = tapis");
		console.log("d = double de la dernière mise");
		console.log("p = précédende mise");
	}
	options_info() {
		console.log("Options : ");
		Object.values(this.options).forEach(option => {
			console.log(option);
		})
	}
	info() {
		const separator = "-";
		const separator_heigth = 40;
		const small_separator_heigth = 20;
		const separator_nb = 1;

		console.log(separator.repeat(separator_heigth));
		this.options_info();
		console.log(separator.repeat(small_separator_heigth));
		this.bet_info();
		console.log(separator.repeat(separator_heigth));
		for(let i = 0 ; i< separator_nb ; i ++) {
			console.log("");
		}
	}
	is_option(response) {
		return Object.values(this.options).find(option => option === response);
	}
	async choose_game() {
		const rl = new readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		while(true) {
			const response = await new Promise(resolve => {
				rl.question("Choix de jeux : ", resolve);
			})
			if(response === this.options.exit) {
				rl.close();
				return this.options.exit;
			}
			const game_id = Number(response);
			if(!Number.isNaN(game_id) && game_id <= this.games_names.length) {
				rl.close();
				return game_id;
			}
		}
	}
	async play_Red_Black_Game() {
		this.info();
		while(this.money > 0) {
			const res = await this.get_bet();
			if(this.is_option(res) === this.options.exit) {
				return;
			} else {
				this.bet = res;
			}
			this.last_bet = this.bet;
			const game = new Red_Black_Game();
			await game.start();
			if(game.win) {
				this.money += this.bet;
				console.log(this.end_message.w, this.bet);				
			} else {
				this.money -= this.bet;
				console.log(this.end_message.l , this.bet);
			}
			console.log("---");
		}
	}
	async play_Found_The_Quenn_Game() {
		this.info();
		while(this.money > 0) {
			const res = await this.get_bet();
			if(this.is_option(res) === this.options.exit) {
				return;
			} else {
				this.bet = res;
			}
			this.last_bet = this.bet;
			const game = new Found_The_Quenn_Game();
			await game.start();
		}
	}
	async play_Horse_Race_Game() {
		this.info();
		while(this.money > 0) {
			const res = await this.get_bet();
			if(this.is_option(res) === this.options.exit) {
				return;
			} else {
				this.bet = res;
			}
			this.last_bet = this.bet;
			const game = new Horse_Race_Game();
			await game.start();
			if(game.win) {
				this.money += this.bet;
				console.log(this.end_message.w, this.bet);
			} else {
				this.money -= this.bet;
				console.log(this.end_message.l, this.bet);
			}
		}
	}
	async run() {
		while(true) {
			// game separator
			const symbol_col = 160;
			const symbol_row = 4;
			const str = "|".repeat(symbol_col);
			for(let i = 0 ; i < symbol_row ; i++) {
				console.log(str);
			}
			// game choices
			this.games_names.forEach((name, index) => {
				console.log(index, name);
			})
			console.log("");
			const res_g = await this.choose_game();
			if(res_g === this.options.exit) {
				return;
			}
			console.log("Jeux : ", this.games_names[res_g]);

			// game launcher
			switch(res_g) {
				case 0:
					await this.play_Red_Black_Game();
					break;
				case 1:
					await this.play_Found_The_Quenn_Game();
					break;
				case 2:
					await this.play_Horse_Race_Game();
					break;
				default:
					console.log("Jeux introuvable")
					console.log("----------");
				break;
			}

			if(this.money <= 0) {
				this.money = this.start_money;
			}
		}
	}
}

const session = new Game_Session();
session.run();