var fs = require("fs");
var text = fs.readFileSync("./words.txt").toString('utf-8').split("\n");
var fixed_text = []

function onlyLetters(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

for(var i = 0; i < text.length; i++) {
    if(text[i].length == 5 && onlyLetters(text[i])) {
        fixed_text.push(text[i].toLowerCase())
    }
}

fs.writeFile('./fixed_words.txt', shuffle(fixed_text).join("\n"), err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
})