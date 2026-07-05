class Found_The_Quenn_Game {
	static index = 0;
	constructor() {
		Found_The_Quenn_Game.index ++;
	}
	async start() {
		console.log("Merci", Found_The_Quenn_Game.index);
	}
}
module.exports = Found_The_Quenn_Game;