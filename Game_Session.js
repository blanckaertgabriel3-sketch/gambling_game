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
			"!!! Course de chevaux"
		]
		this.exit = "exit";
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
		console.log("----------");
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
			if(response === this.exit) {
				rl.close();
				return this.exit;
			}
			const game_id = Number(response);
			if(!Number.isNaN(game_id) && game_id <= this.games_names.length) {
				rl.close();
				return game_id;
			}
		}
	}
	async play_Red_Black_Game() {
		this.bet_info();
		while(this.money > 0) {
			this.bet = await this.get_bet();
			this.last_bet = this.bet;
			const game = new Red_Black_Game();
			await game.start();
			if(game.win) {
				this.money += this.bet;
				console.log("Gagné +", this.bet);				
			} else {
				this.money -= this.bet;
				console.log("Perdu -", this.bet);
			}
			console.log("---");
		}
	}
	async play_Found_The_Quenn_Game() {
		this.bet_info();
		while(this.money > 0) {
			const game = new Found_The_Quenn_Game();
			await game.start();
		}
	}
	async play_Horse_Race_Game() {
		this.bet_info();
		while(this.money > 0) {
			const game = new Horse_Race_Game();
			await game.start();
		}
	}
	async run() {
		while(true) {
			const symbol_col = 160;
			const symbol_row = 4;
			const str = "|".repeat(symbol_col);
			for(let i = 0 ; i < symbol_row ; i++) {
				console.log(str);
			}
			console.log(this.exit, ": Arrêt session");
			this.games_names.forEach((name, index) => {
				console.log(index, name);
			})
			console.log("----------");
			const res_g = await this.choose_game();
			if(res_g === this.exit) {
				return;
			}
			console.log("Jeux : ", this.games_names[res_g]);
			console.log("----------");
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
			this.money = this.start_money;
		}
	}
}

const session = new Game_Session();
session.run();