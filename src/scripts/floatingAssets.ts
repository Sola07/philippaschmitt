export const initFloatingAssets = () => {
	const mediaDesktop = window.matchMedia('(min-width: 901px)');
	const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const assets = Array.from(document.querySelectorAll<HTMLElement>('.floating-asset'));

	if (assets.length === 0) return;

	let pointerX = window.innerWidth * 0.5;
	let pointerY = window.innerHeight * 0.35;
	let pointerActive = false;
	let rafId = 0;
	let enabled = false;

	const state = assets.map((asset) => {
		const inner = asset.querySelector<HTMLElement>('.floating-asset__inner');

		return {
			asset,
			inner,
			currentX: 0,
			currentY: 0,
			settledX: 0,
			settledY: 0,
			velocityX: 0,
			velocityY: 0,
			targetX: 0,
			targetY: 0,
			currentRotate: 0,
			settledRotate: 0,
			velocityRotate: 0,
			targetRotate: 0,
			strength: Number(asset.dataset.repelStrength ?? 20),
			radius: Number(asset.dataset.repelRadius ?? 220)
		};
	});

	const resetAsset = (item: (typeof state)[number]) => {
		item.currentX = 0;
		item.currentY = 0;
		item.settledX = 0;
		item.settledY = 0;
		item.velocityX = 0;
		item.velocityY = 0;
		item.targetX = 0;
		item.targetY = 0;
		item.currentRotate = 0;
		item.settledRotate = 0;
		item.velocityRotate = 0;
		item.targetRotate = 0;

		if (!item.inner) return;

		item.inner.style.setProperty('--pointer-x', '0px');
		item.inner.style.setProperty('--pointer-y', '0px');
		item.inner.style.setProperty('--pointer-rotate', '0deg');
	};

	const applyMotion = () => {
		let hasMotion = false;

		for (const item of state) {
			const rect = item.asset.getBoundingClientRect();
			const centerX = rect.left + rect.width * 0.5;
			const centerY = rect.top + rect.height * 0.5;
			const dx = centerX - pointerX;
			const dy = centerY - pointerY;
			const distance = Math.hypot(dx, dy) || 0.0001;
			const withinRange = pointerActive && distance < item.radius;

			if (withinRange) {
				const influence = 1 - distance / item.radius;
				const eased = influence * influence;
				const push = item.strength * (0.22 + eased * 0.58);
				item.settledX = (dx / distance) * push;
				item.settledY = (dy / distance) * push;
				item.settledRotate = ((dx / distance) * 1.4 + (dy / distance) * 0.75) * eased;
			}

			item.targetX = item.settledX;
			item.targetY = item.settledY;
			item.targetRotate = item.settledRotate;

			// Softer spring motion with persistence so displaced assets don't snap back in place.
			item.velocityX = item.velocityX * 0.92 + (item.targetX - item.currentX) * 0.022;
			item.velocityY = item.velocityY * 0.92 + (item.targetY - item.currentY) * 0.022;
			item.velocityRotate =
				item.velocityRotate * 0.93 + (item.targetRotate - item.currentRotate) * 0.018;

			item.currentX += item.velocityX;
			item.currentY += item.velocityY;
			item.currentRotate += item.velocityRotate;

			if (
				Math.abs(item.currentX) > 0.02 ||
				Math.abs(item.currentY) > 0.02 ||
				Math.abs(item.currentRotate) > 0.02 ||
				Math.abs(item.velocityX) > 0.02 ||
				Math.abs(item.velocityY) > 0.02 ||
				Math.abs(item.velocityRotate) > 0.02 ||
				Math.abs(item.targetX) > 0.02 ||
				Math.abs(item.targetY) > 0.02 ||
				Math.abs(item.targetRotate) > 0.02
			) {
				hasMotion = true;
			}

			if (!item.inner) continue;

			item.inner.style.setProperty('--pointer-x', `${item.currentX.toFixed(2)}px`);
			item.inner.style.setProperty('--pointer-y', `${item.currentY.toFixed(2)}px`);
			item.inner.style.setProperty('--pointer-rotate', `${item.currentRotate.toFixed(2)}deg`);
		}

		if (enabled && (pointerActive || hasMotion)) {
			rafId = window.requestAnimationFrame(applyMotion);
		} else {
			rafId = 0;
		}
	};

	const startLoop = () => {
		if (!enabled || rafId) return;
		rafId = window.requestAnimationFrame(applyMotion);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!enabled || !mediaDesktop.matches) return;
		pointerX = event.clientX;
		pointerY = event.clientY;
		pointerActive = true;
		startLoop();
	};

	const handlePointerLeave = () => {
		pointerActive = false;
		startLoop();
	};

	const syncMode = () => {
		const shouldEnable = mediaDesktop.matches && !mediaReducedMotion.matches;

		if (shouldEnable === enabled) return;
		enabled = shouldEnable;

		if (!enabled) {
			if (rafId) {
				window.cancelAnimationFrame(rafId);
				rafId = 0;
			}
			pointerActive = false;
			for (const item of state) resetAsset(item);
			return;
		}

		startLoop();
	};

	window.addEventListener('pointermove', handlePointerMove, { passive: true });
	window.addEventListener('pointerleave', handlePointerLeave);
	window.addEventListener('blur', handlePointerLeave);
	mediaDesktop.addEventListener('change', syncMode);
	mediaReducedMotion.addEventListener('change', syncMode);
	syncMode();
};
