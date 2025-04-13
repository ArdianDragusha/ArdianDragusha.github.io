let players = [];

// Function to add players
function addPlayers() {
  const numPlayers = prompt("Sa lojtarë (2-8)?");

  if (numPlayers < 2 || numPlayers > 8 || isNaN(numPlayers)) {
    alert("Ju lutem, futni një numër të vlefshëm midis 2 dhe 8.");
    return;
  }

  players = [];

  for (let i = 1; i <= numPlayers; i++) {
    const playerName = prompt(`Futni emrin për Lojtarin ${i}:`);
    if (playerName.trim() === "") {
      alert("Emri i lojtarit nuk mund të jetë bosh.");
      i--;
    } else {
      players.push({ name: playerName, points: 0, rejoined: false, scoreHistory: [] });
    }
  }

  displayScoreboard();
}

// Function to display the scoreboard
function displayScoreboard() {
  let html = `
    <table>
      <tr>
        <th>Lojtari</th>
        <th>Pikët Totale</th>
        <th>Historia e Pikëve</th>
        <th>Pikët për të Shtuar</th>
      </tr>`;

  players.forEach((player, index) => {
    html += `
      <tr>
        <td>${player.name} ${player.rejoined ? "❌" : ""}</td>
        <td>${player.points}</td>
        <td>${player.scoreHistory.join(", ") || "Nuk ka pikë ende"}</td>
        <td>
          <input type="number" id="points-${index}" placeholder="Shto pikë" style="width: 80px;">
        </td>
      </tr>`;
  });

  html += `
    </table>
    <button onclick="submitAllPoints()">Dërgo të Gjitha Pikët</button>
  `;

  document.getElementById("scoreboard").innerHTML = html;
}

// Function to submit all points at once
function submitAllPoints() {
  const exceededPlayers = [];

  players.forEach((player, index) => {
    const inputField = document.getElementById(`points-${index}`);
    const pointsToAdd = parseInt(inputField.value);

    if (!isNaN(pointsToAdd)) {
      const newPoints = player.points + pointsToAdd;

      // Update score history
      player.scoreHistory.push(pointsToAdd);

      if (newPoints > 101) {
        exceededPlayers.push(index);
      } else if (Math.abs(newPoints) <= 101) {
        player.points = newPoints;
      } else {
        alert("Pikat nuk mund të kalojnë -101 ose 101.");
      }
    }

    inputField.value = ""; // Clear input fields
  });

  // Handle exceeded players *after* all points are submitted
  exceededPlayers.forEach(index => {
    const player = players[index];
    const rejoin = confirm(`${player.name} ka kaluar 101 pikë! A dëshiron të ribashkohet me lojën?`);

    if (rejoin) {
      player.rejoined = true;
      player.points = getMaxPointsExcludingPlayer(index);
    } else {
      alert(`${player.name} është jashtë lojës!`);
    }
  });

  displayScoreboard();
}

// Function to get the highest points among other players (excluding the current player)
function getMaxPointsExcludingPlayer(excludedIndex) {
  let maxPoints = 0;
  players.forEach((player, index) => {
    if (index !== excludedIndex && player.points > maxPoints) {
      maxPoints = player.points;
    }
  });
  return maxPoints;
}
