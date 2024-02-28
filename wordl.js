document.addEventListener('DOMContentLoaded', async function init() {
    const letters = document.querySelectorAll('.scoreboard-letter');
    const loadingDiv = document.querySelector('.info-bar');
    const ANSWER_LENGTH = 5;
    const ROUNDS = 6;
    let currentGuess = '';
    let currentRow = 0;
    let map = makeMap([]); // Initialize map
    let done = false;

    const res = await fetch('https://words.dev-apis.com/word-of-the-day?random=1');
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    setLoading(false);
    console.log(word);

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            // add letter to the end
            currentGuess += letter;
        } else {
            // replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            return;
        }
        if (currentGuess === word) {
            alert('YOU WON!!!');
            done = true;
            letters[currentRow * ANSWER_LENGTH].classList.add("correct");
            letters[currentRow * ANSWER_LENGTH +1].classList.add("correct");
            letters[currentRow * ANSWER_LENGTH +2].classList.add("correct");
            letters[currentRow * ANSWER_LENGTH +3].classList.add("correct");
            letters[currentRow * ANSWER_LENGTH +4].classList.add("correct");




            return;
        }
        const guessParts = currentGuess.split('');

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                if (map[guessParts[i]]) {
                    map[guessParts[i]]--; // Adjust map
                }
            }
        }
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                continue; // Skip already marked correct letters
            } else if (wordParts.includes(guessParts[i]) > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
            } else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }
        
        currentRow++;
        currentGuess = "";
        if (currentRow === ROUNDS) {
            alert(`YOU LOST THE WORD WAS: ${word}`);
            done = true;
        }
    }

    function backspace() {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
        }
    }

    document.addEventListener('keydown', function handleKeyPress(event) {
        if (done) {
            return; // If game is done, do nothing
        }
        const action = event.key;

        console.log(action);
        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // do nothing
        }
    });

    function setLoading(isLoading) {
        loadingDiv.classList.toggle('show', isLoading);
    }

    function makeMap(array) {
        const obj = {};
        for (let i = 0; i < array.length; i++) {
            const letter = array[i];
            if (obj[letter]) {
                obj[letter]++;
            } else {
                obj[letter] = 1;
            }
        }
        return obj; // Return the created map
    }
});

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
};
