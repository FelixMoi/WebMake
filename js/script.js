document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('numberForm');
	const resultDiv = document.getElementById('result');

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const type = document.getElementById('type').value;
		const min = parseInt(document.getElementById('min').value, 10);
		const max = parseInt(document.getElementById('max').value, 10);

		if (min > max) {
			resultDiv.textContent = 'Erreur : Min doit être inférieur ou égal à Max.';
			return;
		}

		let output = '';
		if (type === 'random') {
			const random = Math.floor(Math.random() * (max - min + 1)) + min;
			output = `Nombre aléatoire : <strong>${random}</strong>`;
		} else if (type === 'sequence') {
			const sequence = [];
			for (let i = min; i <= max; i++) {
				sequence.push(i);
			}
			output = `Séquence : <strong>${sequence.join(', ')}</strong>`;
		}

		// Animation du résultat
		resultDiv.style.opacity = 0;
		resultDiv.innerHTML = output;
		setTimeout(() => {
			resultDiv.style.animation = 'none';
			void resultDiv.offsetWidth; // force reflow
			resultDiv.style.animation = null;
			resultDiv.style.opacity = 1;
		}, 50);

		// Effet sur le bouton
		const btn = form.querySelector('button[type="submit"]');
		btn.style.transform = 'scale(0.95)';
		setTimeout(() => {
			btn.style.transform = '';
		}, 150);
	});
});
