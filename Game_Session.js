const readline = require('node:readline');

const Red_Black_Game = require("./Red_Black_Game.js");
const { resolve } = require('node:dns');


class Game_Session {
	constructor() {
		this.start_money = 100;
		this.money = this.start_money;
		this.bet = 0;
		this.last_bet = 0;
		this.games_names = [
			"Rouge ou Noir"
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
			if(!Number.isNaN(game_id)) {
				rl.close();
				return game_id;
			}
		}
	}
	async play_Red_Black_Game() {
		console.log("Mise : ");
		console.log("t = tapis");
		console.log("d = double de la dernière mise");
		console.log("p = précédende mise");
		console.log("----------");
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
	async run() {
		while(true) {
			console.log("Arrêt session : ", this.exit);
			this.games_names.forEach((name, index) => {
				console.log(index, name);
			})
			console.log("----------");
			const res_g = await this.choose_game();
			if(res_g === this.exit) {
				return;
			}
			switch(res_g) {
				case 0:
					console.log("Jeux : Rouge ou Noir");
					console.log("----------");
					await this.play_Red_Black_Game();
					break
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