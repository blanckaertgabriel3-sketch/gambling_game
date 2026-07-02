class Found_The_Quenn_Game {
	static index = 0;
	constructor() {
		Found_The_Quenn_Game.index ++;
	}
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async start() {
		console.log("Hi : Found_The_Quenn_Game.js", Found_The_Quenn_Game.index);
		await this.sleep(1000);
	}
}
module.exports = Found_The_Quenn_Game;