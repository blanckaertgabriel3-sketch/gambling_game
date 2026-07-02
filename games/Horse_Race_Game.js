class Horse_Race_Game {
	static index = 0;
	constructor() {
		Horse_Race_Game.index ++;
	}
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async start() {
		console.log("Hi : Horse_Race_Game.js", Horse_Race_Game.index);
		await this.sleep(1000);
	}
}
module.exports = Horse_Race_Game;